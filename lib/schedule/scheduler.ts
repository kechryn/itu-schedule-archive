/**
 * Conflict-free schedule generation.
 *
 * Courses are grouped into two kinds of requirement:
 *   - "must" courses, which the generator fits as many of as it can;
 *   - selective groups, each needing `required` courses out of a set of options.
 *
 * Each course is a list of sections (CRNs); picking a course means picking one
 * of its sections. The search is a bounded backtracker — fan-out is capped at
 * every level because the raw search space is exponential.
 */

import type { Course } from '../data/courseData';

export interface CourseSession {
    day: string;
    /** Minutes from midnight. */
    start: number;
    end: number;
}

export interface ScheduleConstraints {
    /** Day names that should ideally stay free, e.g. ["Friday"]. */
    freeDays: string[];
    /** Prefer schedules with nothing starting before 10:30. */
    noMorning: boolean;
}

export interface SelectiveGroup {
    id: string;
    name: string;
    required: number;
    /** One entry per option course; each entry is that course's sections. */
    options: Course[][];
}

export interface GeneratedSchedule {
    courses: Course[];
    /** Percentage of requested courses placed, minus soft-constraint penalties. */
    match: number;
}

/** Hard caps that keep the exponential search bounded. */
const MAX_SCHEDULES = 100;
const MAX_MUST_SOLUTIONS = 200;
const MAX_MUST_BASES = 50;
const MAX_GROUP_VARIANTS = 20;
const MAX_EXTENSIONS = 20;

/** Courses starting before this minute count as "morning" (10:30). */
const MORNING_CUTOFF_MINUTES = 630;
const MINUTES_PER_DAY = 1440;

/** Penalty applied per violated soft constraint, in percentage points. */
const CONSTRAINT_PENALTY = 5;

function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

/** Splits "09:30/12:29" into minute offsets, handling wrap past midnight. */
function parseTimeRange(slot: string): { start: number; end: number } | null {
    const [startStr, endStr] = slot.split('/');
    if (!startStr || !endStr) return null;

    const start = timeToMinutes(startStr);
    let end = timeToMinutes(endStr);
    if (end < start) end += MINUTES_PER_DAY;
    return { start, end };
}

/**
 * Expands the parallel `days` / `times` columns into concrete sessions.
 *
 * The upstream data does not always supply one time per day, so three shapes
 * have to be handled.
 */
export function parseSchedule(times: string, days: string): CourseSession[] {
    if (!times || !days) return [];

    const dayList = days.split(',').map(d => d.trim());
    const timeList = times.split(',').map(t => t.trim());
    const sessions: CourseSession[] = [];

    // One time slot shared by every day: "Mon,Wed,Fri" + "10:00/12:00".
    if (timeList.length === 1 && dayList.length >= 1) {
        const range = parseTimeRange(timeList[0]);
        if (!range) return [];
        return dayList.map(day => ({ day, ...range }));
    }

    // Fewer times than days: assume the first slot repeats across the extra
    // days (typically a lecture) and later slots map 1-to-1 (typically labs).
    if (dayList.length > timeList.length && timeList.length > 0) {
        let dayIndex = 0;
        const first = parseTimeRange(timeList[0]);

        if (first) {
            const repeats = 1 + (dayList.length - timeList.length);
            for (let k = 0; k < repeats && dayIndex < dayList.length; k++) {
                sessions.push({ day: dayList[dayIndex++], ...first });
            }
        }

        for (let i = 1; i < timeList.length && dayIndex < dayList.length; i++) {
            const range = parseTimeRange(timeList[i]);
            if (range) sessions.push({ day: dayList[dayIndex++], ...range });
        }

        return sessions;
    }

    // Straight 1-to-1 mapping.
    const count = Math.min(dayList.length, timeList.length);
    for (let i = 0; i < count; i++) {
        const range = parseTimeRange(timeList[i]);
        if (range) sessions.push({ day: dayList[i], ...range });
    }

    return sessions;
}

/** True when two courses have overlapping sessions on the same day. */
export function checkConflict(courseA: Course, courseB: Course): boolean {
    const sessionsA = parseSchedule(courseA.times || '', courseA.days || '');
    const sessionsB = parseSchedule(courseB.times || '', courseB.days || '');

    for (const a of sessionsA) {
        for (const b of sessionsB) {
            if (a.day === b.day && a.start < b.end && b.start < a.end) return true;
        }
    }
    return false;
}

function conflictsWithAny(section: Course, scheduled: Course[]): boolean {
    return scheduled.some(existing => checkConflict(section, existing));
}

interface ScheduleState {
    courses: Course[];
    mustCount: number;
    /** groupId -> how many of that group's requirement was met. */
    selectiveCounts: Record<string, number>;
}

/**
 * Places as many "must" courses as possible, returning several distinct
 * near-optimal bases rather than a single answer, so the caller can offer
 * genuinely different timetables.
 */
