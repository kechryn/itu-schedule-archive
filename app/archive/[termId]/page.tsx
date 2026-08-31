import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CourseBrowser from '@/components/course/CourseBrowser';
import TermCatalog from '@/components/course/TermCatalog';
import JsonLd from '@/components/seo/JsonLd';
import { getStaticTerms, getTermCatalog } from '@/lib/data/build';
import { termJsonLd } from '@/lib/seo/jsonLd';
import { pageMetadata, termLabel } from '@/lib/seo/site';

interface Props {
    params: Promise<{ termId: string }>;
}

/** Prerender one page per archived term; required by `output: 'export'`. */
export function generateStaticParams() {
    return getStaticTerms().map((term) => ({ termId: term.id }));
}

function findTerm(termId: string) {
    return getStaticTerms().find((t) => t.id === termId);
}

/**
 * These 27 pages are the ones anyone searching for a term actually wants, so
 * each states its own term rather than inheriting the site title. Both the
 * English label and the Turkish name OBS publishes go in the description —
 * students search for either.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { termId } = await params;
    const term = findTerm(termId);

    if (!term) return {};

    const label = termLabel(term.year, term.season);
    const title = `${label} Course Schedule`;
    const description =
        `All ${term.courseCount.toLocaleString('en-US')} course sections Istanbul Technical ` +
        `University published for ${label} (${term.name}). Search by course code, title or ` +
        `instructor and see CRN, meeting days and times, building, room, capacity and enrolment.`;

    return pageMetadata({
        title,
        socialTitle: `${label} — ITU Course Schedule`,
        description,
        path: `/archive/${term.id}/`,
        type: 'article',
    });
}

export default async function TermPage({ params }: Props) {
    const { termId } = await params;
    const terms = getStaticTerms();
    const term = terms.find((t) => t.id === termId);

    if (!term) {
        notFound();
    }

    return (
        <>
            <JsonLd data={termJsonLd(term)} />
            <CourseBrowser termId={term.id} termName={term.name} terms={terms} />
            <div className="bg-white text-slate-800 px-4 sm:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    <TermCatalog
                        catalog={getTermCatalog(term.id)}
                        termLabel={termLabel(term.year, term.season)}
                    />
                </div>
            </div>
        </>
    );
}
