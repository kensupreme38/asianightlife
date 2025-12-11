'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './motion-presets';
import { cn } from '@/lib/utils';

interface MotionStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Container component that staggers animation of its children
 * Perfect for lists, grids, or any collection of items
 */
export function MotionStagger({ children, className, staggerDelay = 0.1 }: MotionStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        ...staggerContainer,
        visible: {
          ...staggerContainer.visible,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Item component to use inside MotionStagger
 */
export function MotionStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={cn(className)}>
      {children}
    </motion.div>
  );
}

