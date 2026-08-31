/**
 * Structured data.
 *
 * Two audiences read this: search engines building rich results, and the
 * crawlers behind AI assistants, which lean on JSON-LD because the pages
 * themselves render their course tables client-side after a fetch. Describing
 * the data here is what lets either one state what a term contains without
 * executing the app.
 *
 * A term of course schedules is literally a dataset, so Dataset/DataCatalog is
 * the honest vocabulary rather than a stretch for rich-result eligibility.
 *
 * Everything is emitted per language: `inLanguage` and the prose match the page
 * it sits on, and the `@id`s are locale-scoped so the Turkish and English pages
 * describe two documents rather than colliding on one.
 */
import type { TermSummary } from '@/lib/data/courseData';
import type { Locale } from '@/lib/i18n/config';
import { HTML_LANG } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { OBS_URL, REPO_URL, SITE_NAMES, absoluteUrl, localizedTermLabel } from './site';

const ITU = {
    '@type': 'CollegeOrUniversity',
    name: 'İstanbul Teknik Üniversitesi',
    alternateName: ['Istanbul Technical University', 'İTÜ', 'ITU'],
    url: 'https://www.itu.edu.tr/',
} as const;

const PUBLISHER = {
    '@type': 'Person',
    name: 'Kerem Çirtma',
    url: 'https://github.com/kechryn',
} as const;

const COPY = {
    tr: {
        appDescription:
            'Arşivlenmiş İTÜ ders programlarına göz atın ve seçtiğiniz derslerden ' +
            'çakışmasız ders programı oluşturun.',
        features: [
            'Dönem, seviye ve branş koduna göre ders programı arama',
            'Ders kodu, ders adı veya öğretim üyesine göre arama',
            'Çakışmasız ders programı oluşturma',
            'Boş gün ve başlangıç saati kısıtı verme',
            'Programı PNG, JPG, SVG veya PDF olarak indirme',
        ],
        catalogName: 'İTÜ ders programı arşivi',
        catalogDescription: (terms: number, courses: string, from: string, to: string) =>
            `${from} - ${to} arası ${terms} İstanbul Teknik Üniversitesi dönemine ait ` +
            `ders programları; toplam ${courses} şube.`,
        datasetName: (label: string) => `İTÜ ders programı — ${label}`,
        datasetDescription: (label: string, count: string, levels: number, levelList: string) =>
            `İstanbul Teknik Üniversitesi'nin ${label} dönemi için yayımladığı bütün şubeler: ` +
            `${levels} seviyede (${levelList}) toplam ${count} şube; her biri CRN, ders kodu, ` +
            'ders adı, öğretim üyesi, gün ve saat, bina, derslik, kontenjan ve kayıtlı sayısıyla.',
        keywords: ['İTÜ ders programı', 'ders programı arşivi', 'CRN', 'İTÜ ders saatleri'],
        breadcrumbHome: 'Ana Sayfa',
        breadcrumbArchive: 'Arşiv',
    },
    en: {
        appDescription:
            'Browse archived ITU course schedules and generate conflict-free timetables ' +
            'from the courses you select.',
        features: [
            'Browse course schedules by term, level and subject code',
            'Search courses by code, title or instructor',
            'Generate conflict-free timetables',
            'Constrain schedules by free days and start time',
            'Export a timetable to PNG, JPG, SVG or PDF',
        ],
        catalogName: 'ITU course schedule archive',
        catalogDescription: (terms: number, courses: string, from: string, to: string) =>
            `Course schedules for ${terms} Istanbul Technical University terms, ` +
            `${courses} sections in total, from ${from} to ${to}.`,
        datasetName: (label: string) => `ITU course schedule — ${label}`,
        datasetDescription: (label: string, count: string, levels: number, levelList: string) =>
            `Every course section Istanbul Technical University published for the ${label} ` +
            `term: ${count} sections across ${levels} levels (${levelList}), each with its ` +
            'CRN, course code, title, instructor, meeting days and times, building, room, ' +
            'capacity and enrolment.',
        keywords: ['ITU', 'course schedule', 'ders programı', 'CRN'],
        breadcrumbHome: 'Home',
        breadcrumbArchive: 'Archive',
    },
} as const;

