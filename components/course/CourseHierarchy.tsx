'use client';

import { useState, useEffect, useMemo } from 'react';
import { Filter, BookOpen, AlertCircle } from 'lucide-react';
import CourseTable from './CourseTable';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ModernSelect from '@/components/ui/ModernSelect';
import { getTerm, TermStore } from '@/lib/data/client';
import { parseTermName, type TermSummary } from '@/lib/data/courseData';

interface Props {
    termId: string;
    terms?: TermSummary[];
}

export default function CourseHierarchy({ termId: initialTermId, terms = [] }: Props) {
    // Terms arrive prerendered from the build, so the year/season selectors
    // are populated on first paint with no request.
    const parsedTerms = useMemo(
        () =>
            terms.map((t) => {
                const { year, season, label } = parseTermName(t.name);
                return { id: t.id, year, season, label, levels: t.levels };
            }),
        [terms]
    );

    const uniqueYears = useMemo(
        () => [...new Set(parsedTerms.map((t) => t.year))].sort().reverse(),
        [parsedTerms]
    );

    const initialTerm = parsedTerms.find((t) => t.id === initialTermId) ?? parsedTerms[0];

    const [selectedYear, setSelectedYear] = useState(initialTerm?.year ?? '');
    const [requestedSeason, setRequestedSeason] = useState(initialTerm?.season ?? '');

    const availableSeasons = useMemo(
        () =>
            parsedTerms
                .filter((t) => t.year === selectedYear)
                .map((t) => ({ label: t.season, value: t.season })),
        [parsedTerms, selectedYear]
    );

    // The selected term is derived, not stored. When a year has no matching
    // season the first available one wins, so the two selects can never
    // disagree about which term is shown.
    const currentTerm = useMemo(() => {
        const forYear = parsedTerms.filter((t) => t.year === selectedYear);
        return forYear.find((t) => t.season === requestedSeason) ?? forYear[0];
    }, [parsedTerms, selectedYear, requestedSeason]);

    const currentTermId = currentTerm?.id ?? '';
    const selectedSeason = currentTerm?.season ?? '';

    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loaded, setLoaded] = useState<{ termId: string; store: TermStore } | null>(null);
    const [failedTermId, setFailedTermId] = useState<string | null>(null);

    // Changing term invalidates the level/subject drill-down. Adjusting state
    // during render is the documented React pattern for this and avoids the
    // extra render an effect would cost.
    const [renderedTermId, setRenderedTermId] = useState(currentTermId);
    if (renderedTermId !== currentTermId) {
        setRenderedTermId(currentTermId);
        setSelectedLevel('');
        setSelectedSubject('');
    }

    // Tagging the result with its term means a slow response for a previously
    // selected term can never be mistaken for the current one.
    const store = loaded?.termId === currentTermId ? loaded.store : null;
    const error = failedTermId === currentTermId;
    const loading = !store && !error;

    // Levels come from the prerendered index, so the level buttons render
    // before the term's course file has finished downloading.
    const levels = currentTerm?.levels ?? [];

    // One fetch per term; everything below is derived in memory.
    useEffect(() => {
        if (!currentTermId) return;

        let cancelled = false;
        getTerm(currentTermId)
            .then((store) => {
                if (!cancelled) setLoaded({ termId: currentTermId, store });
            })
            .catch(() => {
                if (!cancelled) setFailedTermId(currentTermId);
            });

        return () => {
            cancelled = true;
        };
    }, [currentTermId]);

    const subjects = useMemo(
        () => (store && selectedLevel ? store.subjects(selectedLevel) : []),
        [store, selectedLevel]
    );

    const courses = useMemo(
        () =>
            store && selectedSubject && selectedLevel
                ? store.coursesBySubject(selectedSubject, selectedLevel)
                : [],
        [store, selectedSubject, selectedLevel]
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto">

            {/*  Filter Section (Bento Card) */}
            <ScrollReveal>
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative group z-50">
                    {/* Decorative background blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 p-8 sm:p-10">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600">
                                <Filter className="w-5 h-5" />
                            </div>
                            Browse Archive
                        </h3>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Step 1: Term (Split into Year & Season) */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">1. Academic Term</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <ModernSelect
                                        label="Year"
                                        value={selectedYear}
                                        onChange={setSelectedYear}
                                        options={uniqueYears.map(y => ({ label: y, value: y }))}
                                        placeholder="Year"
                                    />
                                    <ModernSelect
                                        label="Semester"
                                        value={selectedSeason}
                                        onChange={setRequestedSeason}
                                        options={availableSeasons}
                                        placeholder="Select Semester"
                                        disabled={!selectedYear}
                                    />
                                </div>
                            </div>

                            {/* Step 2: Level */}
                            <div className={`space-y-3 transition-opacity duration-300 ${!currentTermId ? 'opacity-40 pointer-events-none' : ''}`}>
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">2. Course Level</label>
                                <div className="flex flex-wrap gap-2">
                                    {levels.length > 0 ? (
                                        levels.map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => { setSelectedLevel(lvl); setSelectedSubject(''); }}
                                                className={`px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${selectedLevel === lvl
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 ring-2 ring-blue-100'
                                                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md'
                                                    }`}
                                            >
                                                {lvl.replace(/_/g, ' ')}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-transparent"></div>
                                            Loading...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 3: Subject */}
                            <div className={`space-y-3 transition-opacity duration-300 ${!selectedLevel ? 'opacity-40 pointer-events-none' : ''}`}>
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">3. Subject Code</label>
                                <ModernSelect
                                    value={selectedSubject}
                                    onChange={setSelectedSubject}
                                    options={subjects.map(s => ({ label: s, value: s }))}
                                    placeholder={loading && selectedLevel ? 'Loading…' : 'Select Code'}
                                    disabled={!selectedLevel || subjects.length === 0}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Content Area */}
            {error ? (
                <ScrollReveal delay={200}>
                    <div className="flex flex-col items-center justify-center py-32 text-slate-500 border-2 border-dashed border-red-200 rounded-[2.5rem] bg-red-50/40">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-lg shadow-red-100 flex items-center justify-center mb-6 ring-1 ring-red-100">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-700 mb-2">Something went wrong</p>
                        <p className="text-slate-500 font-medium max-w-xs text-center">Could not load courses for this term. Please try again.</p>
                    </div>
                </ScrollReveal>
            ) : selectedSubject ? (
                <ScrollReveal delay={200}>
                    <div>
                        <div className="flex items-end justify-between mb-6 px-4">
                            <div>
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
                                    {selectedSubject}
                                </h2>
                                <p className="text-lg text-slate-500 font-medium">Found {courses.length} classes available</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <CourseTable courses={courses} />
                        </div>
                    </div>
                </ScrollReveal>
            ) : (
                <ScrollReveal delay={200}>
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400 border-2 border-dashed border-slate-200/80 rounded-[2.5rem] bg-slate-50/50">
                        {selectedLevel ? (
                            <>
                                <div className="w-20 h-20 rounded-3xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center mb-6 ring-1 ring-slate-100">
                                    <BookOpen className="w-8 h-8 text-blue-500" />
                                </div>
                                <p className="text-2xl font-bold text-slate-700 mb-2">Ready to explore</p>
                                <p className="text-slate-500 font-medium max-w-xs text-center">Select a <span className="text-blue-600">Subject Code</span> above to view the full schedule.</p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 rounded-3xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center mb-6 ring-1 ring-slate-100">
                                    <Filter className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-2xl font-bold text-slate-700 mb-2">Start Browsing</p>
                                <p className="text-slate-500 font-medium max-w-xs text-center">Select a <span className="text-blue-600">Term and Level</span> to begin your search.</p>
                            </>
                        )}
                    </div>
                </ScrollReveal>
            )}
        </div>
    );
}
