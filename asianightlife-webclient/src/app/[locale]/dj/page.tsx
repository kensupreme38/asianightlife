import { Suspense } from "react";
import DJClient from "@/components/dj/DJClient";
import Loading from "../loading";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    en: "Best DJs Rankings & Profiles | Asia Night Life",
    vi: "Bảng Xếp Hạng & Hồ Sơ DJ Xuất Sắc Nhất | Asia Night Life",
    zh: "最佳 DJ 排行榜和个人资料 | Asia Night Life",
    id: "Peringkat & Profil DJ Terbaik | Asia Night Life",
    ja: "最高のDJランキングとプロフィール | Asia Night Life",
    ko: "최고의 DJ 순위 및 프로필 | Asia Night Life",
    ru: "Рейтинги и профили лучших диджеев | Asia Night Life",
    th: "อันดับและโปรไฟล์ดีเจที่ดีที่สุด | Asia Night Life",
  };

  const descriptions: Record<string, string> = {
    en: "Vote and discover the best DJs in Singapore, Vietnam, Thailand, and Malaysia. View DJ rankings, profiles, bios, and support your favorite artists.",
    vi: "Bình chọn và khám phá những DJ xuất sắc nhất tại Singapore, Việt Nam, Thái Lan và Malaysia. Xem bảng xếp hạng, hồ sơ, tiểu sử DJ và ủng hộ nghệ sĩ yêu thích.",
    zh: "投票并发现新加坡、越南、泰国和马来西亚的最佳 DJ。查看 DJ 排行榜、个人资料、简介并支持您喜爱的艺术家。",
    id: "Pilih dan temukan DJ terbaik di Singapura, Vietnam, Thailand, dan Malaysia. Lihat peringkat, profil, bio DJ, dan dukung artis favorit Anda.",
    ja: "シンガポール、ベトナム、タイ、マレーシアの最高のDJを投票して発見。DJのランキング、プロフィール、バイオグラフィーを表示し、お気に入りのアーティストをサポートしましょう。",
    ko: "싱가포르, 베트남, 태국, 말레이시아의 최고의 DJ를 투표하고 발견하세요. DJ 순위, 프로필, 약력을 보고 좋아하는 아티스트를 지원하세요.",
    ru: "Голосуйте и открывайте для себя лучших диджеев в Сингапуре, Вьетнаме, Таиланде и Малайзии. Просматривайте рейтинги диджеев, профили, биографии и поддерживайте любимых артистов.",
    th: "โหวตและค้นพบดีเจที่ดีที่สุดในสิงคโปร์ เวียดนาม ไทย และมาเลเซีย ดูอันดับดีเจ โปรไฟล์ ประวัติ และสนับสนุนศิลปินที่คุณชื่นชอบ",
  };

  return generatePageMetadata({
    locale,
    path: "/dj",
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: "dj rankings, best djs asia, singapore djs, vietnam djs, vote djs, dj profiles",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DJClient />
    </Suspense>
  );
}
