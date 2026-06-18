import { routing } from "@/i18n/routing";

const LOCALES = new Set<string>(routing.locales);
const DEFAULT_LOCALE = routing.defaultLocale;

/** Split pathname into locale + path (locale stripped). */
export function splitLocalePath(pathname: string): {
  locale: string;
  pathWithoutLocale: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && LOCALES.has(first)) {
    const rest = segments.slice(1);
    return {
      locale: first,
      pathWithoutLocale: rest.length ? `/${rest.join("/")}` : "/",
    };
  }

  return {
    locale: DEFAULT_LOCALE,
    pathWithoutLocale: pathname || "/",
  };
}

/** Login page path respecting localePrefix: as-needed (default locale has no prefix). */
export function loginPathForLocale(locale: string): string {
  if (locale === DEFAULT_LOCALE) return "/login";
  return `/${locale}/login`;
}

/** Normalize post-login redirect targets (fixes invalid /employee/login). */
export function sanitizeAuthRedirect(path: string): string {
  let normalized = path.split("?")[0] || "/";
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;

  if (normalized === "/employee/login" || normalized.startsWith("/employee/login/")) {
    return "/employee";
  }

  return normalized;
}
