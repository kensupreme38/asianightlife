/**
 * Generate URL-friendly slug from venue name
 * Example: "Iconic KTV" -> "iconic-ktv"
 * Example: "Karaoke BOSS KTV - 27 - 29 - 31 Duong 9A" -> "karaoke-boss-ktv-27-29-31-duong-9a"
 */
export function generateSlug(name: string, id?: number): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  return baseSlug;
}

/**
 * Find venue by slug - matches against venue.slug (if set) or generated slug from venue name
 * Returns the venue ID if found
 */
export function findVenueIdBySlug(
  slug: string,
  venues: Array<{ id: number; name: string; slug?: string }>
): number | null {
  // First try: exact match with venue.slug (custom slug from data)
  const slugMatch = venues.find((v) => v.slug === slug);
  if (slugMatch) return slugMatch.id;

  // Second try: exact slug match from generated name
  const exactMatch = venues.find((v) => generateSlug(v.name) === slug);
  if (exactMatch) return exactMatch.id;

  // Third try: check if slug is a number (backward compatibility with old ID-based URLs)
  const numericId = parseInt(slug, 10);
  if (!isNaN(numericId)) {
    const venueExists = venues.find(v => v.id === numericId);
    if (venueExists) return numericId;
  }
  
  return null;
}
