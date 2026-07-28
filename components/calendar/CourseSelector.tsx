'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Check, Loader2 } from 'lucide-react';
import { useSchedule } from '@/context/ScheduleContext';
import ModernSelect from '@/components/ui/ModernSelect';
import { getTerms, getTerm, TermStore, type Course } from '@/lib/data/client';
import { parseTermName, type TermSummary } from '@/lib/data/courseData';

export default function CourseSelector() {
    const { addCourse, isCourseSelected } = useSchedule();

    const [terms, setTerms] = useState<TermSummary[]>([]);
    const [selectedTermId, setSelectedTermId] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);

    const [loaded, setLoaded] = useState<{ termId: string; store: TermStore } | null>(null);
    const [termsLoaded, setTermsLoaded] = useState(false);

    const parsedTerms = useMemo(
        () =>
            terms.map((t) => {
                const { year, season, label } = parseTermName(t.name);
                return { id: t.id, year, season, displayName: label, levels: t.levels };
            }),
        [terms]
    );

    const levels = useMemo(
        () => parsedTerms.find((t) => t.id === selectedTermId)?.levels ?? [],
        [parsedTerms, selectedTermId]
    );

    // Tagged with its term so a late response for a previous term is ignored.
    const store = loaded?.termId === selectedTermId ? loaded.store : null;
    const loadingTermData = !!selectedTermId && !store;

    // Selecting a different term invalidates the current drill-down and
    // resets the level filter to this term's default.
    const [renderedTermId, setRenderedTermId] = useState(selectedTermId);
    if (renderedTermId !== selectedTermId) {
        setRenderedTermId(selectedTermId);
        setSelectedCourseCode(null);
        // Undergraduate is the common case; fall back to the first level.
        setSelectedLevel(levels.includes('undergraduate') ? 'undergraduate' : levels[0] ?? '');
    }

    // 1. Term index (4 KB) on mount.
    useEffect(() => {
        let cancelled = false;
        getTerms()
            .then((data) => {
                if (cancelled) return;
                setTerms(data);
                if (data.length > 0) setSelectedTermId(data[0].id);
            })
            .catch((e) => console.error('Failed to load terms', e))
            .finally(() => {
                if (!cancelled) setTermsLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // 2. Term courses — one fetch; search and sections are derived from it.
    useEffect(() => {
        if (!selectedTermId) return;

        let cancelled = false;
        getTerm(selectedTermId)
            .then((store) => {
                if (!cancelled) setLoaded({ termId: selectedTermId, store });
            })
            .catch((e) => console.error('Failed to load term', e));

        return () => {
            cancelled = true;
        };
    }, [selectedTermId]);

    // 3. Debounce only the input; the search itself is a synchronous scan.
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(query.trim()), 200);
        return () => clearTimeout(handler);
    }, [query]);

    const searchResults = useMemo(() => {
        if (!store || debouncedQuery.length < 2) return [];
        return store.search(debouncedQuery, { level: selectedLevel || undefined, field: 'code' });
    }, [store, debouncedQuery, selectedLevel]);

    const sections: Course[] = useMemo(
        () => (store && selectedCourseCode ? store.sections([selectedCourseCode]) : []),
        [store, selectedCourseCode]
    );

    const handleSelectCourse = (code: string) => {
        setSelectedCourseCode((current) => (current === code ? null : code));
    };

    const loadingSearch = loadingTermData && debouncedQuery.length >= 2;

    return (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Header / Selectors */}
            <div className="p-5 border-b border-slate-100 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Plus className="w-5 h-5" />
                    </div>
                    Add Courses
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    {/* Term Selector */}
                    <ModernSelect
                        label="Term"
                        value={selectedTermId}
                        onChange={(val) => setSelectedTermId(val)}
                        options={parsedTerms.map(t => ({ label: t.displayName, value: t.id }))}
                        placeholder="Select Term"
                        disabled={!termsLoaded}
                    />

                    {/* Level Selector */}
                    <ModernSelect
                        label="Level"
                        value={selectedLevel}
                        onChange={(val) => setSelectedLevel(val)}
                        options={[
                            { label: 'All Levels', value: '' },
                            ...levels.map(l => ({ label: l, value: l }))
                        ]}
                        placeholder="Select Level"
                        disabled={levels.length === 0}
                    />
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search (e.g. MAT 103)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-slate-100/50 border border-slate-200/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                    />
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    {loadingSearch && <Loader2 className="absolute right-3.5 top-3 w-4 h-4 text-blue-500 animate-spin" />}
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {/* Course List */}
                {!selectedCourseCode && searchResults.map(course => (
                    <button
                        key={course.code}
                        onClick={() => handleSelectCourse(course.code)}
                        className="w-full text-left p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-all group relative overflow-hidden"
                    >
                        <div className="font-bold text-slate-800 text-sm flex justify-between items-center relative z-10">
                            {course.code}
                            <span className="text-blue-600 opacity-0 group-hover:opacity-100 text-[10px] font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full transition-all transform translate-x-2 group-hover:translate-x-0">Sections</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5 relative z-10 font-medium">{course.title}</div>
                    </button>
                ))}

                {/* Section List (Drill Down) */}
                {selectedCourseCode && (
                    <div className="space-y-3 p-1 animate-in slide-in-from-right-4 duration-300">
                        <button
                            onClick={() => setSelectedCourseCode(null)}
                            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2 font-bold uppercase tracking-wide px-1"
                        >
                            &larr; Back to results
                        </button>

                        <div className="flex items-center justify-between px-1">
                            <h4 className="font-extrabold text-slate-900 text-lg">{selectedCourseCode}</h4>
                        </div>

                        {sections.map(section => {
                            const selected = isCourseSelected(section.id);
                            return (
                                <div key={section.id} className={`p-3.5 rounded-2xl border text-sm transition-all duration-200 ${selected ? 'bg-blue-50/80 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg font-medium">CRN: {section.crn}</span>
                                        <button
                                            onClick={() => !selected && addCourse(section)}
                                            disabled={selected}
                                            className={`p-2 rounded-lg text-xs font-bold transition-all ${selected
                                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                                : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20'
                                                }`}
                                        >
                                            {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    <div className="text-slate-800 font-semibold truncate mb-1">{section.instructor}</div>
                                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 font-medium opacity-80">
                                        <span>{section.days}</span>
                                        <span>{section.times}</span>
                                        <span>{section.building}</span>
                                    </div>
                                </div>
                            );
                        })}

                        {sections.length === 0 && (
                            <div className="text-center py-6 text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">No sections found.</div>
                        )}
                    </div>
                )}

                {/* Empty States */}
                {!selectedCourseCode && searchResults.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <span className="font-medium">{query.length < 2 ? 'Type to search...' : 'No courses found'}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
