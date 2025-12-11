'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionHoverProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  rotate?: number;
  y?: number;
  transition?: {
    duration?: number;
    ease?: string | number[];
  };
}

/**
 * Component with hover animations
 * Scales, lifts, or rotates on hover
 */
export function MotionHover({
  children,
  className,
  scale = 1.05,
  rotate = 0,
  y = -5,
  transition = { duration: 0.3 },
}: MotionHoverProps) {
  return (
    <motion.div
      whileHover={{ scale, rotate, y }}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

