'use client';

import { Calendar, Sun, Moon } from 'lucide-react';
import type { ScheduleConstraints } from '@/lib/schedule/scheduler';
import { useI18n } from '@/components/i18n/LocaleProvider';

interface StepThreeConstraintsProps {
    value: ScheduleConstraints;
    onChange: (value: ScheduleConstraints) => void;
}

export default function StepThreeConstraints({ value, onChange }: StepThreeConstraintsProps) {
    const { t } = useI18n();
    const toggleDay = (day: string) => {
        const current = value.freeDays ?? [];
        onChange({
            ...value,
            freeDays: current.includes(day)
                ? current.filter(d => d !== day)
                : [...current, day],
        });
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // The array above holds the English keys the scheduler matches on; only
    // the button label is translated.
    const dayLabels = t.wizard.three.dayShort;

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.wizard.three.heading}</h2>
                <p className="text-slate-500">{t.wizard.three.body}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Days Card */}
                <div className="bg-white/40 p-6 rounded-2xl border border-white/50 shadow-sm backdrop-blur-md transition-all hover:bg-white/50 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-50/80 text-blue-600 backdrop-blur-sm">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t.wizard.three.freeDays}</h3>
                            <p className="text-xs text-slate-500">{t.wizard.three.freeDaysHint}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {days.map(day => {
                            const isSelected = value.freeDays?.includes(day);
                            return (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${isSelected
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white/60 border-white/60 text-slate-600 hover:bg-white hover:border-blue-300'
                                        }`}
                                >
                                    {dayLabels[day] || day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Morning Card */}
                <div className="bg-white/40 p-6 rounded-2xl border border-white/50 shadow-sm flex flex-col justify-between backdrop-blur-md transition-all hover:bg-white/50 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg transition-colors backdrop-blur-sm ${value.noMorning ? 'bg-orange-100/80 text-orange-600' : 'bg-slate-100/80 text-slate-500'}`}>
                            {value.noMorning ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t.wizard.three.morningClasses}</h3>
                            <p className="text-xs text-slate-500">{t.wizard.three.morningHint}</p>
                        </div>
                    </div>

                    <div className="bg-white/50 p-4 rounded-xl border border-white/60 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all backdrop-blur-sm"
                        onClick={() => onChange({ ...value, noMorning: !value.noMorning })}>
                        <div className="text-sm font-medium text-slate-700">
                            {value.noMorning ? t.wizard.three.avoiding : t.wizard.three.fine}
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-all ${value.noMorning ? 'bg-blue-600' : 'bg-slate-300/80'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${value.noMorning ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
