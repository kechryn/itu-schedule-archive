import type { Metadata } from 'next';

import RootShell from '@/components/layout/RootShell';
import { rootMetadata } from '@/lib/seo/site';

export const metadata: Metadata = rootMetadata('en');

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
