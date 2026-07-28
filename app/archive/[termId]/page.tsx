import { notFound } from 'next/navigation';

import CourseBrowser from '@/components/course/CourseBrowser';
import { getStaticTerms } from '@/lib/data/build';

interface Props {
    params: Promise<{ termId: string }>;
}

/** Prerender one page per archived term; required by `output: 'export'`. */
export function generateStaticParams() {
    return getStaticTerms().map((term) => ({ termId: term.id }));
}

export default async function TermPage({ params }: Props) {
    const { termId } = await params;
    const terms = getStaticTerms();
    const term = terms.find((t) => t.id === termId);

    if (!term) {
        notFound();
    }

    return <CourseBrowser termId={term.id} termName={term.name} terms={terms} />;
}
