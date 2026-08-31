import type { Metadata } from 'next';

import CourseHierarchy from '@/components/course/CourseHierarchy';
import ArchiveHelp from '@/components/archive/ArchiveHelp';
import JsonLd from '@/components/seo/JsonLd';
import { getArchiveStats, getStaticTerms } from '@/lib/data/build';
import { archiveJsonLd } from '@/lib/seo/jsonLd';
import { pageMetadata, termLabel } from '@/lib/seo/site';

// Counted at build time so the description states the archive's actual size
// rather than a number that quietly goes stale between scrapes.
const stats = getArchiveStats();
const allTerms = getStaticTerms();
const oldest = allTerms[allTerms.length - 1];
const newest = allTerms[0];

const description =
    `Browse ${stats.courseCount.toLocaleString('en-US')} Istanbul Technical University ` +
    `course sections across ${stats.termCount} terms, from ` +
    `${termLabel(oldest.year, oldest.season)} to ${termLabel(newest.year, newest.season)}. ` +
    `Filter by term, level and subject code, or search by course code, title or instructor.`;

export const metadata: Metadata = pageMetadata({
    title: 'Course Archive',
    socialTitle: 'ITU Course Archive',
    description,
    path: '/archive/',
});

export default function ArchivePage() {
    // Read at build time from public/data/index.json; already sorted newest first.
    const terms = getStaticTerms();

    return (
        <div className="min-h-screen bg-[#F5F5F7] animate-in fade-in duration-500">
            <JsonLd data={archiveJsonLd(terms, stats.courseCount)} />
            {/* Header / Nav Area */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                                Course <span className="text-blue-600">Archive.</span>
                            </h1>
                            <ArchiveHelp />
                        </div>
                        <p className="mt-4 text-lg text-slate-500 max-w-2xl font-light leading-relaxed">
                            Browse through thousands of courses from past semesters. Data is sourced directly from ITU&apos;s public records.
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
