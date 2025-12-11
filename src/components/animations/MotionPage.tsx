'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, defaultTransition } from './motion-presets';
import { cn } from '@/lib/utils';

interface MotionPageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page wrapper with smooth enter/exit animations
 * Use this to wrap page content for smooth transitions
 */
export function MotionPage({ children, className }: MotionPageProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={defaultTransition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

