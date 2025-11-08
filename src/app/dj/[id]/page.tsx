import { Metadata } from "next";
import { notFound } from "next/navigation";
import DJDetailClient from "@/components/dj/DJDetailClient";

interface DJDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: DJDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/djs/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        title: "DJ Not Found - Asia Night Life",
      };
    }

    const dj = await response.json();

    return {
      title: `${dj.name} - DJ Profile | Asia Night Life`,
      description: dj.bio || `View ${dj.name}'s DJ profile and vote`,
      openGraph: {
        title: `${dj.name} - DJ Profile`,
        description: dj.bio || `View ${dj.name}'s DJ profile and vote`,
        images: dj.image_url ? [dj.image_url] : undefined,
      },
    };
  } catch (error) {
    return {
      title: "DJ Profile - Asia Night Life",
    };
  }
}

export default async function DJDetailPage({ params }: DJDetailPageProps) {
  const { id } = await params;

  return <DJDetailClient id={id} />;
}

