import type { Metadata } from 'next';

import TermPage from '@/components/pages/TermPage';
import { getStaticTerms } from '@/lib/data/build';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localizedTermLabel, pageMetadata } from '@/lib/seo/site';

interface Props {
    params: Promise<{ termId: string }>;
}

/** Prerender one page per archived term; required by `output: 'export'`. */
export function generateStaticParams() {
    return getStaticTerms().map((term) => ({ termId: term.id }));
}

/**
 * These 27 pages per language are the ones anyone searching for a term
 * actually wants, so each states its own term rather than inheriting the site
 * title. The description carries both the label and the Turkish name OBS
 * publishes — students search for either.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { termId } = await params;
    const term = getStaticTerms().find((x) => x.id === termId);
    if (!term) return {};

    const t = getDictionary('en');
    const label = localizedTermLabel('en', term.year, term.season);

    return pageMetadata({
        locale: 'en',
        title: t.meta.termTitle(label),
        socialTitle: t.meta.termSocial(label),
        description: t.meta.termDescription(
            label,
            term.name,
            term.courseCount.toLocaleString('en-US')
        ),
        path: `/archive/${term.id}/`,
        type: 'article',
    });
}

export default async function Page({ params }: Props) {
    const { termId } = await params;
    return <TermPage locale="en" termId={termId} />;
}
