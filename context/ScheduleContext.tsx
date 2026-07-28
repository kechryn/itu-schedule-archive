'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { checkConflict } from '@/lib/schedule/scheduler';
import type { Course } from '@/lib/data/courseData';

const STORAGE_KEY = 'itu_schedule_cart';

export interface Conflict {
    courseA: string;
    courseB: string;
}

interface ScheduleContextValue {
    selectedCourses: Course[];
    conflicts: Conflict[];
    addCourse: (course: Course) => void;
    removeCourse: (courseId: string) => void;
    toggleCourse: (course: Course) => void;
    isCourseSelected: (courseId: string) => boolean;
    clearSchedule: () => void;
    importCourses: (courses: Course[]) => void;
}

const ScheduleContext = createContext<ScheduleContextValue | undefined>(undefined);

/** Reads the saved cart. Runs once, lazily, before the first render. */
function loadStoredCourses(): Course[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? (JSON.parse(saved) as Course[]) : [];
    } catch {
        // Corrupt or unreadable storage should never break the page.
        return [];
    }
}

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
    // Lazy initializer rather than a load-on-mount effect: this avoids an
    // extra render pass and the flash of an empty schedule.
    const [selectedCourses, setSelectedCourses] = useState<Course[]>(loadStoredCourses);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCourses));
        } catch {
            // Quota exceeded or private mode — the in-memory schedule still works.
        }
    }, [selectedCourses]);

    // Derived, not stored: recomputing beats keeping a second copy in sync.
    const conflicts = useMemo(() => {
        const found: Conflict[] = [];
        for (let i = 0; i < selectedCourses.length; i++) {
            for (let j = i + 1; j < selectedCourses.length; j++) {
                if (checkConflict(selectedCourses[i], selectedCourses[j])) {
                    found.push({
                        courseA: selectedCourses[i].code,
                        courseB: selectedCourses[j].code,
                    });
                }
            }
        }
        return found;
    }, [selectedCourses]);

    const addCourse = useCallback((course: Course) => {
        setSelectedCourses(prev =>
            prev.some(c => c.id === course.id) ? prev : [...prev, course]
        );
    }, []);

    const removeCourse = useCallback((courseId: string) => {
        setSelectedCourses(prev => prev.filter(c => c.id !== courseId));
    }, []);

    const toggleCourse = useCallback((course: Course) => {
        setSelectedCourses(prev =>
            prev.some(c => c.id === course.id)
                ? prev.filter(c => c.id !== course.id)
                : [...prev, course]
        );
    }, []);

    const isCourseSelected = useCallback(
        (courseId: string) => selectedCourses.some(c => c.id === courseId),
        [selectedCourses]
    );

    const clearSchedule = useCallback(() => setSelectedCourses([]), []);
    const importCourses = useCallback((courses: Course[]) => setSelectedCourses(courses), []);

    const value = useMemo(
        () => ({
            selectedCourses,
            conflicts,
            addCourse,
            removeCourse,
            toggleCourse,
            isCourseSelected,
            clearSchedule,
            importCourses,
        }),
        [
            selectedCourses,
            conflicts,
            addCourse,
            removeCourse,
            toggleCourse,
            isCourseSelected,
            clearSchedule,
            importCourses,
        ]
    );

    return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

export function useSchedule(): ScheduleContextValue {
    const context = useContext(ScheduleContext);
    if (context === undefined) {
        throw new Error('useSchedule must be used within a ScheduleProvider');
    }
    return context;
}
