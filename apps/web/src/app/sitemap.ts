import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

const locales = ["en", "uz", "ru", "tr"];
const paths = [
  "",
  "/shop",
  "/collections",
  "/ecommerce",
  "/about",
  "/contact",
  "/appointments",
  "/privacy",
  "/offer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  try {
    const { items } = await api.products("en", "&pageSize=100");
    for (const locale of locales) {
      for (const product of items) {
        entries.push({
          url: `${base}/${locale}/product/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // API unavailable during build — static routes only
  }

  return entries;
}
