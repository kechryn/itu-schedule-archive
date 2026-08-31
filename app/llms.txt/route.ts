import { getArchiveStats, getIndexGeneratedAt, getStaticTerms } from '@/lib/data/build';
import { OBS_URL, REPO_URL, SITE_NAME, absoluteUrl, termLabel } from '@/lib/seo/site';

export const dynamic = 'force-static';

/**
 * /llms.txt — an index of the site written for language models rather than
 * browsers, per the llmstxt.org convention.
 *
 * It exists because the pages are a poor read for a crawler: a term page ships
 * a UI shell and fetches its 5,000 rows client-side, so anything that does not
 * execute JavaScript sees no courses at all. Pointing straight at the JSON is
 * both more accurate and far cheaper for whoever is asking.
 *
 * Generated rather than committed so the term list cannot fall behind the
 * scraper.
 */
export async function GET() {
    const terms = getStaticTerms();
    const stats = getArchiveStats();
    const newest = terms[0];
    const oldest = terms[terms.length - 1];

    const body = `# ${SITE_NAME}

> Course schedules for Istanbul Technical University (İTÜ), covering ${stats.termCount} terms
> from ${termLabel(oldest.year, oldest.season)} to ${termLabel(newest.year, newest.season)} —
> ${stats.courseCount.toLocaleString('en-US')} course sections in total — plus a planner that
> builds conflict-free timetables from a set of chosen courses.

Data is scraped from ITU's public course schedule system (${OBS_URL}) on the 1st
and 15th of each month. Only the term ITU is currently publishing gets refreshed;
earlier terms are final. Last refreshed: ${getIndexGeneratedAt()}.

This is an unofficial project and is not affiliated with or endorsed by Istanbul
Technical University. The course data belongs to ITU.

## Reading the data directly

The pages render their course tables in the browser after fetching JSON, so
fetching the HTML will not show you any courses. Use these instead:

- [Term index](${absoluteUrl('/')}data/index.json): every term with its id, name, section count and levels.
- [One term](${absoluteUrl('/')}data/terms/${newest.id}.json): every section in that term. Swap the id for any term below.

A term file is \`{ id, name, rows }\`. Each row is a positional array, not an
object, in this field order:

\`\`\`
crn, code, title, level, teachingMethod, instructor, building, days,
times, rooms, capacity, enrolled, reservation, majorRestriction,
prerequisites, creditConstraint
\`\`\`

\`days\` is comma-separated English day names and \`times\` is \`HH:MM/HH:MM\`,
comma-separated the same way; a section meeting more than once lists each
slot. The two lists line up positionally in all but a handful of rows, where
a repeated day is collapsed in \`days\` but kept in \`times\` — treat the pairing
as a strong hint, not a guarantee, and prefer \`times\` for the number of
meetings. \`level\` is one of associate, undergraduate, graduate,
graduate_evening. Missing values are \`--\`, not null.

## Pages

- [Home](${absoluteUrl('/')}): what the site is.
- [Course archive](${absoluteUrl('/archive/')}): pick a term, level and subject code.
- [Schedule wizard](${absoluteUrl('/wizard/')}): generate conflict-free timetables from chosen courses, with free-day and start-time constraints.
- [Weekly calendar](${absoluteUrl('/calendar/')}): the selected courses on a weekly grid, exportable to PNG, JPG, SVG or PDF.
- [About](${absoluteUrl('/about/')}): data source and refresh cadence.
- [Source code](${REPO_URL}): the scraper and the site.

## Terms

${terms
    .map(
        (t) =>
            `- [${termLabel(t.year, t.season)}](${absoluteUrl(`/archive/${t.id}/`)}): ` +
            `${t.courseCount.toLocaleString('en-US')} sections. ` +
            `JSON: ${absoluteUrl('/')}data/terms/${t.id}.json`
    )
    .join('\n')}
`;

    return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
