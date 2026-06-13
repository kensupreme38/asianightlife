import { detectCityFromVenue, getVenuePath } from "./cities";
import { generateSlug } from "./slug-utils";

export function getVenueUrl(
  venue: { slug?: string; name: string; country: string; address: string }
): string {
  const slug = venue.slug || generateSlug(venue.name);
  const city = detectCityFromVenue(venue.country, venue.address);
  const cityCode = city?.code ?? "singapore";
  return getVenuePath(cityCode, slug);
}
