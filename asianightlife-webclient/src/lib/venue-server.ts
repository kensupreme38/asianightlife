import { generateSlug, getVenueSlug, legacyGenerateSlug } from "@/lib/slug-utils";
import { createVenuesReader } from "@/utils/supabase/venues-reader";

/** Unified shape for metadata / JSON-LD (from Supabase). */
export type VenueMeta = {
  name: string;
  category: string;
  country: string;
  address?: string | null;
  description?: string | null;
  main_image_url?: string | null;
  images?: string[] | null;
  hours?: string | null;
  phone?: string | null;
  price?: string | null;
  updated_at?: string | null;
  /** Canonical path segment for links */
  pathSlug: string;
};

/** Full venue row for server → client hydration (avoids soft 404). */
export type VenueRecord = {
  id: string;
  name: string;
  slug: string;
  category: string;
  country: string;
  address: string;
  description: string;
  main_image_url: string;
  images: string[];
  hours: string;
  phone: string;
  price: string;
  rating?: number | null;
  status: string;
  mapEmbedUrl?: string;
  updated_at?: string | null;
};

function rowToMeta(row: Record<string, unknown>): VenueMeta {
  const images = row.images;
  return {
    name: String(row.name ?? ""),
    category: String(row.category ?? ""),
    country: String(row.country ?? ""),
    address: (row.address as string) ?? null,
    description: (row.description as string) ?? null,
    main_image_url: (row.main_image_url as string) ?? null,
    images: Array.isArray(images) ? (images as string[]) : [],
    hours: (row.hours as string) ?? null,
    phone: (row.phone as string) ?? null,
    price: (row.price as string) ?? null,
    updated_at: (row.updated_at as string) ?? null,
    pathSlug: getVenueSlug({
      slug: row.slug as string | undefined,
      name: String(row.name ?? ""),
    }),
  };
}

export function rowToVenueRecord(row: Record<string, unknown>): VenueRecord {
  const images = row.images;
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    slug: getVenueSlug({
      slug: row.slug as string | undefined,
      name: String(row.name ?? ""),
    }),
    category: String(row.category ?? ""),
    country: String(row.country ?? ""),
    address: String(row.address ?? ""),
    description: String(row.description ?? ""),
    main_image_url: String(row.main_image_url ?? ""),
    images: Array.isArray(images) ? (images as string[]) : [],
    hours: String(row.hours ?? ""),
    phone: String(row.phone ?? ""),
    price: String(row.price ?? ""),
    rating: row.rating != null ? Number(row.rating) : null,
    status: String(row.status ?? "active"),
    mapEmbedUrl: (row.map_embed_url as string) || undefined,
    updated_at: (row.updated_at as string) ?? null,
  };
}

function isNumericId(slug: string): boolean {
  return /^\d+$/.test(slug);
}

/**
 * Resolve venue for server components from Supabase.
 */
export async function resolveVenueBySlug(slug: string): Promise<VenueMeta | null> {
  try {
    const supabase = await createVenuesReader();
    const bySlug = await supabase
      .from("venues")
      .select("*")
      .eq("status", "active")
      .eq("slug", slug)
      .maybeSingle();

    if (!bySlug.error && bySlug.data) {
      return rowToMeta(bySlug.data as Record<string, unknown>);
    }

    const { data: activeVenues, error: listError } = await supabase
      .from("venues")
      .select("*")
      .eq("status", "active");

    if (!listError && activeVenues?.length) {
      const matched = activeVenues.find(
        (row) =>
          generateSlug(String(row.name ?? "")) === slug ||
          legacyGenerateSlug(String(row.name ?? "")) === slug
      );
      if (matched) {
        return rowToMeta(matched as Record<string, unknown>);
      }
    }

    if (isNumericId(slug) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)) {
      const byId = await supabase
        .from("venues")
        .select("*")
        .eq("status", "active")
        .eq("id", slug)
        .maybeSingle();
      if (!byId.error && byId.data) {
        return rowToMeta(byId.data as Record<string, unknown>);
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[resolveVenueBySlug]", e);
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.warn("[resolveVenueBySlug] Venue not found in database:", slug);
  }

  return null;
}

/** Full venue row for page hydration (same lookup rules as resolveVenueBySlug). */
export async function resolveVenueRecordBySlug(slug: string): Promise<VenueRecord | null> {
  const meta = await resolveVenueBySlug(slug);
  if (!meta) return null;

  try {
    const supabase = await createVenuesReader();
    const pathSlug = meta.pathSlug;

    const bySlug = await supabase
      .from("venues")
      .select("*")
      .eq("status", "active")
      .eq("slug", pathSlug)
      .maybeSingle();
    if (!bySlug.error && bySlug.data) {
      return rowToVenueRecord(bySlug.data as Record<string, unknown>);
    }

    const { data: activeVenues } = await supabase
      .from("venues")
      .select("*")
      .eq("status", "active");

    const matched = activeVenues?.find(
      (row) =>
        getVenueSlug({ slug: row.slug as string | undefined, name: String(row.name ?? "") }) === pathSlug ||
        generateSlug(String(row.name ?? "")) === pathSlug ||
        legacyGenerateSlug(String(row.name ?? "")) === pathSlug
    );
    if (matched) {
      return rowToVenueRecord(matched as Record<string, unknown>);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[resolveVenueRecordBySlug]", e);
    }
  }

  return null;
}
