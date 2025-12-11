'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis with optimized smooth scroll settings for faster response
    const lenis = new Lenis({
      duration: 0.8, // Reduced from 1.2 for faster scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2, // Increased from 1 for more responsive scrolling
      smoothTouch: true, // Enabled for better mobile experience
      touchMultiplier: 1.5, // Reduced from 2 for better control
      infinite: false,
      lerp: 0.1, // Lower lerp value for faster response (default is 0.1)
    });

    // Optimized animation frame function for smooth scrolling
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Scroll to top on route change (reduced delay for faster response)
    if (pathname) {
      // Minimal delay for immediate response
      requestAnimationFrame(() => {
        lenis.scrollTo(0, { immediate: false, duration: 0.5 });
      });
    }

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}

