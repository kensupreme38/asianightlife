import { detectCityFromVenue, getVenuePath } from "./cities";
import { getVenueSlug } from "./slug-utils";

export function getVenueUrl(
  venue: { slug?: string; name: string; country: string; address: string }
): string {
  const slug = getVenueSlug(venue);
  const city = detectCityFromVenue(venue.country, venue.address);
  const cityCode = city?.code ?? "singapore";
  return getVenuePath(cityCode, slug);
}
