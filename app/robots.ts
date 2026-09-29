import type { MetadataRoute } from "next";

const siteUrl = "https://restaurant-website-mu-mauve.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",

        allow: ["/"],

        disallow: [
          "/bg/account",
          "/en/account",

          "/bg/admin",
          "/en/admin",

          "/bg/login",
          "/en/login",

          "/bg/register",
          "/en/register",

          "/bg/forgot-password",
          "/en/forgot-password",

          "/bg/reset-password",
          "/en/reset-password",

          "/auth/",
        ],
      },
    ],

    sitemap: `${siteUrl}/sitemap.xml`,

    host: siteUrl,
  };
}
