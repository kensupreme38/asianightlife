import { generateTrustPageMetadata, TrustPageRoute } from "@/lib/trust-page-route";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateTrustPageMetadata("privacy", locale);
}

export default function PrivacyPage() {
  return <TrustPageRoute slug="privacy" />;
}
