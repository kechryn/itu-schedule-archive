import type { CatalogSubject } from '@/lib/data/build';

/**
 * The term's courses, rendered on the server.
 *
 * The interactive table above this is client-side and starts empty, so without
 * this section the page carries no course text at all — nothing for a search
 * engine to match "İTÜ BLG 102E" against, and nothing for an assistant to read.
 * It doubles as a plain index for anyone who would rather scan than filter.
 *
 * Each item is one text node with no nested elements and no per-item classes.
 * That is not fussiness: a server component's output is also serialized into
 * the RSC payload inline in the same document, so every wrapper element here
 * is paid for twice. Styling the children from the list collapsed these pages
 * from 2 MB to a fraction of it.
 *
 * Course codes and titles are never translated — they are what OBS publishes
 * and what a student is searching for.
 */
export default function TermCatalog({
    catalog,
    heading,
    intro,
}: {
    catalog: CatalogSubject[];
    heading: string;
    intro: (courses: string, subjects: number) => string;
}) {
    if (catalog.length === 0) return null;

    const courseCount = catalog.reduce((sum, s) => sum + s.courses.length, 0);

    return (
        <section aria-labelledby="course-index" className="pt-10 mt-4 border-t border-slate-200">
            <h2 id="course-index" className="text-xl font-bold text-slate-900 font-display">
                {heading}
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
                {intro(courseCount.toLocaleString('en-US'), catalog.length)}
            </p>

            <div className="mt-8 space-y-8">
                {catalog.map((group) => (
                    <div key={group.subject}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            {group.subject}
                        </h3>
                        <ul className="mt-2 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-600 leading-snug [&>li]:marker:text-slate-300">
                            {group.courses.map((course) => (
                                <li key={course.code}>
                                    {`${course.code} — ${course.title} [${course.sections}]`}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
