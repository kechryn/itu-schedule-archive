'use client';

import Link from 'next/link';
import { Database, Calendar, ArrowRight, GitFork } from 'lucide-react';

import ScrollReveal from '@/components/ui/ScrollReveal';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { localePath } from '@/lib/i18n/config';

/** One card either draws a lucide icon or an emoji, never both. */
interface FeatureCard {
  href: string;
  iconClass: string;
  title: string;
  description: string;
  link: string;
  icon?: React.ComponentType<{ className?: string }>;
  emoji?: string;
}

export default function HomePage() {
  const { locale, t } = useI18n();

  const features: FeatureCard[] = [
    {
      href: localePath(locale, '/archive'),
      icon: Database,
      iconClass: 'bg-blue-50 text-blue-600',
      ...t.home.features.archive,
    },
    {
      href: localePath(locale, '/wizard'),
      emoji: '🧙',
      iconClass: 'bg-sky-50',
      ...t.home.features.wizard,
    },
    {
      href: localePath(locale, '/calendar'),
      icon: Calendar,
      iconClass: 'bg-indigo-50 text-indigo-600',
      ...t.home.features.calendar,
    },
    {
      href: localePath(locale, '/about'),
      icon: GitFork,
      iconClass: 'bg-slate-100 text-slate-600',
      ...t.home.features.source,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center">

        {/* Hero Section */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.15]">
            {t.home.titleLead} <span className="text-blue-600">{t.home.titleAccent}</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-light mb-10 max-w-xl mx-auto">
            {t.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={localePath(locale, '/archive')} className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-base font-bold transition-colors hover:bg-slate-50 border border-slate-200 shadow-sm active:scale-95">
              {t.home.browseArchive}
            </Link>
            <Link href={localePath(locale, '/wizard')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-base font-bold transition-colors hover:bg-slate-800 shadow-sm active:scale-95">
              {t.home.startWizard}
            </Link>
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.href} delay={i * 100}>
              <Link
                href={feature.href}
                className="group block h-full rounded-[2rem] bg-white p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feature.iconClass}`}>
                  {feature.emoji ? (
                    <span className="text-2xl leading-none">{feature.emoji}</span>
                  ) : (
                    feature.icon && <feature.icon className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 font-light mb-6">{feature.description}</p>
                <span className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  {feature.link} <ArrowRight className="w-4 h-4 ml-1.5" />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <footer className="text-center py-12 text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {t.home.footer}</p>
      </footer>
    </main>
  );
}
