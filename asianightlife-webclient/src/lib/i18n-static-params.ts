import { routing } from "@/i18n/routing";

/** Build-time params for `[locale]/…/[slug]` routes (must include every dynamic segment). */
export function staticParamsForSlugs(slugs: string[]) {
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export function staticParamsForLocales() {
  return routing.locales.map((locale) => ({ locale }));
}
