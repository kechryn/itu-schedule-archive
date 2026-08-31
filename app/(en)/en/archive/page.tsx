import type { Metadata } from 'next';

import ArchivePage from '@/components/pages/ArchivePage';
import { getArchiveStats, getStaticTerms } from '@/lib/data/build';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localizedTermLabel, pageMetadata } from '@/lib/seo/site';

const t = getDictionary('en');

// Counted at build time so the description states the archive's actual size
// rather than a number that quietly goes stale between scrapes.
const stats = getArchiveStats();
const terms = getStaticTerms();
const oldest = terms[terms.length - 1];
const newest = terms[0];

const description = t.meta.archiveDescription(
    stats.courseCount.toLocaleString('en-US'),
    stats.termCount,
    localizedTermLabel('en', oldest.year, oldest.season),
    localizedTermLabel('en', newest.year, newest.season)
);

export const metadata: Metadata = pageMetadata({
    locale: 'en',
    title: t.meta.archive.title,
    socialTitle: t.meta.archive.social,
    description,
    path: '/archive/',
});

export default function Page() {
    return <ArchivePage locale="en" />;
}
