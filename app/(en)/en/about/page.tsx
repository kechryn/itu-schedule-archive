import type { Metadata } from 'next';

import AboutPage from '@/components/pages/AboutPage';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/seo/site';

const t = getDictionary('en');

export const metadata: Metadata = pageMetadata({
    locale: 'en',
    title: t.meta.about.title,
    socialTitle: t.meta.about.social,
    description: t.meta.about.description,
    path: '/about/',
});

export default function Page() {
    return <AboutPage locale="en" />;
}
