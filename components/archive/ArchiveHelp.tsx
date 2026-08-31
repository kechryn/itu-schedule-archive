'use client';

import { useState } from 'react';
import { HelpCircle, Plus } from 'lucide-react';

import InfoModal from '@/components/ui/InfoModal';
import { useI18n } from '@/components/i18n/LocaleProvider';

export default function ArchiveHelp() {
    const [showHelp, setShowHelp] = useState(false);
    const { t } = useI18n();
    const h = t.help.archive;

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

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                            <div>
                                <h4 className="font-bold text-slate-900">{h.s1}</h4>
                                <p className="text-slate-500 text-sm mt-1">{h.s1body}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                            <div>
                                <h4 className="font-bold text-slate-900">{h.s2}</h4>
                                <p className="text-slate-500 text-sm mt-1">
                                    {h.s2before}
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-xs font-bold mx-1">
                                        <Plus className="w-3 h-3 mr-1" /> {h.s2add}
                                    </span>
                                    {h.s2after}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">3</div>
                            <div>
                                <h4 className="font-bold text-slate-900">{h.s3}</h4>
                                <p className="text-slate-500 text-sm mt-1">
                                    {h.s3before}
                                    <span className="font-bold text-slate-800">{h.s3page}</span>
                                    {h.s3after}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                        <strong>{h.tipLabel}</strong> {h.tip}
                    </div>
                </div>
            </InfoModal>
        </>
    );
}
