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
import { DEFAULT_LOCALE, LOCALES, OG_LOCALE, localePath, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kechryn.github.io/itu-schedule-archive'
).replace(/\/$/, '');

/** Brand name per language; the Turkish one is what Turkish searches match. */
export const SITE_NAMES: Record<Locale, string> = {
    tr: 'İTÜ Ders Programı Arşivi',
    en: 'ITU Schedule Archive',
};

export const REPO_URL = 'https://github.com/kechryn/itu-schedule-archive';

export const OBS_URL = 'https://obs.itu.edu.tr/public/DersProgram';

/**
 * Absolute URL for a route in a given language. Paths carry a trailing slash
 * to match `trailingSlash: true`, so the canonical tag and the URL the crawler
 * actually fetched are byte-identical.
 */
export function absoluteUrl(path = '/', locale: Locale = DEFAULT_LOCALE): string {
    return `${SITE_URL}${localePath(locale, path)}`;
}

/**
 * hreflang for one page across both languages.
 *
 * x-default points at Turkish: it is what a searcher with no matching language
 * preference should land on, since the audience is ITU students.
 */
export function hreflangAlternates(path: string) {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[locale] = absoluteUrl(path, locale);
    languages['x-default'] = absoluteUrl(path, DEFAULT_LOCALE);
    return languages;
}

/**
 * "2026-2027 Güz" / "2026-2027 Fall".
 *
 * OBS stores the season in English, but the Turkish page has to say Güz — that
 * is the phrase students type. The year is a range and reads the same either
 * way.
 */
export function localizedTermLabel(locale: Locale, year: string, season: string): string {
    return `${year} ${getDictionary(locale).meta.seasons[season] ?? season}`;
}

/** Language-neutral label, for ids and data that should not shift by locale. */
export function termLabel(year: string, season: string): string {
    return `${year} ${season}`;
}

/** The social card, generated at build time by app/og.png/route.tsx. */
export const OG_IMAGE = {
    url: '/og.png',
    width: 1200,
    height: 630,
    alt: 'İTÜ ders programı arşivi — ITU Schedule Archive',
} as const;

interface PageMetaInput {
    locale: Locale;
    /** Page title, without the site-name suffix the template appends. */
    title: string;
    description: string;
    /** Route path, e.g. "/archive/". Language-neutral; the locale prefixes it. */
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
 * root's card type and image. Building both objects here keeps every page
 * carrying a full set.
 *
 * `alternates.languages` is the hreflang cluster. Without it the two language
 * versions compete as near-duplicates instead of being understood as the same
 * page in two languages.
 */
export function pageMetadata({
    locale,
    title,
    description,
    path,
    socialTitle,
    type = 'website',
}: PageMetaInput) {
    const url = absoluteUrl(path, locale);
    const social = socialTitle ?? title;

    return {
        title,
        description,
        alternates: {
            canonical: url,
            languages: hreflangAlternates(path),
        },
        openGraph: {
            type,
            siteName: SITE_NAMES[locale],
            title: social,
            description,
            url,
            locale: OG_LOCALE[locale],
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

/** Root metadata shared by both language trees. */
export function rootMetadata(locale: Locale) {
    const t = getDictionary(locale);

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: t.meta.home.title,
            template: `%s — ${SITE_NAMES[locale]}`,
        },
        description: t.meta.home.description,
        applicationName: SITE_NAMES[locale],
        category: 'education',
        alternates: {
            canonical: absoluteUrl('/', locale),
            languages: hreflangAlternates('/'),
        },
        keywords: t.meta.keywords,
        authors: [{ name: 'Kerem Çirtma', url: 'https://github.com/kechryn' }],
        creator: 'Kerem Çirtma',
        publisher: 'Kerem Çirtma',
        openGraph: {
            type: 'website' as const,
            siteName: SITE_NAMES[locale],
            title: t.meta.home.title,
            description: t.meta.home.description,
            url: absoluteUrl('/', locale),
            locale: OG_LOCALE[locale],
            images: [OG_IMAGE],
        },
        twitter: {
            card: 'summary_large_image' as const,
            title: SITE_NAMES[locale],
            description: t.meta.home.description,
            images: [OG_IMAGE.url],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large' as const,
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        },
        // A course archive is read, not called or mailed; stop mobile Safari
        // from linking CRNs and time ranges as phone numbers and dates.
        formatDetection: { telephone: false, date: false, address: false },
        referrer: 'strict-origin-when-cross-origin' as const,
    };
}
