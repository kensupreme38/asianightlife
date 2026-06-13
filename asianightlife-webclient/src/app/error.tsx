'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Add error reporting service (e.g., Sentry, LogRocket)
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-6xl md:text-8xl font-bold text-gray-900 dark:text-white">
          Oops!
        </h1>
        <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
          Something went wrong
        </h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        {error.digest && (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
