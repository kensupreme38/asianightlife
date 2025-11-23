import { Suspense } from 'react';
import HomeClient from '@/components/home/HomeClient';
import Loading from './loading';

export default function Page() {
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Asia Night Life",
    url: "https://asianightlife.sg",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://asianightlife.sg/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  } as const;

  return (
    <>
      <Suspense fallback={<Loading />}>
        <HomeClient />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
    </>
  );
}
