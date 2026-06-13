'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // Native scroll is smoother on touch devices; Lenis adds constant RAF overhead.
    if (prefersReducedMotion || isCoarsePointer) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      lerp: 0.12,
    });

    (window as Window & { lenis?: Lenis }).lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    requestAnimationFrame(() => {
      lenis.scrollTo(0, { immediate: false, duration: 0.4 });
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as Window & { lenis?: Lenis }).lenis;
    };
  }, [pathname]);

  return null;
}
