import type { Metadata } from 'next';

import RootShell from '@/components/layout/RootShell';
import { rootMetadata } from '@/lib/seo/site';

export const metadata: Metadata = rootMetadata('tr');

export default function TurkishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="tr">{children}</RootShell>;
}
