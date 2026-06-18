import { generateTrustPageMetadata, TrustPageRoute } from "@/lib/trust-page-route";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateTrustPageMetadata("terms", locale);
}

export default function TermsPage() {
  return <TrustPageRoute slug="terms" />;
}
