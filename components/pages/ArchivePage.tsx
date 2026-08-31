import CourseHierarchy from '@/components/course/CourseHierarchy';
import ArchiveHelp from '@/components/archive/ArchiveHelp';
import JsonLd from '@/components/seo/JsonLd';
import { getArchiveStats, getStaticTerms } from '@/lib/data/build';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { archiveJsonLd } from '@/lib/seo/jsonLd';

export default function ArchivePage({ locale }: { locale: Locale }) {
    const t = getDictionary(locale);

    // Read at build time from public/data/index.json; already sorted newest first.
    const terms = getStaticTerms();
    const stats = getArchiveStats();

    return (
        <div className="min-h-screen bg-[#F5F5F7] animate-in fade-in duration-500">
            <JsonLd data={archiveJsonLd(locale, terms, stats.courseCount)} />
            {/* Header / Nav Area */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                                {t.archive.titleLead} <span className="text-blue-600">{t.archive.titleAccent}</span>
                            </h1>
                            <ArchiveHelp />
                        </div>
                        <p className="mt-4 text-lg text-slate-500 max-w-2xl font-light leading-relaxed">
                            {t.archive.intro}
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <CourseHierarchy termId={terms[0]?.id ?? ''} terms={terms} />
            </main>
        </div>
    );
}
