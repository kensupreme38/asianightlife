/**
 * Local browse card images under /public/browse/.
 * Regenerate with: node scripts/download-browse-images.mjs
 */

export function browseImage(...parts: string[]): string {
  return `/browse/${parts.join("/")}.jpg`;
}

export interface BrowseCountry {
  id: string;
  name: string;
  countryCode: string | null;
  imageUrl: string;
}

export interface BrowseCity {
  /** Filter key passed to venue API (e.g. "Ho Chi Minh City") */
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  /** CITIES slug for venue_stats lookup */
  statsSlug?: string;
}

export interface BrowseCategory {
  id: string;
  name: string;
  imageUrl: string;
}

const countryImage = (slug: string) => browseImage("countries", slug);
const cityImage = (slug: string) => browseImage("cities", slug);
const categoryImage = (slug: string) => browseImage("categories", slug);

export const BROWSE_ALL_COUNTRIES_IMAGE = browseImage("all-countries");
export const BROWSE_ALL_CITIES_IMAGE = browseImage("cities", "all-cities");
export const BROWSE_ALL_CATEGORIES_IMAGE = browseImage("categories", "all");

export const BROWSE_COUNTRIES: BrowseCountry[] = [
  { id: "Singapore", name: "Singapore", countryCode: "sg", imageUrl: countryImage("singapore") },
  { id: "Vietnam", name: "Vietnam", countryCode: "vn", imageUrl: countryImage("vietnam") },
  { id: "Thailand", name: "Thailand", countryCode: "th", imageUrl: countryImage("thailand") },
  { id: "Malaysia", name: "Malaysia", countryCode: "my", imageUrl: countryImage("malaysia") },
  { id: "Indonesia", name: "Indonesia", countryCode: "id", imageUrl: countryImage("indonesia") },
  { id: "Cambodia", name: "Cambodia", countryCode: "kh", imageUrl: countryImage("cambodia") },
  { id: "Japan", name: "Japan", countryCode: "jp", imageUrl: countryImage("japan") },
  { id: "Macao", name: "Macao", countryCode: "mo", imageUrl: countryImage("macao") },
  { id: "Philippines", name: "Philippines", countryCode: "ph", imageUrl: countryImage("philippines") },
  { id: "South Korea", name: "South Korea", countryCode: "kr", imageUrl: countryImage("south-korea") },
  { id: "Taiwan", name: "Taiwan", countryCode: "tw", imageUrl: countryImage("taiwan") },
];

export const BROWSE_CITIES: BrowseCity[] = [
  { id: "singapore", name: "Singapore", country: "Singapore", statsSlug: "singapore-nightlife", imageUrl: cityImage("singapore") },
  { id: "Ho Chi Minh City", name: "Ho Chi Minh City", country: "Vietnam", statsSlug: "ho-chi-minh-city-nightlife", imageUrl: cityImage("ho-chi-minh-city") },
  { id: "Bangkok", name: "Bangkok", country: "Thailand", statsSlug: "bangkok-nightlife", imageUrl: cityImage("bangkok") },
  { id: "Jakarta", name: "Jakarta", country: "Indonesia", imageUrl: cityImage("jakarta") },
  { id: "Hanoi", name: "Hanoi", country: "Vietnam", statsSlug: "hanoi-nightlife", imageUrl: cityImage("hanoi") },
  { id: "Nha Trang", name: "Nha Trang", country: "Vietnam", imageUrl: cityImage("nha-trang") },
  { id: "Can Tho", name: "Can Tho", country: "Vietnam", imageUrl: cityImage("can-tho") },
  { id: "Kuala Lumpur", name: "Kuala Lumpur", country: "Malaysia", statsSlug: "kuala-lumpur-nightlife", imageUrl: cityImage("kuala-lumpur") },
  { id: "Taipei", name: "Taipei", country: "Taiwan", imageUrl: cityImage("taipei") },
  { id: "Tokyo", name: "Tokyo", country: "Japan", imageUrl: cityImage("tokyo") },
  { id: "Seoul", name: "Seoul", country: "South Korea", imageUrl: cityImage("seoul") },
  { id: "Shanghai", name: "Shanghai", country: "China", imageUrl: cityImage("shanghai") },
  { id: "Manila", name: "Manila", country: "Philippines", imageUrl: cityImage("manila") },
  { id: "Pattaya", name: "Pattaya", country: "Thailand", imageUrl: cityImage("pattaya") },
  { id: "Phnom Penh", name: "Phnom Penh", country: "Cambodia", imageUrl: cityImage("phnom-penh") },
  { id: "Danang", name: "Danang", country: "Vietnam", imageUrl: cityImage("danang") },
  { id: "Chiang Mai", name: "Chiang Mai", country: "Thailand", imageUrl: cityImage("chiang-mai") },
  { id: "Phuket", name: "Phuket", country: "Thailand", imageUrl: cityImage("phuket") },
  { id: "Penang", name: "Penang", country: "Malaysia", imageUrl: cityImage("penang") },
  { id: "Johor Bahru", name: "Johor Bahru", country: "Malaysia", statsSlug: "johor-bahru-nightlife", imageUrl: cityImage("johor-bahru") },
  { id: "Kuching", name: "Kuching", country: "Malaysia", statsSlug: "kuching-nightlife", imageUrl: cityImage("kuching") },
  { id: "Kota Kinabalu", name: "Kota Kinabalu", country: "Malaysia", statsSlug: "kota-kinabalu-nightlife", imageUrl: cityImage("kota-kinabalu") },
  { id: "Macau", name: "Macau", country: "Macao", imageUrl: cityImage("macao") },
  { id: "Hong Kong", name: "Hong Kong", country: "Hong Kong", imageUrl: browseImage("default") },
];

