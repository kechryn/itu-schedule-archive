import { notFound } from 'next/navigation';

import CourseBrowser from '@/components/course/CourseBrowser';
import TermCatalog from '@/components/course/TermCatalog';
import JsonLd from '@/components/seo/JsonLd';
import { getStaticTerms, getTermCatalog } from '@/lib/data/build';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { termJsonLd } from '@/lib/seo/jsonLd';
import { localizedTermLabel } from '@/lib/seo/site';

export default function TermPage({ locale, termId }: { locale: Locale; termId: string }) {
    const t = getDictionary(locale);
    const terms = getStaticTerms();
    const term = terms.find((x) => x.id === termId);

    if (!term) {
        notFound();
    }

    const label = localizedTermLabel(locale, term.year, term.season);

    return (
        <>
            <JsonLd data={termJsonLd(locale, term)} />
            <CourseBrowser
                termId={term.id}
                heading={t.archive.termHeading(label)}
                officialName={term.name}
                terms={terms}
            />
            <div className="bg-white text-slate-800 px-4 sm:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    <TermCatalog
                        catalog={getTermCatalog(term.id)}
                        heading={t.catalog.heading(label)}
                        intro={t.catalog.intro}
                    />
                </div>
            </div>
        </>
    );
}
