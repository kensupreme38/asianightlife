import type { MetadataRoute } from "next";
import { ktvData } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";

// Supported locales
const locales = ['en', 'vi', 'zh', 'id', 'ja', 'ko', 'ru', 'th'];
const base = "https://asianightlife.sg";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Generate static entries for all locales
  for (const locale of locales) {
    // Home page for each locale
    entries.push({
      url: `${base}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    });

    // DJ listing page for each locale
    entries.push({
      url: `${base}/${locale}/dj`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  // Venue entries for all locales
  for (const venue of ktvData) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}/venue/${venue.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Fetch DJs from database and add to sitemap
  try {
    const supabase = await createClient();
    const { data: djs, error } = await supabase
      .from("djs")
      .select("id, updated_at, created_at")
      .eq("is_active", true)
      .eq("status", "active");

    if (!error && djs && djs.length > 0) {
      for (const dj of djs) {
        for (const locale of locales) {
          const lastModified = dj.updated_at 
            ? new Date(dj.updated_at) 
            : dj.created_at 
            ? new Date(dj.created_at) 
            : new Date();

          entries.push({
            url: `${base}/${locale}/dj/${dj.id}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching DJs for sitemap:", error);
    // Continue without DJ entries if there's an error
  }

  return entries;
}


