import { Database, Calendar, GitFork, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getArchiveStats } from '@/lib/data/build';

export const metadata = {
    title: 'About — ITU Scheduler',
    description: 'An open-source course archive and schedule planner for ITU students.',
};

export default function AboutPage() {
    // Totals come from the generated data index at build time.
    const stats = getArchiveStats();

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">

                {/* Header */}
                <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                        About <span className="text-blue-600">ITU Scheduler.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-light">
                        An open-source tool that helps Istanbul Technical University students plan their semesters with ease.
                    </p>
                </ScrollReveal>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <ScrollReveal delay={100} className="h-full p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 text-blue-600">
                            <Database className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Course Archive</h3>
                        <p className="text-slate-500 font-light leading-relaxed">
                            A searchable database of past schedules to analyze trends and verify course details.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={200} className="h-full p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mb-5">
                            <span className="text-2xl leading-none">🧙</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Schedule Wizard</h3>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Generates conflict-free schedule combinations from your course list in seconds.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={300} className="h-full p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 text-indigo-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Interactive Calendar</h3>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Visualize your week with a drag-and-drop ready interface. Export to PDF or image.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Statistics */}
                <ScrollReveal delay={400} className="mb-16">
                    <div className="bg-slate-900 rounded-[2rem] p-10 sm:p-12 text-white">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
                            <div>
                                <div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-1 tracking-tight">
                                    {stats.termCount}
                                </div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Terms Archived</div>
                            </div>
                            <div>
                                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-1 tracking-tight">
                                    {(stats.courseCount / 1000).toFixed(1)}k+
                                </div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Total Courses</div>
                            </div>
                            <div>
                                <div className="text-4xl sm:text-5xl font-bold text-amber-400 mb-1 tracking-tight">
                                    100%
                                </div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Open Source</div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* For Developers */}
                <ScrollReveal delay={500}>
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 text-slate-700">
                            <GitFork className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">For Developers</h3>
                        <p className="text-slate-500 leading-relaxed mb-6 font-light max-w-2xl">
                            The codebase is fully open-source. Fork the repository and adapt it for your own university&apos;s schedule system.
                        </p>
                        <a href="https://github.com/kechryn/itu-schedule-archive" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                            View on GitHub <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
