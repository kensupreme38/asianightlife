import type { Metadata } from "next";
import DJDetailPage, {
  generateMetadata as generateLocaleDJMetadata,
} from "@/app/[locale]/dj/[id]/page";

interface DJDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: DJDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return generateLocaleDJMetadata({
    params: Promise.resolve({ id, locale: "en" }),
  });
}

export default async function DJDetailPageEn({ params }: DJDetailPageProps) {
  const { id } = await params;
  return DJDetailPage({ params: Promise.resolve({ id, locale: "en" }) });
}
