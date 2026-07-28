/**
 * Node-side writer for the static data directory that the site reads at
 * runtime. Kept separate from the scraper so the on-disk layout is defined
 * in exactly one place.
 */

import fs from 'node:fs';
import path from 'node:path';
import { CourseTuple, TermIndex, TermSummary, compareTerms } from '../lib/data/courseData';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const TERMS_DIR = path.join(DATA_DIR, 'terms');

function ensureDirs() {
    fs.mkdirSync(TERMS_DIR, { recursive: true });
}

/**
 * Written without a trailing newline and with no whitespace: these files are
 * fetched by the browser, not read by humans.
 */
function writeJson(file: string, value: unknown) {
    fs.writeFileSync(file, JSON.stringify(value), 'utf8');
}

export function writeTerm(term: { id: string; name: string; rows: CourseTuple[] }) {
    ensureDirs();
    writeJson(path.join(TERMS_DIR, `${term.id}.json`), term);
}

export function readIndex(): TermIndex | null {
    const file = path.join(DATA_DIR, 'index.json');
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8')) as TermIndex;
}

function writeIndex(terms: TermSummary[]) {
    ensureDirs();
    const sorted = [...terms].sort(compareTerms);
    writeJson(path.join(DATA_DIR, 'index.json'), {
        generatedAt: new Date().toISOString(),
        terms: sorted,
    } satisfies TermIndex);
}

/**
 * Insert or replace one term in the index, preserving every other entry.
 * Used by the scraper, which only ever refreshes the current term.
 */
export function upsertIndexEntry(entry: TermSummary) {
    const existing = readIndex()?.terms ?? [];
    const next = existing.filter((t) => t.id !== entry.id);
    next.push(entry);
    writeIndex(next);
}
