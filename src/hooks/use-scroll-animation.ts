"use client";
import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * Hook to detect when element enters viewport and trigger animation
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "100px", // Start loading 100px before element enters viewport
    triggerOnce = true,
    delay = 0,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If already animated and triggerOnce is true, don't observe again
    if (hasAnimated && triggerOnce) return;

    // Check if element is already in viewport (for elements loaded after scroll)
    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const margin = parseInt(rootMargin.replace('px', '')) || 0;
      const isInViewport = 
        rect.top < window.innerHeight + margin &&
        rect.bottom > -margin &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      if (isInViewport && !isVisible) {
        setTimeout(() => {
          setIsVisible(true);
          if (triggerOnce) {
            setHasAnimated(true);
          }
        }, delay);
      }
    };

    // Check immediately for elements already in viewport (for dynamically loaded content)
    setTimeout(checkInitialVisibility, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasAnimated(true);
                observer.disconnect();
              }
            }, delay);
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated, isVisible]);

  return { elementRef, isVisible };
}

