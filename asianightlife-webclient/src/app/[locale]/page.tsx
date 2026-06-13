import { Suspense } from 'react';
import HomeClient from '@/components/home/HomeClient';
import Loading from './loading';
import { Metadata } from 'next';
import { generatePageMetadata, SITE_URL } from '@/lib/seo';
import { ktvData } from '@/lib/data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    en: "Asia's #1 Nightlife Booking Platform | Asia Night Life",
    vi: "Nền tảng đặt chỗ nightlife số 1 Châu Á | Asia Night Life",
    zh: "亚洲第一夜生活预订平台 | Asia Night Life",
    id: "Platform Booking Nightlife #1 Asia | Asia Night Life",
    ja: "アジアNo.1ナイトライフ予約プラットフォーム | Asia Night Life",
    ko: "아시아 1위 나이트라이프 예약 플랫폼 | Asia Night Life",
    ru: "Платформа бронирования nightlife №1 в Азии | Asia Night Life",
    th: "แพลตฟอร์มจองไนท์ไลฟ์อันดับ 1 ของเอเชีย | Asia Night Life",
  };

  const descriptions: Record<string, string> = {
    en: "Book verified KTVs, Clubs, Live Houses, VIP Lounges & Entertainment Venues across Singapore, Vietnam, Thailand & Malaysia. WhatsApp concierge 24/7.",
    vi: "Đặt KTV, Club, Live House, VIP Lounge đã xác minh tại Singapore, Việt Nam, Thái Lan & Malaysia. Concierge WhatsApp 24/7.",
    zh: "预订新加坡、越南、泰国和马来西亚的KTV、俱乐部、Live House和VIP包厢。WhatsApp礼宾24/7。",
    id: "Pesan KTV, Klub, Live House, VIP Lounge terverifikasi di Singapura, Vietnam, Thailand & Malaysia.",
    ja: "シンガポール、ベトナム、タイ、マレーシアのKTV、クラブ、ライブハウス、VIPラウンジを予約。WhatsAppコンシェルジュ24時間。",
    ko: "싱가포르, 베트남, 태국, 말레이시아의 KTV, 클럽, 라이브 하우스, VIP 라운지 예약. WhatsApp 컨시어지 24/7.",
    ru: "Бронируйте проверенные KTV, клубы, live house и VIP-лаунжи в Сингапуре, Вьетнаме, Таиланде и Малайзии.",
    th: "จอง KTV, คลับ, Live House, VIP Lounge ที่ verified ทั่วสิงคโปร์ เวียดนาม ไทย และมาเลเซีย",
  };

  return generatePageMetadata({
    locale,
    path: "",
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: "ktv, club, live house, booking, karaoke, nightlife, singapore, vietnam, thailand, malaysia",
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: "website",
    },
  });
}

export default function Page() {
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Asia Night Life",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  } as const;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nightlife Venues — Asia Night Life",
    description: "Verified KTVs, clubs and VIP lounges across Southeast Asia",
    numberOfItems: ktvData.length,
    itemListElement: ktvData.slice(0, 10).map((venue, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: venue.name,
      item: {
        "@type": "NightClub",
        name: venue.name,
        address: venue.address,
      },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </>
  );
}
