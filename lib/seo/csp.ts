/**
 * Content Security Policy, delivered as a <meta> tag.
 *
 * GitHub Pages sends Strict-Transport-Security and nothing else, and gives no
 * way to add response headers, so the document has to carry its own policy. A
 * meta CSP is enforced exactly like a header one with two exceptions:
 *
 *   - frame-ancestors is ignored, so clickjacking cannot be blocked here. The
 *     app stores nothing but a course selection in localStorage and has no
 *     authenticated state to steal, so framing costs little; a host that can
 *     send headers should still set frame-ancestors and X-Frame-Options.
 *   - report-uri/report-to are ignored, so violations only reach the console.
 *
 * script-src needs 'unsafe-inline' because a static export has no server to
 * mint a per-request nonce, and Next inlines the RSC payload as
 * self.__next_f.push(...) calls. The directive is still worth setting: it
 * confines scripts to this origin, which is what blocks an injected
 * <script src="//evil"> even though it cannot stop an injected inline block.
 */
const DIRECTIVES: Record<string, string[]> = {
    'default-src': ["'self'"],

    // See the note above on 'unsafe-inline'.
    'script-src': ["'self'", "'unsafe-inline'"],

    // Tailwind ships a stylesheet, but Next inlines critical CSS and the
    // course table sets grid positions through the style attribute.
    'style-src': ["'self'", "'unsafe-inline'"],

    // data: for inlined SVG icons, blob: for the canvas the PNG/JPG export
    // renders into before it is handed to the download.
    'img-src': ["'self'", 'data:', 'blob:'],

    // next/font downloads Inter and Outfit at build time and serves them from
    // /_next/static/media, so no third-party font host is involved.
    'font-src': ["'self'", 'data:'],

    // Course JSON is same-origin. cdnjs is the Roboto TTF that the PDF export
    // pulls at runtime for Turkish glyph coverage — the one third party the
    // site still talks to, and only when someone exports a PDF.
    'connect-src': ["'self'", 'https://cdnjs.cloudflare.com'],

    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],

    // Nothing here embeds or is embedded, and no plugin content exists.
    'frame-src': ["'none'"],
    'child-src': ["'none'"],
    'object-src': ["'none'"],

    // No form posts anywhere in the app, and no <base> rewriting.
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
};

export const CONTENT_SECURITY_POLICY = [
    ...Object.entries(DIRECTIVES).map(([name, values]) => `${name} ${values.join(' ')}`),
    'upgrade-insecure-requests',
].join('; ');
