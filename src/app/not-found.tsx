import Link from 'next/link';
import { Metadata } from 'next';
import { generateHreflangAlternates } from '@/lib/seo';

export const metadata: Metadata = {
  title: "404 - Page Not Found | Asia Night Life",
  description: "The page you are looking for does not exist. Return to Asia Night Life homepage to discover KTVs, Clubs, and Live Houses.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/404",
  },
};

const NotFound = () => {
  const notFoundSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "404 - Page Not Found",
    description: "The requested page could not be found",
    url: "https://asianightlife.sg/404",
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center px-4">
          <h1 className="mb-4 text-6xl md:text-8xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
            Page Not Found
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Return to Homepage
            </Link>
            <Link
              href="/en/dj"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
            >
              Browse DJs
            </Link>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(notFoundSchema) }}
      />
    </>
  );
};

export default NotFound;
