'use client';

/**
 * Lightweight side of the schedule file format: types, filename helpers and
 * reading a saved schedule back in.
 *
 * Kept separate from exportUtils on purpose — importing is offered up front
 * (wizard step 1), while rendering a PDF pulls in jsPDF, ~400 KB that most
 * visitors never need. Only exportUtils imports it, and it is loaded on demand.
 */

import type { Course } from '../data/courseData';

export const FORMAT_VERSION = '1.0';

/** Marker prefixing the base64 payload embedded in exported PNG/SVG files. */
export const METADATA_MARKER = 'ITU_SCHED_DATA:';

export interface ITUSchedData {
    version: string;
    exportedAt: string;
    type: 'calendar' | 'wizard';
    termId?: string;
    courses: Course[];
    wizardState?: {
        termId: string;
        mustCourses: string[];
        selectiveGroups: {
            id: string;
            name: string;
            required: number;
            courses: string[];
        }[];
        constraints: {
            freeDays: string[];
            noMorning: boolean;
        };
    };
}

/** UTF-8 safe base64 encoding (handles Turkish and other Unicode characters). */
export function utf8ToBase64(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
    ));
}

/** UTF-8 safe base64 decoding. */
function base64ToUtf8(str: string): string {
    return decodeURIComponent(
        atob(str).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
    );
}

/** Generate a filename from courses. */
export function generateFilename(courses: Course[], prefix: string = 'schedule'): string {
    const date = new Date().toISOString().split('T')[0];
    return `${prefix}_${courses.length}courses_${date}`;
}

/**
 * Import selections from a file (either .itusched or an image with embedded
 * metadata).
 */
export async function importSelections(file: File): Promise<ITUSchedData | null> {
    const fileName = file.name.toLowerCase();

    // Handle .itusched files (JSON)
    if (fileName.endsWith('.itusched') || fileName.endsWith('.json')) {
        try {
            const text = await file.text();
            const data = JSON.parse(text) as ITUSchedData;

            // Validate format
            if (!data.version || !data.courses) {
                throw new Error('Invalid file format');
            }

            return data;
        } catch (e) {
            console.error('Failed to parse .itusched file', e);
            return null;
        }
    }

    // Handle PNG files with embedded metadata
    if (fileName.endsWith('.png')) {
        try {
            return await extractMetadataFromPNG(file);
        } catch (e) {
            console.error('Failed to extract metadata from PNG', e);
            return null;
        }
    }

    // Handle SVG files
    if (fileName.endsWith('.svg')) {
        try {
            const text = await file.text();
            const match = text.match(new RegExp(`${METADATA_MARKER}([A-Za-z0-9+/=]+)`));
            if (match) {
                return JSON.parse(base64ToUtf8(match[1])) as ITUSchedData;
            }
        } catch (e) {
            console.error('Failed to extract metadata from SVG', e);
        }
        return null;
    }

    // Handle PDF files - extract from keywords
    if (fileName.endsWith('.pdf')) {
        // PDF metadata extraction is complex client-side
        // For now, we'll return null and recommend using .itusched files
        console.warn('PDF import not fully supported. Use .itusched files for best results.');
        return null;
    }

    return null;
}

/** Extract metadata from a PNG exported by this app. */
async function extractMetadataFromPNG(file: File): Promise<ITUSchedData | null> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder();

    // Search for tEXt chunks containing our marker
    let offset = 8; // Skip PNG signature

    while (offset < uint8Array.length - 12) {
        // Read chunk length (big endian)
        const length = (uint8Array[offset] << 24) |
            (uint8Array[offset + 1] << 16) |
            (uint8Array[offset + 2] << 8) |
            uint8Array[offset + 3];

        // Read chunk type
        const type = textDecoder.decode(uint8Array.slice(offset + 4, offset + 8));

        if (type === 'tEXt' || type === 'iTXt') {
            const data = textDecoder.decode(uint8Array.slice(offset + 8, offset + 8 + length));

            if (data.includes(METADATA_MARKER)) {
                const markerIndex = data.indexOf(METADATA_MARKER);
                const base64Data = data.slice(markerIndex + METADATA_MARKER.length);
                try {
                    return JSON.parse(base64ToUtf8(base64Data)) as ITUSchedData;
                } catch (e) {
                    console.error('Failed to parse embedded metadata', e);
                }
            }
        }

        if (type === 'IEND') break;

        // Move to next chunk: length (4) + type (4) + data (length) + crc (4)
        offset += 4 + 4 + length + 4;
    }

    return null;
}
