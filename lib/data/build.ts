/**
 * Build-time reader for the generated data directory.
 *
 * Server components call this while `next build` prerenders the site, so the
 * data is baked into the HTML and no database is involved in a build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { TermIndex, TermSummary } from './courseData';

let cached: TermIndex | null = null;

function readTermIndex(): TermIndex {
    if (!cached) {
        const file = path.join(process.cwd(), 'public', 'data', 'index.json');
        if (!fs.existsSync(file)) {
            throw new Error(
                `Missing ${file}. Course data is committed to the repo; run \`npm run scrape\` to regenerate it.`
            );
        }
        cached = JSON.parse(fs.readFileSync(file, 'utf8')) as TermIndex;
    }
    return cached;
}

/** Terms, newest first — the index is written pre-sorted. */
export function getStaticTerms(): TermSummary[] {
    return readTermIndex().terms;
}

export function getArchiveStats(): { termCount: number; courseCount: number } {
    const terms = getStaticTerms();
    return {
        termCount: terms.length,
        courseCount: terms.reduce((sum, t) => sum + t.courseCount, 0),
    };
}
