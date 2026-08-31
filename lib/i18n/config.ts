/**
 * Locales.
 *
 * Turkish is the default and sits at the root, because the people who search
 * for "İTÜ ders programı" are the audience and the root carries the most
 * weight. English lives under /en.
 *
 * Paths stay in English in both trees — /archive/ is Turkish, /en/archive/ is
 * English. Translating the segments too would have meant every already-published
 * URL 404ing, and a keyword in the path is a far weaker signal than the same
 * keyword in the title, heading and body.
 */
export const LOCALES = ['tr', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'tr';

/** BCP 47 tags, for <html lang> and hreflang. */
export const HTML_LANG: Record<Locale, string> = { tr: 'tr', en: 'en' };

/** Open Graph locale tags. */
export const OG_LOCALE: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US' };

export const LOCALE_NAMES: Record<Locale, string> = { tr: 'Türkçe', en: 'English' };

/**
 * Route for a locale. The default locale is unprefixed, so `/archive/` is
 * Turkish and `/en/archive/` is English.
 */
export function localePath(locale: Locale, path = '/'): string {
    const clean = path.startsWith('/') ? path : `/${path}`;
    const withSlash = clean.endsWith('/') ? clean : `${clean}/`;
    if (locale === DEFAULT_LOCALE) return withSlash;
    return withSlash === '/' ? '/en/' : `/en${withSlash}`;
}

/** The same page in the other language, for the header's language switch. */
export function otherLocale(locale: Locale): Locale {
    return locale === 'tr' ? 'en' : 'tr';
}

/**
 * Strips the locale prefix off a pathname, giving the language-neutral route.
 * `/en/archive/` and `/archive/` both come back as `/archive/`.
 *
 * Used by the language switch, which has to find the same page in the other
 * tree rather than dumping the reader on the home page.
 */
export function neutralPath(pathname: string): string {
    if (pathname === '/en' || pathname === '/en/') return '/';
    if (pathname.startsWith('/en/')) return pathname.slice(3);
    return pathname || '/';
}

/** Which language a pathname belongs to. */
export function localeOf(pathname: string): Locale {
    return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : DEFAULT_LOCALE;
}
