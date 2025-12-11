'use client';

import { ReactNode } from 'react';

/**
 * Framer Motion Provider
 * Wraps the app to enable Framer Motion animations globally
 * This is a lightweight wrapper - Framer Motion doesn't require a context provider
 * but we keep this for consistency and potential future configuration
 */
export default function FramerMotionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

