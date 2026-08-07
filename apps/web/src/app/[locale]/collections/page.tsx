import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { api } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("collections"),
    description:
      "Browse MG Jewelry collections — gold and diamond pieces from Namangan.",
    openGraph: { title: t("collections") },
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  let collections: Awaited<ReturnType<typeof api.collections>> = [];
  try {
    collections = await api.collections(locale);
  } catch {
    collections = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("collections")}</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/${locale}/shop?collection=${collection.slug}`}
            className="group relative min-h-[280px] overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${collection.imageUrl || "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80"})`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative flex h-full min-h-[280px] flex-col justify-end p-6 text-white">
              <h2 className="font-display text-3xl">{collection.name}</h2>
              <p className="mt-2 text-sm text-white/75">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
