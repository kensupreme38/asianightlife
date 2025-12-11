'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'scale' | 'lift';
}

/**
 * Button component with built-in Framer Motion animations
 * Provides smooth press and hover effects
 */
export function MotionButton({
  children,
  className,
  variant = 'scale',
  ...props
}: MotionButtonProps) {
  const variants = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
    },
    lift: {
      whileHover: { y: -2, scale: 1.02 },
      whileTap: { y: 0, scale: 0.98 },
    },
    default: {
      whileHover: { opacity: 0.9 },
      whileTap: { scale: 0.98 },
    },
  };

  return (
    <motion.button
      {...variants[variant]}
      transition={{ duration: 0.2 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