export interface VenueTypeGroup {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  /** Category id applied when filtering venues on the homepage */
  filterCategoryId: string;
  /** Category ids summed for venue count subtitle */
  statCategoryIds: string[];
}

export const VENUE_TYPE_GROUPS: VenueTypeGroup[] = [
  {
    id: "ktv",
    name: "KTV",
    description: "Karaoke lounges",
    imageUrl: categoryImage("ktv"),
    filterCategoryId: "KTV",
    statCategoryIds: ["KTV"],
  },
  {
    id: "clubs",
    name: "Clubs",
    description: "Dance clubs",
    imageUrl: categoryImage("nightclub"),
    filterCategoryId: "Nightclub / clubbing",
    statCategoryIds: ["Nightclub / clubbing"],
  },
  {
    id: "bars",
    name: "Bars",
    description: "Bars & pubs",
    imageUrl: categoryImage("pub"),
    filterCategoryId: "Pub",
    statCategoryIds: ["Pub", "Lounge / Speakeasy bar", "Sky Bar", "Live house / Beer club"],
  },
  {
    id: "live",
    name: "Live Houses",
    description: "Live music & beer clubs",
    imageUrl: categoryImage("live-house"),
    filterCategoryId: "Live house / Beer club",
    statCategoryIds: ["Live house / Beer club"],
  },
  {
    id: "lounge",
    name: "Lounges",
    description: "Speakeasy & sky bars",
    imageUrl: categoryImage("lounge"),
    filterCategoryId: "Lounge / Speakeasy bar",
    statCategoryIds: ["Lounge / Speakeasy bar", "Sky Bar"],
  },
  {
    id: "massage",
    name: "Massage",
    description: "Spas & massage",
    imageUrl: categoryImage("massage"),
    filterCategoryId: "Massage",
    statCategoryIds: ["Massage", "Spa / Osen"],
  },
];

export const BROWSE_CATEGORIES: BrowseCategory[] = [
  { id: "KTV", name: "KTV", imageUrl: categoryImage("ktv") },
  { id: "Nightclub / clubbing", name: "Nightclub / clubbing", imageUrl: categoryImage("nightclub") },
  { id: "Live house / Beer club", name: "Live house / Beer club", imageUrl: categoryImage("live-house") },
  { id: "Pub", name: "Pub", imageUrl: categoryImage("pub") },
  { id: "Lounge / Speakeasy bar", name: "Lounge / Speakeasy bar", imageUrl: categoryImage("lounge") },
  { id: "Sky Bar", name: "Sky Bar", imageUrl: categoryImage("sky-bar") },
  { id: "Night market", name: "Night market", imageUrl: categoryImage("night-market") },
  { id: "Spa / Osen", name: "Spa / Osen", imageUrl: categoryImage("spa") },
  { id: "Massage", name: "Massage", imageUrl: categoryImage("massage") },
  { id: "Hotel", name: "Hotel", imageUrl: categoryImage("hotel") },
  { id: "Restaurants", name: "Restaurants", imageUrl: categoryImage("restaurants") },
  { id: "Breakfast", name: "Breakfast", imageUrl: categoryImage("breakfast") },
  { id: "Supper (after 12 midnight)", name: "Supper (after 12 midnight)", imageUrl: categoryImage("supper") },
];
