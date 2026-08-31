# 🎓 ITU Schedule Archive

> **Browse and plan your courses at Istanbul Technical University**

---

## ✨ Features

### 📚 Course Archive
Browse through **thousands of courses** from past semesters. Data is sourced directly from ITU's public records and updated regularly.

- Filter by academic term, course level, and subject code
- View detailed course information including instructors, schedules, and capacity
- Search across all available courses

### 🧙 Schedule Wizard
Plan your perfect semester with our interactive wizard:

1. **Select your courses** from available options
2. **Preview your timetable** in a visual calendar
3. **Export your schedule** as an image

### 📅 Calendar View
Visualize your weekly schedule with:

- Color-coded course cards
- Time slot grid view
- Export to PNG/PDF for sharing

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Next.js 16 (App Router, static export) |
| **Styling** | Tailwind CSS |
| **Data** | Static JSON, one file per term |
| **Hosting** | GitHub Pages (any static host works) |
| **Data Source** | ITU OBS (automated scraping) |

There is **no database and no server**. `npm run build` emits a plain
directory of HTML, JS and JSON to `out/`, which costs nothing to host.

---

## 🏗️ How the data works

`public/data` is the application's data source and is committed to the repo:

```
public/data/
  index.json                    # 27 terms: id, name, course count, levels (~4 KB)
  terms/2026-2027-fall.json     # every course in that term (~90 KB brotli)
  terms/2025-2026-spring.json
  ...
```

A term's id is a readable slug (`year-season`), not a database key — there is
no database to key against. Course rows are stored as positional tuples rather
than objects — repeating 16 key names across ~5,000 rows costs more than the
values do. `lib/data/courseData.ts` owns the field order and the encode/decode
helpers.

The browser downloads a term once, then derives levels, subjects, search
results and section lists from it in memory (`lib/data/client.ts`). Browsing
the archive previously took three sequential API round-trips per drill-down;
it now takes one fetch, and every later interaction is synchronous.

---

## 📁 Project structure

```
app/                    Routes (Next.js App Router)
  archive/[termId]/     One static page per term, via generateStaticParams
  api/                  (none — the site has no server)

components/
  course/                Archive browsing: CourseBrowser, CourseHierarchy, CourseTable, Timetable
  calendar/              Weekly planner: CourseSelector, ExportImportToolbar, CalendarHelp
  wizard/                Guided schedule builder: Wizard + its 4 steps
  layout/                Navbar
  ui/                    Generic building blocks: ModernSelect, ScrollReveal, InfoModal
  archive/               ArchiveHelp

lib/
  data/                  courseData.ts (schema), client.ts (browser data layer),
                         build.ts (build-time reader for Server Components)
  schedule/              scheduler.ts — conflict-free schedule generation
  export/                export.ts (PDF/PNG, loaded on demand), import.ts (.itusched files)

context/                 ScheduleContext — selected-courses state + localStorage
scripts/                 scraper.ts (ITU OBS -> public/data), dataStore.ts (shared writer)
public/data/             The application's data — see above
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+

### Installation

```bash
git clone https://github.com/kechryn/itu-schedule-archive.git
cd itu-schedule-archive
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables
or database setup are required — the course data is in the repo.

### Build

```bash
npm run build     # -> ./out
```

---

## ☁️ Deploying

### GitHub Pages (current)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`,
so a scraper commit redeploys the site on its own. Repo setting:
**Settings → Pages → Source: GitHub Actions**.

A project repo is served from `https://<user>.github.io/<repo>`, so the build
needs to know that prefix. `actions/configure-pages` reads it from the Pages
settings and passes it in as `NEXT_PUBLIC_BASE_PATH`:

- `<Link>` and `/_next` URLs — Next rewrites these from `basePath`.
- The course JSON — `lib/data/client.ts` calls `fetch()` by hand, which Next
  cannot see, so it prefixes `NEXT_PUBLIC_BASE_PATH` itself.

Attach a custom domain and the prefix resolves to `""`, with no code change.

`trailingSlash: true` makes the export emit `archive/index.html` instead of
`archive.html`. Next writes both a page file and a same-named directory of RSC
payloads, and a static host asked for `/archive` then has to guess between the
two — GitHub Pages picks the directory and 404s.

### Other static hosts

Cloudflare Pages or Netlify need no workflow — point them at the repo with
build command `npm run build`, output directory `out`, and no environment
variables. `public/_headers` sets long-lived immutable caching for hashed
assets and `stale-while-revalidate` for the course JSON, so repeat visits are
near-instant. GitHub Pages ignores that file and sends its own defaults.

---

## 📊 Data Updates

A GitHub Action scrapes ITU OBS on the **1st and 15th of each month**, writes the
refreshed term into `public/data`, and commits it — which triggers a redeploy.
The scraper aborts rather than overwriting good data if a run returns zero courses.

Run it manually with:

```bash
npm run scrape              # writes public/data
npm run scrape -- --dry-run # scrape only, write nothing
```

---

## 🧰 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on :3000 |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint (clean — treat new warnings as failures) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run scrape` | Refresh the current term in `public/data` |

---

## 📝 License

This project is for educational purposes. Course data belongs to Istanbul Technical University.

---

<p align="center">
  Made with ❤️ for ITU students
</p>
