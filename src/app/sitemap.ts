import type { MetadataRoute } from "next";
import { ktvData } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://asianightlife.sg";

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  ];

  const venueEntries: MetadataRoute.Sitemap = ktvData.map((v) => ({
    url: `${base}/venue/${v.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...venueEntries];
}


