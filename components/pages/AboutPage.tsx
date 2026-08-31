import { Database, Calendar, GitFork, ArrowRight } from 'lucide-react';

import ScrollReveal from '@/components/ui/ScrollReveal';
import { getArchiveStats } from '@/lib/data/build';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { REPO_URL } from '@/lib/seo/site';

/** One card either draws a lucide icon or an emoji, never both. */
interface AboutCard {
    title: string;
    body: string;
    wrap: string;
    delay: number;
    icon?: React.ComponentType<{ className?: string }>;
    emoji?: string;
}

export default function AboutPage({ locale }: { locale: Locale }) {
    const t = getDictionary(locale);

    // Totals come from the generated data index at build time.
    const stats = getArchiveStats();

    const cards: AboutCard[] = [
        { ...t.about.cards.archive, icon: Database, wrap: 'bg-blue-50 text-blue-600', delay: 100 },
        { ...t.about.cards.wizard, emoji: '🧙', wrap: 'bg-sky-50', delay: 200 },
        { ...t.about.cards.calendar, icon: Calendar, wrap: 'bg-indigo-50 text-indigo-600', delay: 300 },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">

                {/* Header */}
                <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                        {t.about.titleLead} <span className="text-blue-600">{t.about.titleAccent}</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-light">
                        {t.about.intro}
                    </p>
                </ScrollReveal>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {cards.map((card) => (
                        <ScrollReveal
                            key={card.title}
                            delay={card.delay}
                            className="h-full p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${card.wrap}`}>
                                {card.emoji ? (
                                    <span className="text-2xl leading-none">{card.emoji}</span>
                                ) : (
                                    card.icon && <card.icon className="w-6 h-6" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h2>
                            <p className="text-slate-500 font-light leading-relaxed">{card.body}</p>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Statistics */}
                <ScrollReveal delay={400} className="mb-16">
                    <div className="bg-slate-900 rounded-[2rem] p-10 sm:p-12 text-white">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
                            <div>
                                <div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-1 tracking-tight">
                                    {stats.termCount}
                                </div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t.about.stats.terms}</div>
                            </div>
                            <div>
                                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-1 tracking-tight">
                                    {(stats.courseCount / 1000).toFixed(1)}k+
                                </div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t.about.stats.courses}</div>
                            </div>
                            <div>
                                <div className="text-4xl sm:text-5xl font-bold text-amber-400 mb-1 tracking-tight">
                                    100%
                                </div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t.about.stats.open}</div>
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.about.devTitle}</h2>
                        <p className="text-slate-500 leading-relaxed mb-6 font-light max-w-2xl">
                            {t.about.devBody}
                        </p>
                        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                            {t.about.viewOnGitHub} <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
