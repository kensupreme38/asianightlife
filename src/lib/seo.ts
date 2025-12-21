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
 * Generate hreflang alternates for all locales
 */
export function generateHreflangAlternates(path: string = ""): Metadata["alternates"] {
  const alternates: Metadata["alternates"] = {
    canonical: `${baseUrl}${path}`,
    languages: {},
  };

  // Generate hreflang for each locale
  routing.locales.forEach((locale) => {
    const localePath = path.startsWith(`/${locale}`) 
      ? path 
      : `/${locale}${path}`;
    
    alternates.languages![localeToLanguage[locale] || locale] = `${baseUrl}${localePath}`;
  });

  // Add x-default pointing to English
  alternates.languages!["x-default"] = `${baseUrl}/en${path.replace(/^\/en/, "")}`;

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
  const fullPath = path.startsWith(`/${locale}`) ? path : `/${locale}${path}`;
  const canonicalPath = path.startsWith(`/${locale}`) 
    ? path 
    : `/${locale}${path}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    alternates: generateHreflangAlternates(canonicalPath),
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      url: fullPath,
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

