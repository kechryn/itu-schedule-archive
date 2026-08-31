# ITU Schedule Archive

Course schedule archive and timetable planner for Istanbul Technical
University.

**https://kechryn.github.io/itu-schedule-archive/**

27 terms, from 2016-2017 Summer through 2026-2027 Fall — 77,061 rows, one per
CRN, scraped from [ITU OBS](https://obs.itu.edu.tr/public/DersProgram).

## What it does

### Archive

Pick a term, a course level and a subject code to list the sections OBS
publishes for it: CRN, code, title, instructor, day and time, building, room,
capacity and enrolled count.

Search matches course codes, titles and instructors. It strips diacritics and
folds `ı` and `İ` onto `i`, so `bilgisayar` matches `Bilgisayar` and `ISL`
matches `İŞL`.

The drill-down lives in the query string — `/archive/?level=undergraduate&subject=BLG`
— so a refresh keeps your place and a filtered view can be linked. On a term
page the term is the path, so only `level` and `subject` are carried there, and
changing the term navigates to that term's page rather than swapping the table
underneath a heading that still names the old one.

State is written with `replaceState`, not `pushState`: four selects would
otherwise stack four history entries and the back button would walk the
drill-down backwards instead of leaving the page. The term the page already
defaults to is left out of the query, so `/archive/` stays clean until you
actually change something.

Filters are a query string rather than path segments on purpose. A page per
combination would mean prerendering 46,124 course-and-term pages, roughly
1.5 GB of HTML — past what GitHub Pages will publish, and mostly thin
near-duplicates of each other.

### Wizard

A four-step schedule builder:

1. Pick a term.
2. Mark courses as required, or group them as "n out of these m".
3. Set constraints — days to keep free, and whether to avoid anything starting
   before 10:30.
4. Generate conflict-free timetables.

A course is a set of sections and picking the course means picking one of its
sections, so the generator is a backtracking search over section combinations.
Fan-out is capped at every level, because the unbounded search space is
exponential in the number of courses.

### Calendar

A weekly grid of the sections you have selected, kept in `localStorage`.

Exports to PNG, JPG, SVG and PDF. PNG exports carry the selection embedded in
the file, so an exported image can be imported back to restore the schedule;
`.itusched` files hold the same payload as plain JSON.

## Data

`public/data` is the application's data source and is committed to the repo:

```
public/data/
  index.json                    27 terms: id, name, course count, levels (4 KB)
  terms/2026-2027-fall.json     every section in that term (1.4 MB, 95 KB brotli)
  terms/2025-2026-spring.json
  ...
```

A term's id is a slug (`year-season`), not a database key — there is no
database. Rows are positional tuples rather than objects, because repeating 16
key names across ~5,000 rows costs more than the values do.
`lib/data/courseData.ts` owns the field order and the encode/decode helpers;
the order is append-only.

The browser downloads one term as a single file, then derives levels, subjects,
search results and section lists from it in memory (`lib/data/client.ts`).
Server Components read the index at build time through `lib/data/build.ts`.

### Updates

`.github/workflows/scrape.yml` runs on the 1st and 15th of each month, refreshes
whichever term OBS currently publishes, and commits it — which triggers a
deploy. Historical terms are never rewritten. A run that returns zero courses
aborts instead of overwriting good data.

Manually:

```bash
npm run scrape              # writes public/data
npm run scrape -- --dry-run # scrape only, write nothing
```

A full scrape is roughly 340 requests across four course levels, rate-limited
to one per 300 ms, and takes a couple of minutes.

## Development

Node.js 20 or newer. CI builds on 22.

```bash
git clone https://github.com/kechryn/itu-schedule-archive.git
cd itu-schedule-archive
npm install
npm run dev
```

Open http://localhost:3000. There are no environment variables to set and no
database to provision; the course data is in the repo.

| Command | What it does |
|---|---|
| `npm run dev` | Development server on :3000 |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run scrape` | Refresh the current term in `public/data` |

## Deployment

`npm run build` emits a directory of HTML, JS and JSON to `out/`. There is no
server component and no database.

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`, so
a scraper commit reaches the live site on its own. The repo setting is
Settings → Pages → Source: GitHub Actions.

A project repo is served from `https://<user>.github.io/<repo>`, so the build
has to know that prefix. `actions/configure-pages` reads it from the Pages
settings and passes it in as `NEXT_PUBLIC_BASE_PATH`:

- `<Link>` and `/_next` URLs — Next rewrites these from `basePath`.
- The course JSON — `lib/data/client.ts` calls `fetch()` by hand, which Next
  cannot see, so it applies the prefix itself.

Attaching a custom domain resolves the prefix to `""` with no code change.

`trailingSlash: true` makes the export emit `archive/index.html` rather than
`archive.html`. Next writes both a page file and a same-named directory of RSC
payloads, and a static host asked for `/archive` then has to choose between the
two — GitHub Pages picks the directory and 404s.

### Other static hosts

Cloudflare Pages and Netlify need no workflow: build command `npm run build`,
output directory `out`, no environment variables. `public/_headers` sets
immutable caching for hashed assets and `stale-while-revalidate` for the course
JSON. GitHub Pages ignores that file and sends its own cache headers.

## Languages

Turkish and English. Turkish is the default and sits at the root — the audience
is ITU students and the queries are Turkish — with English under `/en`.

Paths stay in English in both trees: `/archive/` is Turkish, `/en/archive/` is
English. Translating the segments would have 404'd every already-published URL,
and a keyword in the path is a far weaker signal than the same keyword in the
title, heading and body.

Only the interface is translated. Course titles, instructor names and building
codes are what OBS published and stay exactly as they are — a translated course
title would not match the official system, or what a student is searching for.
The one exception is the season, which the Turkish pages render as Güz, Bahar
and Yaz, because `2026-2027 Güz ders programı` is the phrase people type.

`lib/i18n/dictionaries.ts` holds both languages. Turkish is typed as
`typeof en`, so a missing translation is a compile error rather than an English
string appearing on a Turkish page.

There are two root layouts, `app/(tr)` and `app/(en)`, rather than one. Only a
root layout can set `<html lang>`, and it has to say `tr` on the Turkish pages;
a single layout has no way to know which language it is rendering, because the
locale is the route and a root layout receives no params. Client components read
the language from a context (`components/i18n/LocaleProvider.tsx`); server
components call `getDictionary` directly.

## Discoverability

Every route sets its own title, description and canonical URL in both
languages. The 27 term pages are the ones people search for, so
`generateMetadata` gives each its own: the Turkish page titles itself
`2026-2027 Güz Ders Programı` and carries the name OBS publishes in the
description, so both forms are matchable.

Each page declares the hreflang cluster — `tr`, `en` and `x-default` pointing at
Turkish — in its head and again in the sitemap. Without it the two versions
compete as near-duplicates instead of being understood as one page in two
languages.

- `app/sitemap.ts` emits `sitemap.xml` for all 64 URLs — every route in both
  languages, each entry carrying the hreflang set. Term pages carry the
  scraper's timestamp as `lastModified` rather than the build time, so
  rebuilding unchanged data does not re-date the whole archive.
- `app/robots.ts` emits `robots.txt`. It names the assistant crawlers
  explicitly — GPTBot, ClaudeBot, PerplexityBot and the rest — alongside the
  catch-all. `Google-Extended` and `Applebot-Extended` are not crawlers but
  opt-out switches for Gemini and Apple Intelligence, and only an explicit
  `Allow` keeps this site in.
- `lib/seo/jsonLd.ts` emits JSON-LD: `WebSite` and `WebApplication` site-wide,
  `DataCatalog` on the archive index, `Dataset` and `BreadcrumbList` on each
  term. A term of course schedules is a dataset, so the vocabulary is literal
  rather than a stretch for rich-result eligibility.
- `app/og.png/route.tsx` renders the 1200×630 social card at build time from
  the data index, so the counts on the card cannot drift. It is a route handler
  rather than the `opengraph-image` file convention: that convention emits an
  extensionless file, and GitHub Pages types responses by extension, so the
  card would go out as `application/octet-stream`.
- `app/llms.txt/route.ts` emits `/llms.txt`, an index written for language
  models. It documents the JSON files and the row format directly, since that
  is both more accurate and cheaper than reading the rendered page.

The catch is that the course table is client-side and renders nothing until a
level and subject are chosen, so the pages carried no course text at all — not
for a search engine, not for an assistant. `TermCatalog` fixes that by
rendering the term's courses on the server: 3,506 courses under 213 subject
codes for the current term. It is also just a usable index.

That content has a cost. A server component's output is serialized into the RSC
payload inline in the same document, so everything it renders is paid for
twice, and the current term's page is 646 KB uncompressed — 118 KB over the
wire, since GitHub Pages gzips. Keeping each entry to a single text node with no
nested elements is what brought it down from 2 MB.

## Security

GitHub Pages sends `Strict-Transport-Security` and nothing else, and offers no
way to add response headers. What can be set from inside the document is:

- A CSP in a `<meta>` tag, built in `lib/seo/csp.ts`. It confines scripts,
  styles, images, fonts and connections to this origin. `connect-src` is
  `'self'` — the site reaches no third party at all.
- `Referrer-Policy` via `<meta name="referrer">`, set to
  `strict-origin-when-cross-origin`.

Two limits are worth stating rather than glossing:

- `frame-ancestors` is ignored in a meta CSP, so framing cannot be blocked
  here. The app holds nothing but a course selection in `localStorage` and has
  no authenticated state, so the exposure is small — but a host that can send
  headers should set `frame-ancestors` and `X-Frame-Options`.
- `script-src` needs `'unsafe-inline'`. A static export has no server to mint a
  per-request nonce, and Next inlines the RSC payload as `self.__next_f.push`
  calls. The directive still blocks an injected `<script src="//elsewhere">`;
  it cannot block an injected inline block.

The PDF export embeds Roboto for Turkish glyph coverage. Both TTFs are
vendored in `public/fonts` and fetched from this origin, so an export cannot be
broken by a CDN being down or blocked, does not tell a third party that someone
exported a schedule, and cannot quietly receive different bytes than the ones
in the repo. `public/fonts/NOTICE.txt` carries the Apache-2.0 attribution.

`npm audit` reports no vulnerabilities, in production or including dev. Getting
there took jsPDF from 4.0.0 to 4.2.1, clearing a critical PDF-injection
advisory and a transitive DOMPurify XSS, and Next from 16.0.7 to 16.3.3,
clearing high-severity advisories in the `postcss` and `sharp` it pulls in.

## Layout

```
app/                     Routes (Next.js App Router)
  (tr)/                  Turkish tree, served from the root
  (en)/en/               English tree
                         Two root layouts, one per language — see Languages
  robots.ts sitemap.ts   Generated at build time
  og.png/ llms.txt/      Route handlers, shared by both languages

components/
  course/                Archive browsing: CourseBrowser, CourseHierarchy, CourseTable, Timetable
  calendar/              Weekly planner: CourseSelector, ExportImportToolbar, CalendarHelp
  wizard/                Wizard and its four steps
  layout/                Navbar, RootShell (the shared document)
  ui/                    ModernSelect, ScrollReveal, InfoModal
  archive/               ArchiveHelp
  pages/                 Page bodies, shared by both language trees
  i18n/                  LocaleProvider — the language, for client components
  seo/                   JsonLd

lib/
  i18n/                  config.ts (locales, path helpers), dictionaries.ts (strings)
  seo/                   site.ts (URLs, metadata, hreflang), jsonLd.ts, csp.ts
  browse/                filterParams.ts — the archive drill-down in the query string
  data/                  courseData.ts (schema), client.ts (browser data layer),
                         build.ts (build-time reader for Server Components)
  schedule/              scheduler.ts — conflict-free schedule generation
  export/                export.ts (PNG/JPG/SVG/PDF), import.ts (.itusched and PNG metadata)

context/                 ScheduleContext — selected sections plus localStorage
scripts/                 scraper.ts (ITU OBS -> public/data), dataStore.ts (writer)
public/data/             The application's data
```

Built with Next.js 16 (App Router, `output: "export"`) and Tailwind CSS.

## License

For educational purposes. Course data belongs to Istanbul Technical University.
