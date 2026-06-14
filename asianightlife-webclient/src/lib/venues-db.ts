import { createVenuesReader } from "@/utils/supabase/venues-reader";

export type VenueRow = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  country?: string | null;
  category?: string | null;
  address?: string | null;
  price?: string | null;
  description?: string | null;
  main_image_url?: string | null;
  images?: string[] | null;
  hours?: string | null;
  phone?: string | null;
  status?: string | null;
  map_embed_url?: string | null;
};

/** Load active venues from Supabase. Returns [] when the query fails. */
export async function fetchActiveVenues(
  columns = "*"
): Promise<{ venues: VenueRow[]; fromDatabase: boolean }> {
  try {
    const supabase = await createVenuesReader();
    const { data, error } = await supabase
      .from("venues")
      .select(columns)
      .eq("status", "active");

    if (error || data == null) {
      return { venues: [], fromDatabase: false };
    }

    return { venues: data as VenueRow[], fromDatabase: true };
  } catch {
    return { venues: [], fromDatabase: false };
  }
}
