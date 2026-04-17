import { Metadata } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = "https://asianightlife.sg";

// Map locale codes to language codes for hreflang
const localeToLanguage: Record<string, string> = {
  en: "en",
  vi: "vi",
  zh: "zh",
  id: "id",
  ja: "ja",
  ko: "ko",
  ru: "ru",
  th: "th",
};

/**
 * Strip locale prefix from a path
 */
function stripLocalePrefix(path: string, locale: string): string {
  return path.startsWith(`/${locale}`) ? path.slice(`/${locale}`.length) || "/" : path;
}

/**
 * Generate hreflang alternates for all locales
 * Respects localePrefix: 'as-needed' — default locale (en) has no prefix
 */
export function generateHreflangAlternates(path: string = ""): Metadata["alternates"] {
  const defaultLocale = routing.defaultLocale;

  // Normalize path: strip any locale prefix to get the bare path
  let barePath = path;
  for (const locale of routing.locales) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      barePath = stripLocalePrefix(path, locale);
      break;
    }
  }

  // Canonical is the default locale URL (no prefix for 'as-needed')
  const canonicalPath = barePath === "/" ? "" : barePath;
  const alternates: Metadata["alternates"] = {
    canonical: `${baseUrl}${canonicalPath}`,
    languages: {},
  };

  // Generate hreflang for each locale
  routing.locales.forEach((locale) => {
    // Default locale uses no prefix (as-needed)
    const localePath = locale === defaultLocale
      ? canonicalPath
      : `/${locale}${canonicalPath}`;

    alternates.languages![localeToLanguage[locale] || locale] = `${baseUrl}${localePath}`;
  });

  // x-default points to the default locale URL (no prefix)
  alternates.languages!["x-default"] = `${baseUrl}${canonicalPath}`;

  return alternates;
}

/**
 * Generate metadata with hreflang for a specific page
 */
export function generatePageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  openGraph,
  twitter,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
    type?: "website" | "article";
  };
  twitter?: {
    card?: "summary" | "summary_large_image";
    title?: string;
    description?: string;
    images?: string[];
  };
}): Metadata {
  const defaultLocale = routing.defaultLocale;
  // Bare path without locale prefix
  const barePath = path.startsWith(`/${locale}`) ? path.slice(`/${locale}`.length) || "/" : path;
  // URL for this locale (default locale has no prefix)
  const localePath = locale === defaultLocale ? barePath : `/${locale}${barePath}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    alternates: generateHreflangAlternates(localePath),
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      url: localePath,
      siteName: "Asia Night Life",
      locale: localeToLanguage[locale] || locale,
      type: openGraph?.type || "website",
      images: openGraph?.images || [],
    },
    twitter: {
      card: twitter?.card || "summary_large_image",
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: twitter?.images || [],
    },
  };
}

/**
 * Get all locale paths for a given path
 */
export function getAllLocalePaths(path: string): string[] {
  return routing.locales.map((locale) => {
    if (path.startsWith(`/${locale}`)) {
      return path;
    }
    return `/${locale}${path}`;
  });
}

