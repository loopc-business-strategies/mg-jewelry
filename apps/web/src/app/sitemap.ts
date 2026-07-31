import type { MetadataRoute } from "next";

const locales = ["en", "uz", "ru", "tr"];
const paths = [
  "",
  "/shop",
  "/collections",
  "/about",
  "/contact",
  "/appointments",
  "/privacy",
  "/offer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }
  return entries;
}
