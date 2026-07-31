/**
 * Sanity CMS client stub for Phase 1.
 * Set NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_API_TOKEN to enable live content.
 * Until then, marketing copy comes from next-intl + product DB.
 */

export type SanityBanner = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaHref?: string;
};

export async function getHomeBanners(): Promise<SanityBanner[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    return [
      {
        title: "Modern Gold Jewelry",
        subtitle: "Crafted in Namangan. Worn worldwide.",
        imageUrl:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80",
        ctaHref: "/shop",
      },
    ];
  }

  // Placeholder for @sanity/client fetch — wire when project credentials exist.
  return [];
}
