import type { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo/site';

const calendarDescription =
    'Your selected ITU courses laid out on a weekly grid, with clashes flagged. ' +
    'Export the timetable as PNG, JPG, SVG or PDF — a PNG carries the selection ' +
    'inside it, so importing the image restores the schedule.';

/**
 * The calendar page is a client component and so cannot export metadata
 * itself; this layout exists to give the route a title of its own.
 */
export const metadata: Metadata = pageMetadata({
    title: 'Weekly Calendar',
    socialTitle: 'ITU Weekly Calendar',
    description: calendarDescription,
    path: '/calendar/',
});

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return children;
}
