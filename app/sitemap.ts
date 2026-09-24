import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://restaurant-website-mu-mauve.vercel.app";

  const routes = [
    "/bg",
    "/en",

    "/bg/menu",
    "/en/menu",

    "/bg/reservations",
    "/en/reservations",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,

    lastModified: new Date(),

    changeFrequency: route === "/bg" || route === "/en" ? "weekly" : "monthly",

    priority: route === "/bg" || route === "/en" ? 1 : 0.8,
  }));
}
