/**
 * Build-time reader for the generated data directory.
 *
 * Server components call this while `next build` prerenders the site, so the
 * data is baked into the HTML and no database is involved in a build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { TermData, TermIndex, TermSummary, decodeTerm, subjectOf } from './courseData';

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

/**
 * When the scraper last wrote the data, for sitemap lastModified. Distinct
 * from the build time: rebuilding unchanged data should not re-date every page.
 */
export function getIndexGeneratedAt(): string {
    return readTermIndex().generatedAt;
}

export function getArchiveStats(): { termCount: number; courseCount: number } {
    const terms = getStaticTerms();
    return {
        termCount: terms.length,
        courseCount: terms.reduce((sum, t) => sum + t.courseCount, 0),
    };
}

/** One course in a term, collapsed across its sections. */
export interface CatalogCourse {
    code: string;
    title: string;
    sections: number;
}

export interface CatalogSubject {
    subject: string;
    courses: CatalogCourse[];
}

const catalogCache = new Map<string, CatalogSubject[]>();

/**
 * A term's distinct courses, grouped by subject prefix.
 *
 * Read at build time so the term pages ship their course list in the HTML.
 * Without it the pages are empty to anything that does not run the app: the
 * table is fetched and rendered in the browser, and it renders nothing at all
 * until a level and a subject have been picked, so even a crawler that
 * executes JavaScript sees no courses.
 *
 * Sections are collapsed into their course, because eight CRNs of the same
 * lecture are one thing a person searches for, not eight.
 */
export function getTermCatalog(termId: string): CatalogSubject[] {
    const cached = catalogCache.get(termId);
    if (cached) return cached;

    const file = path.join(process.cwd(), 'public', 'data', 'terms', `${termId}.json`);
    if (!fs.existsSync(file)) return [];

    const term = JSON.parse(fs.readFileSync(file, 'utf8')) as TermData;
    const byCode = new Map<string, CatalogCourse>();

    for (const course of decodeTerm(term)) {
        const existing = byCode.get(course.code);
        if (existing) {
            existing.sections += 1;
            // Section titles occasionally differ in whitespace or truncation;
            // the longest one is the least abbreviated.
            if (course.title.length > existing.title.length) existing.title = course.title;
        } else {
            byCode.set(course.code, { code: course.code, title: course.title, sections: 1 });
        }
    }

    const bySubject = new Map<string, CatalogCourse[]>();
    for (const course of byCode.values()) {
        const subject = subjectOf(course.code);
        const list = bySubject.get(subject);
        if (list) list.push(course);
        else bySubject.set(subject, [course]);
    }

    const catalog = [...bySubject.entries()]
        .map(([subject, courses]) => ({
            subject,
            courses: courses.sort((a, b) => a.code.localeCompare(b.code)),
        }))
        .sort((a, b) => a.subject.localeCompare(b.subject));

    catalogCache.set(termId, catalog);
    return catalog;
}
