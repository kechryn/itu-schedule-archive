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
 */
import type { TermSummary } from '@/lib/data/courseData';
import {
    OBS_URL,
    REPO_URL,
    SITE_DESCRIPTION,
    SITE_NAME,
    absoluteUrl,
    termLabel,
} from './site';

const ITU = {
    '@type': 'CollegeOrUniversity',
    name: 'Istanbul Technical University',
    alternateName: ['İstanbul Teknik Üniversitesi', 'ITU', 'İTÜ'],
    url: 'https://www.itu.edu.tr/',
} as const;

const PUBLISHER = {
    '@type': 'Person',
    name: 'Kerem Çirtma',
    url: 'https://github.com/kechryn',
} as const;

/** Site-wide graph, emitted from the root layout on every page. */
export function siteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': absoluteUrl('/') + '#website',
                name: SITE_NAME,
                alternateName: 'İTÜ Ders Programı Arşivi',
                url: absoluteUrl('/'),
                description: SITE_DESCRIPTION,
                inLanguage: 'en',
                about: ITU,
                publisher: PUBLISHER,
            },
            {
                '@type': 'WebApplication',
                '@id': absoluteUrl('/') + '#app',
                name: SITE_NAME,
                url: absoluteUrl('/'),
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Any browser',
                browserRequirements: 'Requires JavaScript',
                description:
                    'Browse archived ITU course schedules and generate conflict-free ' +
                    'timetables from the courses you select.',
                isAccessibleForFree: true,
                // Stated so the "is this free?" question is answered in data
                // rather than left to a crawler guessing from the page.
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                featureList: [
                    'Browse course schedules by term, level and subject code',
                    'Search courses by code, title or instructor',
                    'Generate conflict-free timetables',
                    'Constrain schedules by free days and start time',
                    'Export a timetable to PNG, JPG, SVG or PDF',
                ],
                codeRepository: REPO_URL,
                author: PUBLISHER,
            },
        ],
    };
}

/** The archive index: a catalog whose members are the individual terms. */
export function archiveJsonLd(terms: TermSummary[], courseCount: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'DataCatalog',
        '@id': absoluteUrl('/archive/') + '#catalog',
        name: 'ITU course schedule archive',
        url: absoluteUrl('/archive/'),
        description:
            `Course schedules for ${terms.length} Istanbul Technical University terms, ` +
            `${courseCount.toLocaleString('en-US')} sections in total, from ` +
            `${termLabel(terms[terms.length - 1].year, terms[terms.length - 1].season)} to ` +
            `${termLabel(terms[0].year, terms[0].season)}.`,
        inLanguage: 'en',
        about: ITU,
        publisher: PUBLISHER,
        isAccessibleForFree: true,
        dataset: terms.map((term) => ({
            '@type': 'Dataset',
            '@id': absoluteUrl(`/archive/${term.id}/`) + '#dataset',
            name: `ITU course schedule — ${termLabel(term.year, term.season)}`,
            url: absoluteUrl(`/archive/${term.id}/`),
        })),
    };
}

/** One term page. */
export function termJsonLd(term: TermSummary) {
    const label = termLabel(term.year, term.season);
    const url = absoluteUrl(`/archive/${term.id}/`);

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Dataset',
                '@id': `${url}#dataset`,
                name: `ITU course schedule — ${label}`,
                alternateName: term.name,
                url,
                description:
                    `Every course section Istanbul Technical University published for the ` +
                    `${label} term: ${term.courseCount.toLocaleString('en-US')} sections across ` +
                    `${term.levels.length} levels (${term.levels.join(', ').replace(/_/g, ' ')}), ` +
                    `each with its CRN, course code, title, instructor, meeting days and times, ` +
                    `building, room, capacity and enrolment.`,
                inLanguage: 'en',
                about: ITU,
                creator: ITU,
                publisher: PUBLISHER,
                isAccessibleForFree: true,
                keywords: [
                    'ITU',
                    'course schedule',
                    'ders programı',
                    label,
                    ...term.levels.map((l) => l.replace(/_/g, ' ')),
                ],
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
                        contentUrl: absoluteUrl(`/data/terms/${term.id}.json`).replace(/\/$/, ''),
                    },
                ],
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumbs`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
                    { '@type': 'ListItem', position: 2, name: 'Archive', item: absoluteUrl('/archive/') },
                    { '@type': 'ListItem', position: 3, name: label, item: url },
                ],
            },
        ],
    };
}
