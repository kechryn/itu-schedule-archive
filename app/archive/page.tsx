import CourseHierarchy from '@/components/course/CourseHierarchy';
import ArchiveHelp from '@/components/archive/ArchiveHelp';
import { getStaticTerms } from '@/lib/data/build';

export const metadata = {
    title: 'Course Archive — ITU Scheduler',
    description: 'Browse ITU course schedules from every archived semester.',
};

export default function ArchivePage() {
    // Read at build time from public/data/index.json; already sorted newest first.
    const terms = getStaticTerms();

    return (
        <div className="min-h-screen bg-[#F5F5F7] animate-in fade-in duration-500">
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
