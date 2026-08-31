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

Node.js 20 or newer.

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

## Layout

```
app/                     Routes (Next.js App Router)
  archive/[termId]/      One static page per term, via generateStaticParams

components/
  course/                Archive browsing: CourseBrowser, CourseHierarchy, CourseTable, Timetable
  calendar/              Weekly planner: CourseSelector, ExportImportToolbar, CalendarHelp
  wizard/                Wizard and its four steps
  layout/                Navbar
  ui/                    ModernSelect, ScrollReveal, InfoModal
  archive/               ArchiveHelp

lib/
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
