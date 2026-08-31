'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Calendar, Loader2, Upload, FileText } from 'lucide-react';
import { importSelections } from '@/lib/export/import';
import { WizardState } from './Wizard';
import ModernSelect from '@/components/ui/ModernSelect';
import { getTerms, prefetchTerm } from '@/lib/data/client';
import { parseTermName, type TermSummary } from '@/lib/data/courseData';
import { useI18n } from '@/components/i18n/LocaleProvider';

interface StepOneTermProps {
    selectedTerm: string;
    onSelect: (id: string) => void;
    onImport?: (state: WizardState) => void;
}

export default function StepOneTerm({ selectedTerm, onSelect, onImport }: StepOneTermProps) {
    const { t } = useI18n();
    const [terms, setTerms] = useState<TermSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let cancelled = false;
        getTerms()
            .then(data => {
                if (!cancelled) setTerms(data);
            })
            .catch(err => console.error('Failed to load terms', err))
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onImport) return;

        setImporting(true);
        try {
            const data = await importSelections(file);
            if (data && data.wizardState) {
                onImport(data.wizardState as WizardState);
            } else if (data && data.courses && data.courses.length > 0) {
                // Import from calendar format - create wizard state
                const mustCodes = data.courses.map(c => c.code);
                onImport({
                    termId: data.termId || '',
                    mustCourses: mustCodes,
                    selectiveGroups: [],
                    constraints: { freeDays: [], noMorning: false }
                });
            }
        } catch (e) {
            console.error('Import failed', e);
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const parsedTerms = useMemo(
        () =>
            terms.map(t => {
                const { year, season } = parseTermName(t.name);
                return {
                    id: t.id,
                    year,
                    season,
                    originalName: t.name.replace(/_/g, ' '),
                    count: t.courseCount,
                };
            }),
        [terms]
    );

    const uniqueYears = useMemo(
        () => [...new Set(parsedTerms.map(t => t.year))].sort().reverse(),
        [parsedTerms]
    );

    // The `selectedTerm` prop is the source of truth; year and season are only
    // the two halves of the control used to pick it. Overrides let the user
    // change one half without the other snapping back. With neither set — the
    // first visit — the newest term is preselected, since the index is sorted
    // newest first.
    const propTerm = parsedTerms.find(t => t.id === selectedTerm);
    const defaultTerm = parsedTerms[0];
    const [yearOverride, setYearOverride] = useState<string | null>(null);
    const [seasonOverride, setSeasonOverride] = useState<string | null>(null);

    const selectedYear = yearOverride ?? propTerm?.year ?? defaultTerm?.year ?? '';

    const availableSeasons = useMemo(
        () =>
            parsedTerms
                .filter(t => t.year === selectedYear)
                .map(t => ({ label: t.season, value: t.season })),
        [parsedTerms, selectedYear]
    );

    // Resolve the year/season pair to a real term, falling back to the year's
    // first available season so the control can never show an invalid pair.
    const resolvedTerm = useMemo(() => {
        const forYear = parsedTerms.filter(t => t.year === selectedYear);
        const season = seasonOverride ?? propTerm?.season ?? defaultTerm?.season;
        return forYear.find(t => t.season === season) ?? forYear[0];
    }, [parsedTerms, selectedYear, seasonOverride, propTerm?.season, defaultTerm?.season]);

    const selectedSeason = resolvedTerm?.season ?? '';

    // Publish the resolved term upward, and warm its cache so step two's
    // search is instant when the user gets there.
    useEffect(() => {
        if (resolvedTerm && resolvedTerm.id !== selectedTerm) {
            onSelect(resolvedTerm.id);
        }
        if (resolvedTerm) prefetchTerm(resolvedTerm.id);
    }, [resolvedTerm, selectedTerm, onSelect]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>{t.wizard.one.loadingTerms}</p>
        </div>
    );


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            {/* Import Option */}
            {onImport && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-blue-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                {t.wizard.one.importTitle}
                            </h3>
                            <p className="text-sm text-blue-700/70 mt-1">{t.wizard.one.importBody}</p>
                        </div>
                        <button
                            onClick={handleImportClick}
                            disabled={importing}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                        >
                            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {t.wizard.one.importButton}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".itusched,.json,.png,.svg"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                </div>
            )}

            <div className="text-center space-y-4 mb-10">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600 mb-4 shadow-sm">
                    <Calendar className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">
                    {t.wizard.one.heading}
                </h2>
                <p className="text-slate-500 max-w-md mx-auto">{t.wizard.one.body}</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative">
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t.wizard.one.academicYear}</label>
                        <ModernSelect
                            value={selectedYear}
                            onChange={(val) => { setYearOverride(val); setSeasonOverride(null); }}
                            options={uniqueYears.map(y => ({ label: y, value: y }))}
                            placeholder={t.wizard.one.selectYear}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t.wizard.one.semester}</label>
                        <ModernSelect
                            value={selectedSeason}
                            onChange={setSeasonOverride}
                            options={availableSeasons}
                            placeholder={t.wizard.one.selectSemester}
                            disabled={!selectedYear}
                        />
                    </div>
                </div>

                {/* Selected Term Summary / Info */}
                {selectedTerm && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t.wizard.one.selectedTerm}</p>
                            <p className="text-blue-900 font-bold">
                                {parsedTerms.find(t => t.id === selectedTerm)?.originalName}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