/** Site-wide graph, emitted from the root layout on every page. */
export function siteJsonLd(locale: Locale) {
    const t = getDictionary(locale);
    const copy = COPY[locale];
    const home = absoluteUrl('/', locale);

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${home}#website`,
                name: SITE_NAMES[locale],
                alternateName: locale === 'tr' ? 'ITU Schedule Archive' : 'İTÜ Ders Programı Arşivi',
                url: home,
                description: t.meta.home.description,
                inLanguage: HTML_LANG[locale],
                about: ITU,
                publisher: PUBLISHER,
            },
            {
                '@type': 'WebApplication',
                '@id': `${home}#app`,
                name: SITE_NAMES[locale],
                url: home,
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Any browser',
                browserRequirements: 'Requires JavaScript',
                description: copy.appDescription,
                inLanguage: HTML_LANG[locale],
                isAccessibleForFree: true,
                // Stated so the "is this free?" question is answered in data
                // rather than left to a crawler guessing from the page.
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
                featureList: copy.features,
                codeRepository: REPO_URL,
                author: PUBLISHER,
            },
        ],
    };
}

/** The archive index: a catalog whose members are the individual terms. */
export function archiveJsonLd(locale: Locale, terms: TermSummary[], courseCount: number) {
    const copy = COPY[locale];
    const url = absoluteUrl('/archive/', locale);
    const oldest = terms[terms.length - 1];
    const newest = terms[0];

    return {
        '@context': 'https://schema.org',
        '@type': 'DataCatalog',
        '@id': `${url}#catalog`,
        name: copy.catalogName,
        url,
        description: copy.catalogDescription(
            terms.length,
            courseCount.toLocaleString('en-US'),
            localizedTermLabel(locale, oldest.year, oldest.season),
            localizedTermLabel(locale, newest.year, newest.season)
        ),
        inLanguage: HTML_LANG[locale],
        about: ITU,
        publisher: PUBLISHER,
        isAccessibleForFree: true,
        dataset: terms.map((term) => ({
            '@type': 'Dataset',
            '@id': `${absoluteUrl(`/archive/${term.id}/`, locale)}#dataset`,
            name: copy.datasetName(localizedTermLabel(locale, term.year, term.season)),
            url: absoluteUrl(`/archive/${term.id}/`, locale),
        })),
    };
}

/** One term page. */
export function termJsonLd(locale: Locale, term: TermSummary) {
    const copy = COPY[locale];
    const label = localizedTermLabel(locale, term.year, term.season);
    const url = absoluteUrl(`/archive/${term.id}/`, locale);
    const levelList = term.levels.join(', ').replace(/_/g, ' ');

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Dataset',
                '@id': `${url}#dataset`,
                name: copy.datasetName(label),
                alternateName: term.name,
                url,
                description: copy.datasetDescription(
                    label,
                    term.courseCount.toLocaleString('en-US'),
                    term.levels.length,
                    levelList
                ),
                inLanguage: HTML_LANG[locale],
                about: ITU,
                creator: ITU,
                publisher: PUBLISHER,
                isAccessibleForFree: true,
                keywords: [...copy.keywords, label, ...term.levels.map((l) => l.replace(/_/g, ' '))],
                variableMeasured: [
                    'CRN',
                    'Course code',
                    'Course title',
                    'Instructor',
                    'Days',
                    'Times',
                    'Building',
                    'Room',
                    'Capacity',
                    'Enrolled',
                ],
                isBasedOn: OBS_URL,
                // The JSON the page itself fetches, named so a crawler can take
                // the data directly instead of scraping the rendered table.
                distribution: [
                    {
                        '@type': 'DataDownload',
                        encodingFormat: 'application/json',
                        contentUrl: `${absoluteUrl('/', 'tr')}data/terms/${term.id}.json`,
                    },
                ],
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumbs`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: copy.breadcrumbHome,
                        item: absoluteUrl('/', locale),
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: copy.breadcrumbArchive,
                        item: absoluteUrl('/archive/', locale),
                    },
                    { '@type': 'ListItem', position: 3, name: label, item: url },
                ],
            },
        ],
    };
}
