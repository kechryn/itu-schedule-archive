'use client';

import Link from 'next/link';
import { Database, Calendar, ArrowRight, GitFork } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const FEATURES = [
  {
    href: '/archive',
    icon: Database,
    iconClass: 'bg-blue-50 text-blue-600',
    title: 'Course Archive',
    description: 'Browse detailed course data from past semesters.',
    linkLabel: 'Explore Archive',
  },
  {
    href: '/wizard',
    emoji: '🧙',
    iconClass: 'bg-sky-50',
    title: 'Schedule Wizard',
    description: 'Generate conflict-free schedules from your course list in seconds.',
    linkLabel: 'Launch Wizard',
  },
  {
    href: '/calendar',
    icon: Calendar,
    iconClass: 'bg-indigo-50 text-indigo-600',
    title: 'Weekly Calendar',
    description: 'Visualize your week and export your schedule to PDF or image.',
    linkLabel: 'Open Calendar',
  },
  {
    href: '/about',
    icon: GitFork,
    iconClass: 'bg-slate-100 text-slate-600',
    title: 'Open Source',
    description: 'Fork the project on GitHub and adapt it for your own campus.',
    linkLabel: 'Learn More',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center">

        {/* Hero Section */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.15]">
            ITU Course <span className="text-blue-600">Archive & Planner.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-light mb-10 max-w-xl mx-auto">
            A fast, open-source planner for Istanbul Technical University students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/archive" className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-base font-bold transition-colors hover:bg-slate-50 border border-slate-200 shadow-sm active:scale-95">
              Browse Archive
            </Link>
            <Link href="/wizard" className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-base font-bold transition-colors hover:bg-slate-800 shadow-sm active:scale-95">
              Start Wizard
            </Link>
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {FEATURES.map((feature, i) => (
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
                  {feature.linkLabel} <ArrowRight className="w-4 h-4 ml-1.5" />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <footer className="text-center py-12 text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} ITU Scheduler. Not affiliated with Istanbul Technical University.</p>
      </footer>
    </main>
  );
}
