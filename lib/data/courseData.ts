/**
 * Shared course data format.
 *
 * Course rows are stored as positional tuples rather than objects: repeating
 * 16 key names across ~5000 rows per term costs more than the values do
 * (~32% larger after brotli). The scraper and the browser both go through the
 * helpers here, so the field order is defined in exactly one place.
 */

export interface Course {
    id: string;
    crn: string;
    code: string;
    title: string;
    level: string | null;
    teachingMethod: string | null;
    instructor: string | null;
    building: string | null;
    days: string | null;
    times: string | null;
    rooms: string | null;
    capacity: string | null;
    enrolled: string | null;
    reservation: string | null;
    majorRestriction: string | null;
    prerequisites: string | null;
    creditConstraint: string | null;
}

/** Field order of a serialized course tuple. Append-only — never reorder. */
const COURSE_FIELDS = [
    'crn',
    'code',
    'title',
    'level',
    'teachingMethod',
    'instructor',
    'building',
    'days',
    'times',
    'rooms',
    'capacity',
    'enrolled',
    'reservation',
    'majorRestriction',
    'prerequisites',
    'creditConstraint',
] as const;

export type CourseField = (typeof COURSE_FIELDS)[number];
export type CourseTuple = (string | null)[];

/** One entry per term in `public/data/index.json`. */
export interface TermSummary {
    id: string;
    name: string;
    /** "2025-2026" */
    year: string;
    /** Normalized English season: Fall | Spring | Summer */
    season: string;
    courseCount: number;
    /** Distinct levels, precomputed so the UI can render filters before the term loads. */
    levels: string[];
}

export interface TermIndex {
    generatedAt: string;
    terms: TermSummary[];
}

/** Payload of `public/data/terms/{id}.json`. */
export interface TermData {
    id: string;
    name: string;
    rows: CourseTuple[];
}

const SEASON_MAP: Record<string, string> = {
    Yaz: 'Summer',
    Bahar: 'Spring',
    Güz: 'Fall',
    Guz: 'Fall',
};

const SEASON_ORDER: Record<string, number> = { Summer: 0, Spring: 1, Fall: 2 };

/**
 * "2025-2026_Güz_Dönemi_Ders_Programları" -> { year: "2025-2026", season: "Fall" }
 * Terms are stored with either underscores or spaces, so normalize first.
 */
export function parseTermName(name: string): { year: string; season: string; label: string } {
    const normalized = name.replace(/_/g, ' ');
    const match = normalized.match(/(\d{4}-\d{4})\s+(\S+)/);
    const year = match ? match[1] : 'Other';
    const rawSeason = match ? match[2] : normalized;
    const season = SEASON_MAP[rawSeason] ?? rawSeason;
    return { year, season, label: `${year} ${season}` };
}

/** Newest academic year first; within a year Summer -> Spring -> Fall. */
export function compareTerms(a: { year: string; season: string }, b: { year: string; season: string }): number {
    const endYear = (y: string) => parseInt(y.split('-')[1] ?? '0', 10) || 0;
    const yearDiff = endYear(b.year) - endYear(a.year);
    if (yearDiff !== 0) return yearDiff;
    return (SEASON_ORDER[a.season] ?? 99) - (SEASON_ORDER[b.season] ?? 99);
}

/**
 * Course identity. CRN is unique within a term and, unlike the previous
 * database cuid, survives a re-scrape — so schedules saved in localStorage
 * keep resolving after the term is refreshed.
 */
export function courseId(termId: string, crn: string): string {
    return `${termId}:${crn}`;
}

export function encodeCourse(course: Partial<Record<CourseField, unknown>>): CourseTuple {
    return COURSE_FIELDS.map((field) => {
        const value = course[field];
        return value === undefined || value === null || value === '' ? null : String(value);
    });
}

function decodeCourse(row: CourseTuple, termId: string): Course {
    const course = { id: '' } as unknown as Record<CourseField | 'id', string | null>;
    for (let i = 0; i < COURSE_FIELDS.length; i++) {
        course[COURSE_FIELDS[i]] = row[i] ?? null;
    }
    course.id = courseId(termId, course.crn ?? '');
    return course as unknown as Course;
}

export function decodeTerm(data: TermData): Course[] {
    const out = new Array<Course>(data.rows.length);
    for (let i = 0; i < data.rows.length; i++) out[i] = decodeCourse(data.rows[i], data.id);
    return out;
}

/** "BLG 102E" -> "BLG". Subject is the token before the first space. */
export function subjectOf(code: string): string {
    const space = code.indexOf(' ');
    return space === -1 ? code.trim() : code.slice(0, space);
}
