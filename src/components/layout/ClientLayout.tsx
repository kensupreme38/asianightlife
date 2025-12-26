'use client';

import FloatingContactBar from '@/components/layout/FloatingContactBar';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import QuickCallButton from '@/components/layout/QuickCallButton';
import ScrollRestoration from '@/components/layout/ScrollRestoration';
import SmoothScroll from '@/components/layout/SmoothScroll';
import SnowEffect from '@/components/layout/SnowEffect';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <ScrollRestoration />
      <SnowEffect />
      {children}
      <FloatingContactBar />
      <ScrollToTopButton />
      <QuickCallButton />
    </>
  );
}
