import { Metadata } from "next";
import { generateDJListMetadata } from "./metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateDJListMetadata(locale);
}

export default function DJLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
