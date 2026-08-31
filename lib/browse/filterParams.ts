/**
 * The archive's browsing state, carried in the query string.
 *
 * Year, season, level and subject used to live only in React state, so a
 * refresh dropped the whole drill-down and a filtered view could not be linked
 * or shared. Putting them in the URL fixes all three, and costs nothing on a
 * static host: no extra pages, no build work.
 *
 * The query string, not the path. A path segment per filter would mean
 * prerendering one page per combination — 46,124 of them for course-and-term,
 * about 1.5 GB of HTML, past what GitHub Pages will publish.
 */
export interface BrowseFilters {
    year: string;
    season: string;
    level: string;
    subject: string;
}

export const EMPTY_FILTERS: BrowseFilters = { year: '', season: '', level: '', subject: '' };

/** Which filters belong in the URL. On a term page the term is the path. */
export type FilterKey = keyof BrowseFilters;

export const TERM_PAGE_KEYS: FilterKey[] = ['level', 'subject'];
export const INDEX_PAGE_KEYS: FilterKey[] = ['year', 'season', 'level', 'subject'];

export function parseFilters(search: string): BrowseFilters {
    const params = new URLSearchParams(search);
    return {
        year: params.get('year') ?? '',
        season: params.get('season') ?? '',
        level: params.get('level') ?? '',
        subject: params.get('subject') ?? '',
    };
}

/**
 * The query string for a set of filters, or '' when none are set. Empty values
 * are dropped rather than written as `level=`, so a bare drill-down leaves the
 * canonical URL untouched.
 */
export function serializeFilters(filters: BrowseFilters, keys: FilterKey[]): string {
    const params = new URLSearchParams();
    for (const key of keys) {
        if (filters[key]) params.set(key, filters[key]);
    }
    const query = params.toString();
    return query ? `?${query}` : '';
}
