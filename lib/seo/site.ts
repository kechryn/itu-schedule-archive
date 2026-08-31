/**
 * Canonical identity of the deployed site.
 *
 * Everything that has to name the site from the outside — canonical URLs, the
 * sitemap, Open Graph tags, JSON-LD — resolves through here, so a move to a
 * custom domain is one environment variable rather than a search-and-replace.
 *
 * This is deliberately not derived from NEXT_PUBLIC_BASE_PATH. That variable
 * describes where the build is mounted, which is empty during local
 * development; a canonical URL has to name production either way.
 */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kechryn.github.io/itu-schedule-archive'
).replace(/\/$/, '');

export const SITE_NAME = 'ITU Schedule Archive';

export const SITE_DESCRIPTION =
    'Searchable archive of Istanbul Technical University course schedules, ' +
    'covering every term ITU OBS has published since 2016, with a planner ' +
    'that builds conflict-free timetables from the courses you pick.';

export const REPO_URL = 'https://github.com/kechryn/itu-schedule-archive';

export const OBS_URL = 'https://obs.itu.edu.tr/public/DersProgram';

/**
 * Absolute URL for a route. Paths carry a trailing slash to match
 * `trailingSlash: true`, so the canonical tag and the URL the crawler
 * actually fetched are byte-identical.
 */
export function absoluteUrl(path = '/'): string {
    const suffix = path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`;
    return `${SITE_URL}${suffix === '/' ? '/' : suffix}`;
}

/** Turkish term names read poorly in a title; render the English form. */
export function termLabel(year: string, season: string): string {
    return `${year} ${season}`;
}

/** The social card, generated at build time by app/og.png/route.tsx. */
export const OG_IMAGE = {
    url: '/og.png',
    width: 1200,
    height: 630,
    alt: 'ITU Schedule Archive — course schedules and timetable planner',
} as const;

interface PageMetaInput {
    /** Page title, without the site-name suffix the template appends. */
    title: string;
    description: string;
    /** Route path, e.g. "/archive/". */
    path: string;
    /** Social title, when the terse page title would read oddly out of context. */
    socialTitle?: string;
    type?: 'website' | 'article';
}

/**
 * Per-page metadata.
 *
 * Next replaces `openGraph` and `twitter` wholesale rather than merging them
 * into the parent's, so a page that sets its own title silently drops the
 * root's card type. Building both objects here keeps every page carrying a
 * full set.
 *
 * Both name the card explicitly. The opengraph-image file convention only
 * attaches its image to the segment that declares it, so the term pages — the
 * ones anyone actually shares — went out with no card at all.
 */
export function pageMetadata({
    title,
    description,
    path,
    socialTitle,
    type = 'website',
}: PageMetaInput) {
    const url = absoluteUrl(path);
    const social = socialTitle ?? title;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type,
            siteName: SITE_NAME,
            title: social,
            description,
            url,
            locale: 'en_US',
            images: [OG_IMAGE],
        },
        twitter: {
            card: 'summary_large_image' as const,
            title: social,
            description,
            images: [OG_IMAGE.url],
        },
    };
}
