'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

import InfoModal from '@/components/ui/InfoModal';
import { useI18n } from '@/components/i18n/LocaleProvider';

export default function CalendarHelp() {
    const [showHelp, setShowHelp] = useState(false);
    const { t } = useI18n();
    const h = t.help.calendar;

    const steps = [h.s1, h.s2, h.s3];
    const bodies = [h.s1body, h.s2body, h.s3body];

    return (
        <>
            <button
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <HelpCircle className="w-4 h-4" />
                {t.help.howItWorks}
            </button>

            <InfoModal isOpen={showHelp} onClose={() => setShowHelp(false)} title={h.title}>
                <div className="space-y-6">
                    <p className="text-slate-600">
                        {h.leadPrefix}
                        <strong>{h.leadStrong}</strong>
                        {h.lead}
                    </p>

                    <ol className="relative border-l border-slate-200 ml-3 space-y-6">
                        {steps.map((step, i) => (
                            <li key={step} className="ml-6">
                                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-4 ring-white">
                                    <span className="text-blue-600 font-bold text-xs">{i + 1}</span>
                                </span>
                                <h4 className="font-bold text-slate-900">{step}</h4>
                                <p className="text-sm text-slate-500 mt-1">{bodies[i]}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </InfoModal>
        </>
    );
}
