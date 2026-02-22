import { Suspense } from 'react';
import HomeClient from '@/components/home/HomeClient';
import Loading from './loading';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    en: "Asia Night Life - Premier Entertainment Venue Booking",
    vi: "Asia Night Life - Đặt chỗ giải trí hàng đầu",
    zh: "Asia Night Life - 顶级娱乐场所预订",
    id: "Asia Night Life - Pemesanan Venue Hiburan Terkemuka",
    ja: "Asia Night Life - プレミアエンターテインメント会場予約",
    ko: "Asia Night Life - 프리미엄 엔터테인먼트 장소 예약",
    ru: "Asia Night Life - Бронирование премиальных развлекательных заведений",
    th: "Asia Night Life - การจองสถานบันเทิงชั้นนำ",
  };

  const descriptions: Record<string, string> = {
    en: "The leading booking platform for KTVs, Clubs, and Live Houses in Singapore, Vietnam, Thailand, Malaysia. Discover and book now!",
    vi: "Nền tảng đặt chỗ hàng đầu cho KTV, Club và Live House tại Singapore, Việt Nam, Thái Lan, Malaysia. Khám phá và đặt ngay!",
    zh: "新加坡、越南、泰国、马来西亚领先的KTV、俱乐部和Live House预订平台。立即发现并预订！",
    id: "Platform pemesanan terkemuka untuk KTV, Klub, dan Live House di Singapura, Vietnam, Thailand, Malaysia. Temukan dan pesan sekarang!",
    ja: "シンガポール、ベトナム、タイ、マレーシアのKTV、クラブ、ライブハウスの主要予約プラットフォーム。今すぐ発見して予約！",
    ko: "싱가포르, 베트남, 태국, 말레이시아의 KTV, 클럽, 라이브 하우스를 위한 선도적인 예약 플랫폼. 지금 발견하고 예약하세요!",
    ru: "Ведущая платформа бронирования для KTV, клубов и Live House в Сингапуре, Вьетнаме, Таиланде, Малайзии. Откройте для себя и забронируйте прямо сейчас!",
    th: "แพลตฟอร์มการจองชั้นนำสำหรับ KTV, คลับ และ Live House ในสิงคโปร์ เวียดนาม ไทย มาเลเซีย ค้นพบและจองเลย!",
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
    url: "https://asianightlife.sg",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://asianightlife.sg/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  } as const;

  // Add ItemList schema for better SEO - helps Google understand the venue listings
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Entertainment Venues in Asia",
    description: "Discover top KTVs, Clubs, and Live Houses across Singapore, Vietnam, Thailand, and Malaysia",
    numberOfItems: 100,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "NightClub",
          name: "Premium Entertainment Venues",
          description: "Browse our curated selection of nightlife venues",
        }
      }
    ]
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
