import { Inter, Outfit } from 'next/font/google';

import '@/app/globals.css';
import { ScheduleProvider } from '@/context/ScheduleContext';
import Navbar from '@/components/layout/Navbar';
import JsonLd from '@/components/seo/JsonLd';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { HTML_LANG, type Locale } from '@/lib/i18n/config';
import { siteJsonLd } from '@/lib/seo/jsonLd';
import { CONTENT_SECURITY_POLICY } from '@/lib/seo/csp';
import { absoluteUrl } from '@/lib/seo/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

/**
 * The document, shared by both language trees.
 *
 * There are two root layouts — app/(tr) and app/(en) — rather than one, because
 * `<html lang>` can only be set by a root layout and it has to say `tr` on the
 * Turkish pages. A single layout has no way to know which language it is
 * rendering: the locale is the route, and a root layout receives no params.
 */
export default function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html lang={HTML_LANG[locale]}>
      {/*
        The no-head-element rule is aimed at the pages router, where <head>
        conflicts with next/head. In an app-router root layout it is the
        documented way to emit raw tags, and the CSP has to sit at the top of
        <head> to cover the scripts below it — letting React hoist it up from
        the body would leave its position unguaranteed.
      */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/*
          GitHub Pages serves static files and sends no security headers of its
          own beyond HSTS, and it offers no way to add any — so the policy has
          to travel in the document. A meta CSP covers everything a header CSP
          does except frame-ancestors, which browsers ignore here; see
          lib/seo/csp.ts.
        */}
        <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        {/*
          The course tables are fetched and rendered in the browser, so a
          crawler that does not run JavaScript sees an empty page. /llms.txt
          describes the site and points at the underlying JSON instead.

          Absolute, because Next only rewrites basePath into <Link> and asset
          URLs — a root-relative href written here would leave the project
          subpath off and point at the domain root.
        */}
        <link
          rel="alternate"
          type="text/plain"
          href={`${absoluteUrl('/', 'tr')}llms.txt`}
          title="llms.txt"
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col pt-16`}>
        <JsonLd data={siteJsonLd(locale)} />
        <LocaleProvider locale={locale}>
          <ScheduleProvider>
            <Navbar />
            {children}
          </ScheduleProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
