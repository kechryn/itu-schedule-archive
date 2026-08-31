import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ScheduleProvider } from '@/context/ScheduleContext';
import Navbar from '@/components/layout/Navbar';
import JsonLd from '@/components/seo/JsonLd';
import { siteJsonLd } from '@/lib/seo/jsonLd';
import { CONTENT_SECURITY_POLICY } from '@/lib/seo/csp';
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Pages set their own title; this is the home page's and the fallback.
  title: {
    default: 'ITU Schedule Archive — Course Schedules and Timetable Planner',
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: 'education',

  // The home page is a client component and cannot export metadata, so its
  // canonical lives here. Every other route overrides this.
  alternates: { canonical: absoluteUrl('/') },

  keywords: [
    'ITU',
    'Istanbul Technical University',
    'İTÜ ders programı',
    'course schedule',
    'ders programı',
    'CRN',
    'ITU OBS',
    'timetable planner',
    'ders programı oluşturucu',
    'course archive',
  ],

  authors: [{ name: 'Kerem Çirtma', url: 'https://github.com/kechryn' }],
  creator: 'Kerem Çirtma',
  publisher: 'Kerem Çirtma',

  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'ITU Schedule Archive — Course Schedules and Timetable Planner',
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/'),
    locale: 'en_US',
    images: [OG_IMAGE],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ITU Schedule Archive',
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // A course archive is read, not called or mailed; stop mobile Safari from
  // linking CRNs and time ranges as phone numbers and dates.
  formatDetection: { telephone: false, date: false, address: false },

  referrer: 'strict-origin-when-cross-origin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
          href={`${absoluteUrl('/')}llms.txt`}
          title="llms.txt"
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col pt-16`}>
        <JsonLd data={siteJsonLd()} />
        <ScheduleProvider>
          <Navbar />
          {children}
        </ScheduleProvider>
      </body>
    </html>
  );
}
