import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://asianightlife.sg";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/employee/",
          "/dj/profile/",
          "/login",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/employee/",
          "/dj/profile/",
          "/login",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}


