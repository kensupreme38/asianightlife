import type { MetadataRoute } from "next";
import { CITY_SLUGS } from "@/lib/cities";
import { COUNTRY_SLUGS } from "@/lib/countries";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { GUIDE_SLUGS } from "@/lib/guides";
import { BLOG_SLUGS } from "@/lib/blog";
import { TRAVEL_SLUGS } from "@/lib/travel-packages";
import { getVenueUrl } from "@/lib/venue-url";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { createVenuesReader } from "@/utils/supabase/venues-reader";

const locales = routing.locales;
const defaultLocale = routing.defaultLocale;

function localeUrl(locale: string, path: string): string {
  const bare = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return `${SITE_URL}${bare === "/" ? "" : bare}`;
  return `${SITE_URL}/${locale}${bare === "/" ? "" : bare}`;
}

type VenueSitemapEntry = { path: string; lastModified?: Date };

async function collectVenuePaths(): Promise<VenueSitemapEntry[]> {
  const seen = new Set<string>();
  const entries: VenueSitemapEntry[] = [];

  try {
    const supabase = await createVenuesReader();
    const { data: venues } = await supabase
      .from("venues")
      .select("slug, name, country, address, updated_at, created_at")
      .eq("status", "active");

    for (const venue of venues ?? []) {
      const path = getVenueUrl({
        slug: venue.slug ? String(venue.slug) : undefined,
        name: String(venue.name ?? ""),
        country: String(venue.country ?? "Singapore"),
        address: String(venue.address ?? ""),
      });
      if (seen.has(path)) continue;
      seen.add(path);
      const ts = venue.updated_at ?? venue.created_at;
      entries.push({
        path,
        lastModified: ts ? new Date(ts) : undefined,
      });
    }
  } catch {
    // Continue with static venue data
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const buildDate = new Date();

  const staticPaths = [
    "",
    "/book",
    "/guides",
    "/blog",
    "/trips",
    "/dj",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/booking-policy",
    ...CITY_SLUGS.map((s) => `/${s}`),
    ...COUNTRY_SLUGS.map((s) => `/countries/${s}`),
    ...CATEGORY_SLUGS.map((s) => `/categories/${s}`),
    ...GUIDE_SLUGS.map((s) => `/guides/${s}`),
    ...BLOG_SLUGS.map((s) => `/blog/${s}`),
    ...TRAVEL_SLUGS.map((s) => `/trips/${s}`),
  ];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: buildDate,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : path.includes("nightlife") ? 0.9 : 0.7,
      });
    }
  }

  const venuePaths = await collectVenuePaths();
  for (const { path, lastModified } of venuePaths) {
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: lastModified ?? buildDate,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  try {
    const supabase = await createVenuesReader();
    const { data: djs } = await supabase
      .from("djs")
      .select("id, updated_at, created_at")
      .eq("is_active", true)
      .eq("status", "active");

    for (const dj of djs ?? []) {
      const ts = dj.updated_at ?? dj.created_at;
      for (const locale of locales) {
        entries.push({
          url: localeUrl(locale, `/dj/${dj.id}`),
          lastModified: ts ? new Date(ts) : buildDate,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Continue without DJ entries
  }

  return entries;
}
