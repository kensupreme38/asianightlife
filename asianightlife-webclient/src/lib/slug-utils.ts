/**
 * Vietnamese + Latin transliteration before ASCII slugify.
 * Old slugs stripped diacritics entirely (e.g. "Ăn tối" → "n-ti"); this maps them properly.
 */
const VIET_CHAR_MAP: Record<string, string> = {
  à: "a", á: "a", ả: "a", ã: "a", ạ: "a",
  ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
  â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
  è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
  ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
  ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
  ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o",
  ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
  ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
  ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
  ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
  ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
  đ: "d",
};

function transliterateToAscii(text: string): string {
  const mapped = text
    .split("")
    .map((char) => VIET_CHAR_MAP[char] ?? VIET_CHAR_MAP[char.toLowerCase()] ?? char)
    .join("");

  return mapped
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function finalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, "");
}

/** Legacy slug algorithm (stripped Vietnamese letters). Used for redirects / lookup. */
export function legacyGenerateSlug(name: string): string {
  return finalizeSlug(
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Generate URL-friendly slug from venue name.
 * Example: "Iconic KTV" -> "iconic-ktv"
 * Example: "Elite - Ăn tối trên sông Bạch Đằng" -> "elite-an-toi-tren-song-bach-dang"
 */
export function generateSlug(name: string): string {
  return finalizeSlug(transliterateToAscii(name));
}

/**
 * Canonical slug for links: prefer fresh transliterated slug unless admin set a custom one.
 */
export function getVenueSlug(venue: { slug?: string | null; name: string }): string {
  const fresh = generateSlug(venue.name);
  const stored = venue.slug?.trim();
  if (!stored) return fresh;
  if (stored === legacyGenerateSlug(venue.name)) return fresh;
  return stored;
}

/**
 * Find venue by slug - matches stored slug, new slug, legacy slug, or numeric id.
 */
export function findVenueIdBySlug(
  slug: string,
  venues: Array<{ id: number; name: string; slug?: string }>
): number | null {
  const slugMatch = venues.find((v) => v.slug === slug);
  if (slugMatch) return slugMatch.id;

  const generatedMatch = venues.find((v) => generateSlug(v.name) === slug);
  if (generatedMatch) return generatedMatch.id;

  const legacyMatch = venues.find((v) => legacyGenerateSlug(v.name) === slug);
  if (legacyMatch) return legacyMatch.id;

  const numericId = parseInt(slug, 10);
  if (!isNaN(numericId)) {
    const venueExists = venues.find((v) => v.id === numericId);
    if (venueExists) return numericId;
  }

  return null;
}
