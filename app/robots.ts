import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo/site';

/**
 * Crawlers that answer questions from page content, as distinct from the ones
 * that only build a search index. They are allowed by default — the point of
 * naming them is that the default is a guess, and several of these operators
 * treat an explicit rule as the signal for whether their assistant may quote
 * and cite a site rather than merely reach it.
 *
 * Google-Extended and Applebot-Extended are not crawlers at all; they are
 * opt-out switches for Gemini and Apple Intelligence over what Googlebot and
 * Applebot already fetched, and only an explicit Allow keeps them in.
 */
const ASSISTANT_CRAWLERS = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot',
    'Applebot-Extended',
    'CCBot',
    'Amazonbot',
    'Meta-ExternalAgent',
    'DuckAssistBot',
    'cohere-ai',
    'YouBot',
];

// `output: export` has no request to serve this per-hit, so it has to be
// generated once at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                userAgent: ASSISTANT_CRAWLERS,
                allow: '/',
            },
        ],
        sitemap: `${absoluteUrl('/')}sitemap.xml`,
    };
}
