import type { Metadata } from 'next';

import WizardPage from '@/components/pages/WizardPage';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/seo/site';

const t = getDictionary('en');

export const metadata: Metadata = pageMetadata({
    locale: 'en',
    title: t.meta.wizard.title,
    socialTitle: t.meta.wizard.social,
    description: t.meta.wizard.description,
    path: '/wizard/',
});

export default function Page() {
    return <WizardPage locale="en" />;
}
