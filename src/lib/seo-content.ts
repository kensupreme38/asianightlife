/**
 * SEO Content Generator
 * Generates unique, SEO-optimized content for pages
 */

export interface SEOContent {
  title: string;
  description: string;
  keywords: string[];
  heading: string;
}

/**
 * Generate SEO content for venue pages
 */
export function generateVenueSEOContent(
  name: string,
  category: string,
  country: string,
  address: string,
  price?: string,
  description?: string
): SEOContent {
  const keywords = [
    name.toLowerCase(),
    category.toLowerCase(),
    country.toLowerCase(),
    'ktv',
    'karaoke',
    'nightlife',
    'entertainment',
    'booking',
    'venue',
    'asia night life',
  ];

  const title = `${name} – ${category} in ${country} | Asia Night Life`;
  
  const generatedDescription = description || 
    `Book ${name} - ${category} in ${country}. Located at ${address}. ${price ? `Price range: ${price}.` : ''} Discover pricing, hours, amenities, and book your entertainment venue now at Asia Night Life.`;

  return {
    title,
    description: generatedDescription,
    keywords,
    heading: `${name} - ${category}`,
  };
}

/**
 * Generate SEO content for DJ pages
 */
export function generateDJSEOContent(
  name: string,
  country?: string,
  genres?: string[],
  bio?: string
): SEOContent {
  const keywords = [
    name.toLowerCase(),
    'dj',
    'disc jockey',
    'music',
    'nightlife',
    'voting',
    'asia night life',
  ];

  if (country) keywords.push(country.toLowerCase());
  if (genres) keywords.push(...genres.map(g => g.toLowerCase()));

  const title = `${name} - DJ Profile${country ? ` in ${country}` : ''} | Asia Night Life`;
  
  const generatedDescription = bio || 
    `Discover ${name}'s DJ profile${country ? ` from ${country}` : ''}${genres && genres.length > 0 ? ` specializing in ${genres.join(', ')}` : ''}. View profile, vote, and see rankings on Asia Night Life's DJ voting platform.`;

  return {
    title,
    description: generatedDescription,
    keywords,
    heading: `${name} - DJ Profile`,
  };
}

/**
 * Generate SEO content for category pages
 */
export function generateCategorySEOContent(
  category: string,
  country?: string
): SEOContent {
  const keywords = [
    category.toLowerCase(),
    'ktv',
    'karaoke',
    'nightlife',
    'entertainment',
    country?.toLowerCase() || '',
    'asia night life',
  ].filter(Boolean);

  const location = country ? ` in ${country}` : '';
  const title = `${category} Venues${location} | Asia Night Life`;
  const description = `Discover the best ${category.toLowerCase()} venues${location}. Browse listings, compare prices, and book your entertainment venue at Asia Night Life.`;

  return {
    title,
    description,
    keywords,
    heading: `${category} Venues${location}`,
  };
}
