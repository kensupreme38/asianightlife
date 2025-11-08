'use client';

import FloatingContactBar from '@/components/layout/FloatingContactBar';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import QuickCallButton from '@/components/layout/QuickCallButton';
import ScrollRestoration from '@/components/layout/ScrollRestoration';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollRestoration />
      {children}
      <FloatingContactBar />
      <ScrollToTopButton />
      <QuickCallButton />
    </>
  );
}
