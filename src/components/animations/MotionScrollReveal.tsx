'use client';

import { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Variants } from 'framer-motion';
import { fadeInUp, defaultTransition } from './motion-presets';
import { cn } from '@/lib/utils';

interface MotionScrollRevealProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  threshold?: number;
}

/**
 * Enhanced ScrollReveal component using Framer Motion
 * Replaces the CSS-based ScrollReveal with smooth Framer Motion animations
 */
export function MotionScrollReveal({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
  duration = 0.5,
  triggerOnce = true,
  threshold = 0.1,
}: MotionScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: threshold,
    margin: '0px 0px -100px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        ...defaultTransition,
        duration,
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

