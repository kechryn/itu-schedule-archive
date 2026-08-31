import type { Metadata } from 'next';

import CalendarPage from '@/components/pages/CalendarPage';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/seo/site';

const t = getDictionary('en');

export const metadata: Metadata = pageMetadata({
    locale: 'en',
    title: t.meta.calendar.title,
    socialTitle: t.meta.calendar.social,
    description: t.meta.calendar.description,
    path: '/calendar/',
});

export default function Page() {
    return <CalendarPage />;
}
