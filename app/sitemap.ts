import type { MetadataRoute } from 'next';

import { getStaticTerms, getIndexGeneratedAt } from '@/lib/data/build';
import { absoluteUrl } from '@/lib/seo/site';

/**
 * Emitted as a static sitemap.xml at build time.
 *
 * Term pages carry the scraper's timestamp as lastModified rather than the
 * build time, so a rebuild that changed no data does not tell crawlers that
 * all 27 terms are new.
 */
// `output: export` has no request to serve this per-hit, so it has to be
// generated once at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const terms = getStaticTerms();
    const dataUpdatedAt = new Date(getIndexGeneratedAt());

    const pages: MetadataRoute.Sitemap = [
        { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
        { url: absoluteUrl('/archive/'), changeFrequency: 'weekly', priority: 0.9, lastModified: dataUpdatedAt },
        { url: absoluteUrl('/wizard/'), changeFrequency: 'monthly', priority: 0.8 },
        { url: absoluteUrl('/calendar/'), changeFrequency: 'monthly', priority: 0.8 },
        { url: absoluteUrl('/about/'), changeFrequency: 'yearly', priority: 0.4 },
    ];

    // The current term is the one the scraper still refreshes; past terms are
    // final, and saying so keeps crawlers from re-fetching a decade of pages.
    const termPages: MetadataRoute.Sitemap = terms.map((term, i) => ({
        url: absoluteUrl(`/archive/${term.id}/`),
        lastModified: dataUpdatedAt,
        changeFrequency: i === 0 ? 'daily' : 'yearly',
        priority: i === 0 ? 0.9 : 0.6,
    }));

    return [...pages, ...termPages];
}
