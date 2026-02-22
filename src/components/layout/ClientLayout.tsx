'use client';

import FloatingContactBar from '@/components/layout/FloatingContactBar';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import QuickCallButton from '@/components/layout/QuickCallButton';
import ScrollRestoration from '@/components/layout/ScrollRestoration';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { SkipLink } from '@/components/layout/SkipLink';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <SmoothScroll />
      <ScrollRestoration />
      {children}
      <FloatingContactBar />
      <ScrollToTopButton />
      <QuickCallButton />
    </>
  );
}
