import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export function generateDJListMetadata(locale: string): Metadata {
  const titles: Record<string, string> = {
    en: "DJ Voting - Top DJs | Asia Night Life",
    vi: "Bình chọn DJ - Top DJs | Asia Night Life",
    zh: "DJ投票 - 顶级DJ | Asia Night Life",
    id: "Pemungutan Suara DJ - Top DJs | Asia Night Life",
    ja: "DJ投票 - トップDJ | Asia Night Life",
    ko: "DJ 투표 - 탑 DJ | Asia Night Life",
    ru: "Голосование за DJ - Топ DJ | Asia Night Life",
    th: "โหวต DJ - Top DJs | Asia Night Life",
  };

  const descriptions: Record<string, string> = {
    en: "Discover talented DJs, vote for your favorites, and see who's trending in the nightlife scene. Join the DJ voting community at Asia Night Life.",
    vi: "Khám phá các DJ tài năng, bình chọn cho những DJ yêu thích của bạn và xem ai đang thịnh hành trong giới nightlife. Tham gia cộng đồng bình chọn DJ tại Asia Night Life.",
    zh: "发现才华横溢的DJ，为您的最爱投票，看看谁在夜生活场景中流行。加入Asia Night Life的DJ投票社区。",
    id: "Temukan DJ berbakat, pilih favorit Anda, dan lihat siapa yang sedang trending di dunia nightlife. Bergabunglah dengan komunitas pemungutan suara DJ di Asia Night Life.",
    ja: "才能あるDJを発見し、お気に入りに投票し、ナイトライフシーンでトレンドになっている人を見てください。Asia Night LifeのDJ投票コミュニティに参加してください。",
    ko: "재능 있는 DJ를 발견하고, 좋아하는 DJ에 투표하며, 나이트라이프 장면에서 트렌드인 사람을 확인하세요. Asia Night Life의 DJ 투표 커뮤니티에 참여하세요.",
    ru: "Откройте для себя талантливых DJ, проголосуйте за своих фаворитов и посмотрите, кто в тренде в ночной жизни. Присоединяйтесь к сообществу голосования за DJ в Asia Night Life.",
    th: "ค้นพบ DJ ที่มีพรสวรรค์ โหวตให้กับ DJ ที่คุณชื่นชอบ และดูว่าใครกำลังเป็นที่นิยมในฉากไนท์ไลฟ์ เข้าร่วมชุมชนการโหวต DJ ที่ Asia Night Life",
  };

  return generatePageMetadata({
    locale,
    path: "/dj",
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: "dj, voting, nightlife, music, dj ranking, top djs, asia night life",
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: "website",
    },
  });
}

