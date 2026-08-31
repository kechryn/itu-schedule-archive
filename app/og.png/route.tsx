import { ImageResponse } from 'next/og';

import { getArchiveStats, getStaticTerms } from '@/lib/data/build';
import { termLabel } from '@/lib/seo/site';

// Rendered once at build time; `output: export` has no request to render it on.
export const dynamic = 'force-static';

const size = { width: 1200, height: 630 };

/**
 * The social card, served at /og.png.
 *
 * A route handler rather than the opengraph-image file convention, which emits
 * an extensionless `opengraph-image` file. GitHub Pages types responses by
 * extension, so that file goes out as application/octet-stream and the
 * crawlers that check Content-Type refuse it.
 *
 * Generated from the data index rather than drawn by hand, so the term range
 * and section count on the card cannot drift away from the archive.
 *
 * One card serves both languages, in Turkish: it is the default language and
 * the audience's, and a second image would double the build for a thumbnail
 * whose numbers carry most of the meaning.
 */
export async function GET() {
    const stats = getArchiveStats();
    const terms = getStaticTerms();
    const oldest = terms[terms.length - 1];
    const newest = terms[0];

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#F5F5F7',
                    padding: '72px 80px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 30,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            color: '#2563EB',
                            fontWeight: 700,
                        }}
                    >
                        İstanbul Teknik Üniversitesi
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 92,
                            fontWeight: 800,
                            color: '#0F172A',
                            marginTop: 18,
                            lineHeight: 1.05,
                        }}
                    >
                        Ders Programı Arşivi
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 38,
                            color: '#64748B',
                            marginTop: 24,
                        }}
                    >
                        Bütün dönemler. Çakışmasız ders programı.
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 64 }}>
                    <Stat value={stats.courseCount.toLocaleString('tr-TR')} label="ders şubesi" />
                    <Stat value={String(stats.termCount)} label="dönem" />
                    <Stat
                        value={`${termLabel(oldest.year, oldest.season).split(' ')[0].slice(0, 4)}–${newest.year.slice(5)}`}
                        label="yıl"
                    />
                </div>
            </div>
        ),
        size
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: '#0F172A' }}>
                {value}
            </div>
            <div style={{ display: 'flex', fontSize: 28, color: '#94A3B8', marginTop: 4 }}>
                {label}
            </div>
        </div>
    );
}
