'use client';

import dynamic from 'next/dynamic';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import QuickCallButton from '@/components/layout/QuickCallButton';
import ScrollRestoration from '@/components/layout/ScrollRestoration';
import SmoothScroll from '@/components/layout/SmoothScroll';

const FloatingContactBar = dynamic(
  () => import('@/components/layout/FloatingContactBar'),
  { ssr: false }
);

const AIConcierge = dynamic(
  () => import('@/components/concierge/AIConcierge').then((m) => m.AIConcierge),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <ScrollRestoration />
      {children}
      <FloatingContactBar />
      <AIConcierge />
      <ScrollToTopButton />
      <QuickCallButton />
    </>
  );
}
