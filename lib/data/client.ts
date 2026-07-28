'use client';

/**
 * Client-side data layer. Replaces the former /api/* routes.
 *
 * A term's courses are fetched once as a single static JSON file and then all
 * filtering, searching and grouping happens in memory. Browsing the archive
 * used to cost three sequential round-trips (levels -> subjects -> courses);
 * now it costs one, and every subsequent interaction is synchronous.
 */

import {
    Course,
    TermData,
    TermIndex,
    TermSummary,
    decodeTerm,
    subjectOf,
} from './courseData';

export type { Course, TermSummary };

/** How many decoded terms to keep resident. Each is a few MB of objects. */
const MAX_CACHED_TERMS = 3;

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
    return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ index */

let indexPromise: Promise<TermSummary[]> | null = null;

/** Terms, newest first. Cached for the lifetime of the page. */
export function getTerms(): Promise<TermSummary[]> {
    indexPromise ??= fetchJson<TermIndex>('/data/index.json').then((d) => d.terms);
    return indexPromise;
}

/* ------------------------------------------------------------- term store */

/**
 * One term's courses plus the lookups the UI needs, each built lazily on
 * first use so loading a term for a single lookup stays cheap.
 */
export class TermStore {
    readonly id: string;
    readonly name: string;
    readonly courses: Course[];

    private byCode?: Map<string, Course[]>;
    private levelList?: string[];
    private subjectCache = new Map<string, string[]>();
    private searchIndex?: SearchEntry[];

    constructor(data: TermData) {
        this.id = data.id;
        this.name = data.name;
        this.courses = decodeTerm(data);
    }

    /** Sections grouped by course code, e.g. "BLG 102E" -> its CRNs. */
    private codeIndex(): Map<string, Course[]> {
        if (!this.byCode) {
            const map = new Map<string, Course[]>();
            for (const course of this.courses) {
                const list = map.get(course.code);
                if (list) list.push(course);
                else map.set(course.code, [course]);
            }
            this.byCode = map;
        }
        return this.byCode;
    }

    levels(): string[] {
        this.levelList ??= [
            ...new Set(this.courses.map((c) => c.level).filter((l): l is string => !!l)),
        ].sort();
        return this.levelList;
    }

    /** Distinct subject prefixes ("BLG", "MAT"), optionally within one level. */
    subjects(level?: string): string[] {
        const key = level ?? '';
        let cached = this.subjectCache.get(key);
        if (!cached) {
            const set = new Set<string>();
            for (const course of this.courses) {
                if (level && course.level !== level) continue;
                set.add(subjectOf(course.code));
            }
            cached = [...set].sort();
            this.subjectCache.set(key, cached);
        }
        return cached;
    }

    /**
     * Courses under a subject. Matches on the parsed prefix rather than a
     * string startsWith, so "MAT" cannot pull in "MATM".
     */
    coursesBySubject(subject: string, level?: string): Course[] {
        return this.courses.filter(
            (c) => subjectOf(c.code) === subject && (!level || c.level === level)
        );
    }

    /** All sections for the given course codes, in the order requested. */
    sections(codes: string[]): Course[] {
        const index = this.codeIndex();
        return codes.flatMap((code) => index.get(code) ?? []);
    }

    /** Distinct codes under a subject. */
    codesForSubject(subject: string, level?: string): string[] {
        return [...new Set(this.coursesBySubject(subject, level).map((c) => c.code))].sort();
    }

    /**
     * One entry per distinct course code (~1500, vs ~5000 rows) with its
     * search keys pre-normalized, so a keystroke is a plain substring scan.
     */
    private entries(): SearchEntry[] {
        if (!this.searchIndex) {
            const byCode = new Map<string, SearchEntry>();
            for (const course of this.courses) {
                let entry = byCode.get(course.code);
                if (!entry) {
                    entry = {
                        code: course.code,
                        title: course.title,
                        instructor: course.instructor,
                        levels: new Set(),
                        nCode: normalize(course.code),
                        nTitle: normalize(course.title),
                        nInstructor: normalize(course.instructor ?? ''),
                    };
                    byCode.set(course.code, entry);
                }
                if (course.level) entry.levels.add(course.level);
            }
            this.searchIndex = [...byCode.values()];
        }
        return this.searchIndex;
    }

    /**
     * Distinct course codes matching a query. `field: 'code'` searches codes
     * only; 'all' also searches title and instructor.
     */
    search(
        query: string,
        options: { level?: string; field?: 'code' | 'all'; limit?: number } = {}
    ): { code: string; title: string; instructor: string | null }[] {
        const { level, field = 'code', limit = 100 } = options;
        const needle = normalize(query);
        if (!needle) return [];

        const results: { code: string; title: string; instructor: string | null }[] = [];

        for (const entry of this.entries()) {
            if (level && !entry.levels.has(level)) continue;

            const hit =
                entry.nCode.includes(needle) ||
                (field === 'all' &&
                    (entry.nTitle.includes(needle) || entry.nInstructor.includes(needle)));

            if (hit) {
                results.push({ code: entry.code, title: entry.title, instructor: entry.instructor });
                if (results.length >= limit) break;
            }
        }
        return results;
    }
}

interface SearchEntry {
    code: string;
    title: string;
    instructor: string | null;
    levels: Set<string>;
    nCode: string;
    nTitle: string;
    nInstructor: string;
}

/**
 * Case- and diacritic-insensitive comparison key. Turkish course titles and
 * instructor names mean a plain toLowerCase() would miss "İ"/"ı" matches.
 */
function normalize(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // strip combining marks: ö -> o, İ -> I
        .replace(/[ıİ]/g, 'i') // dotless ı / dotted İ both fold to i
        .toLowerCase()
        .trim();
}

/* ---------------------------------------------------------------- caching */

const termCache = new Map<string, Promise<TermStore>>();

/** Loads (and caches) a term. Concurrent callers share one request. */
export function getTerm(termId: string): Promise<TermStore> {
    let entry = termCache.get(termId);
    if (!entry) {
        entry = fetchJson<TermData>(`/data/terms/${termId}.json`).then((d) => new TermStore(d));
        // Drop a failed load so a later attempt can retry instead of
        // replaying the rejection forever.
        entry.catch(() => termCache.delete(termId));
        termCache.set(termId, entry);
    } else {
        // Refresh LRU position.
        termCache.delete(termId);
        termCache.set(termId, entry);
    }

    while (termCache.size > MAX_CACHED_TERMS) {
        const oldest = termCache.keys().next().value;
        if (oldest === undefined) break;
        termCache.delete(oldest);
    }
    return entry;
}

/**
 * Starts loading a term without waiting for it, so the download overlaps with
 * the user picking a level or typing a search.
 */
export function prefetchTerm(termId: string): void {
    if (termId) void getTerm(termId).catch(() => {});
}
