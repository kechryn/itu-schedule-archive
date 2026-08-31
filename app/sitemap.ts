import type { MetadataRoute } from 'next';

import { getStaticTerms, getIndexGeneratedAt } from '@/lib/data/build';
import { LOCALES } from '@/lib/i18n/config';
import { absoluteUrl, hreflangAlternates } from '@/lib/seo/site';

// `output: export` has no request to serve this per-hit, so it has to be
// generated once at build time.
export const dynamic = 'force-static';

/**
 * Emitted as a static sitemap.xml at build time.
 *
 * Every route appears once per language, each entry carrying the hreflang
 * cluster for the whole set. Listing the alternates here as well as in the page
 * head is what tells a crawler the two versions are one page in two languages
 * rather than two pages competing for the same query.
 *
 * Term pages carry the scraper's timestamp as lastModified rather than the
 * build time, so a rebuild that changed no data does not tell crawlers that
 * every term is new.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const terms = getStaticTerms();
    const dataUpdatedAt = new Date(getIndexGeneratedAt());

    interface Entry {
        path: string;
        changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
        priority: number;
        lastModified?: Date;
    }

    const pages: Entry[] = [
        { path: '/', changeFrequency: 'weekly', priority: 1 },
        { path: '/archive/', changeFrequency: 'weekly', priority: 0.9, lastModified: dataUpdatedAt },
        { path: '/wizard/', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/calendar/', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/about/', changeFrequency: 'yearly', priority: 0.4 },
    ];

    // The current term is the one the scraper still refreshes; past terms are
    // final, and saying so keeps crawlers from re-fetching a decade of pages.
    const termPages: Entry[] = terms.map((term, i) => ({
        path: `/archive/${term.id}/`,
        lastModified: dataUpdatedAt,
        changeFrequency: i === 0 ? 'daily' : 'yearly',
        priority: i === 0 ? 0.9 : 0.6,
    }));

    return [...pages, ...termPages].flatMap((entry) =>
        LOCALES.map((locale) => ({
            url: absoluteUrl(entry.path, locale),
            lastModified: entry.lastModified,
            changeFrequency: entry.changeFrequency,
            // Turkish is the default and the audience's language, so the
            // English copy of each page ranks a step below its Turkish twin.
            priority: locale === 'tr' ? entry.priority : Math.max(0.1, entry.priority - 0.1),
            alternates: { languages: hreflangAlternates(entry.path) },
        }))
    );
}
