/** ISO 3166-1 alpha-2 codes for flag images (works on Windows, unlike emoji flags). */
export const COUNTRY_ISO: Record<string, string> = {
  Singapore: "sg",
  Vietnam: "vn",
  Thailand: "th",
  Malaysia: "my",
  Cambodia: "kh",
  Indonesia: "id",
  Japan: "jp",
  Macao: "mo",
  Philippines: "ph",
  "South Korea": "kr",
  Taiwan: "tw",
};

export function resolveCountryIso(countryOrIso: string): string | undefined {
  if (countryOrIso.length === 2) return countryOrIso.toLowerCase();
  return COUNTRY_ISO[countryOrIso]?.toLowerCase();
}

export function getCountryIsoCode(country: string): string | undefined {
  return COUNTRY_ISO[country];
}

/** Self-hosted SVG flags — reliable on all platforms (no CDN / emoji issues). */
export function getFlagUrl(countryOrIso: string): string {
  const iso = resolveCountryIso(countryOrIso);
  if (!iso) return "";
  return `/flags/${iso}.svg`;
}