function solveMustCourses(mustCourses: Course[][]): { courses: Course[]; count: number }[] {
    let solutions: { courses: Course[]; count: number }[] = [];

    // Skipping is always an allowed branch: a 5-of-6 schedule that works beats
    // a 6-of-6 that does not exist. Lower-scoring results are filtered below.
    function backtrack(idx: number, current: Course[]): void {
        if (idx === mustCourses.length) {
            solutions.push({ courses: current, count: current.length });
            return;
        }

        for (const section of mustCourses[idx]) {
            if (!conflictsWithAny(section, current)) {
                backtrack(idx + 1, [...current, section]);
                if (solutions.length > MAX_MUST_SOLUTIONS) return;
            }
        }

        backtrack(idx + 1, current);
    }

    backtrack(0, []);
    solutions.sort((a, b) => b.count - a.count);

    // Drop clearly inferior bases, keeping the top tier only.
    if (solutions.length > 0) {
        const best = solutions[0].count;
        solutions = solutions.filter(s => s.count >= best - 2);
    }

    // Collapse bases that select the same set of sections.
    const bySignature = new Map<string, { courses: Course[]; count: number }>();
    for (const solution of solutions) {
        const signature = solution.courses.map(c => c.crn).sort().join('|');
        if (!bySignature.has(signature)) bySignature.set(signature, solution);
    }

    return [...bySignature.values()].slice(0, MAX_MUST_BASES);
}

/** Index combinations of size `k` drawn from `0..n-1`. */
function getCombinations(n: number, k: number): number[][] {
    if (k > n) return [];
    if (k === 0) return [[]];

    const result: number[][] = [];
    function backtrack(start: number, current: number[]): void {
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        for (let i = start; i < n; i++) backtrack(i + 1, [...current, i]);
    }
    backtrack(0, []);
    return result;
}

/**
 * Every way to pick one section per course in `coursesToSolve` that conflicts
 * neither with `base` nor within itself.
 */
function findValidExtension(base: Course[], coursesToSolve: Course[][]): Course[][] {
    const results: Course[][] = [];

    function solve(idx: number, extension: Course[]): void {
        if (results.length > MAX_EXTENSIONS) return;
        if (idx === coursesToSolve.length) {
            results.push(extension);
            return;
        }

        for (const section of coursesToSolve[idx]) {
            if (!conflictsWithAny(section, base) && !conflictsWithAny(section, extension)) {
                solve(idx + 1, [...extension, section]);
            }
        }
    }

    solve(0, []);
    return results;
}

/**
 * Fills one selective group as fully as possible: tries to place `required`
 * courses, falling back to fewer only when that is infeasible.
 */
function solveGroup(
    group: SelectiveGroup,
    schedule: Course[]
): { placed: number; variants: Course[][] } {
    const variants: Course[][] = [];

    for (let k = group.required; k >= 1; k--) {
        for (const combination of getCombinations(group.options.length, k)) {
            const found = findValidExtension(schedule, combination.map(i => group.options[i]));
            if (found.length > 0) {
                variants.push(...found);
                if (variants.length > MAX_GROUP_VARIANTS) break;
            }
        }
        if (variants.length > 0) return { placed: k, variants };
    }

    // Nothing from this group fits; continue with an unchanged schedule.
    return { placed: 0, variants: [[]] };
}

/** Percentage of requested courses placed, less soft-constraint penalties. */
function scoreSchedule(
    state: ScheduleState,
    totalRequested: number,
    constraints: ScheduleConstraints
): number {
    const selectivePlaced = Object.values(state.selectiveCounts).reduce((a, b) => a + b, 0);
    const placed = state.mustCount + selectivePlaced;
    const base = totalRequested > 0 ? (placed / totalRequested) * 100 : 100;

    let penalties = 0;

    if (constraints.freeDays?.length) {
        const usedDays = new Set<string>();
        for (const course of state.courses) {
            for (const session of parseSchedule(course.times || '', course.days || '')) {
                usedDays.add(session.day);
            }
        }
        for (const day of constraints.freeDays) {
            if (usedDays.has(day)) penalties += CONSTRAINT_PENALTY;
        }
    }

    if (constraints.noMorning) {
        const hasMorning = state.courses.some(course =>
            parseSchedule(course.times || '', course.days || '')
                .some(session => session.start < MORNING_CUTOFF_MINUTES)
        );
        if (hasMorning) penalties += CONSTRAINT_PENALTY;
    }

    return Math.max(0, parseFloat((base - penalties).toFixed(1)));
}

/**
 * Generates conflict-free schedules, best match first.
 *
 * @param mustCourses     One entry per required course; each entry is its sections.
 * @param selectiveGroups Elective groups, each with its own quota.
 */
export function generateSchedules(
    mustCourses: Course[][],
    selectiveGroups: SelectiveGroup[],
    constraints: ScheduleConstraints
): GeneratedSchedule[] {
    const totalRequested =
        mustCourses.length + selectiveGroups.reduce((sum, g) => sum + g.required, 0);

    const bases = solveMustCourses(mustCourses);
    const schedules: ScheduleState[] = [];

    for (const base of bases) {
        // Groups are resolved in order, each extending the schedule built so far.
        function fillGroups(
            groupIdx: number,
            courses: Course[],
            selectiveCounts: Record<string, number>
        ): void {
            if (groupIdx === selectiveGroups.length) {
                schedules.push({ courses, mustCount: base.count, selectiveCounts });
                return;
            }

            const group = selectiveGroups[groupIdx];
            const { placed, variants } = solveGroup(group, courses);

            for (const variant of variants) {
                fillGroups(groupIdx + 1, [...courses, ...variant], {
                    ...selectiveCounts,
                    [group.id]: placed,
                });
            }
        }

        fillGroups(0, base.courses, {});
    }

    return schedules
        .map(state => ({
            courses: state.courses,
            match: scoreSchedule(state, totalRequested, constraints),
        }))
        .sort((a, b) => b.match - a.match)
        .slice(0, MAX_SCHEDULES);
}
