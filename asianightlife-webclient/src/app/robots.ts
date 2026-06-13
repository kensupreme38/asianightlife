import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const privateDisallow = [
  "/api/",
  "/auth/",
  "/employee",
  "/login",
  "/dj/profile/",
  ...routing.locales.flatMap((locale) => [
    `/${locale}/employee`,
    `/${locale}/login`,
    `/${locale}/dj/profile/`,
  ]),
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateDisallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privateDisallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
