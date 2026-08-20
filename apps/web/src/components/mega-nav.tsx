"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api, type ApiProduct } from "@/lib/api";

type Category = { id: string; slug: string; name: string };
type Collection = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  featured: boolean;
};

type OpenKey = "collections" | "shop" | "trending" | string | null;

export function MegaNav({
  light,
  extraLinks = [],
}: {
  light?: boolean;
  extraLinks?: Array<{ href: string; label: string }>;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const [open, setOpen] = useState<OpenKey>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.categories(locale),
      api.collections(locale),
      api.products(locale, "&pageSize=48"),
    ])
      .then(([cats, cols, catalog]) => {
        if (cancelled) return;
        setCategories(cats);
        setCollections(cols);
        setProducts(catalog.items);
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
          setCollections([]);
          setProducts([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const featured = collections.filter((c) => c.featured).slice(0, 2);
  const tabs: Array<{ key: OpenKey; label: string; href: string }> = [
    ...categories.map((c) => ({
      key: c.slug,
      label: c.name,
      href: `/${locale}/shop?category=${c.slug}`,
    })),
    { key: "collections", label: t("nav.collections"), href: `/${locale}/collections` },
    { key: "shop", label: t("nav.shop"), href: `/${locale}/shop` },
    { key: "trending", label: t("nav.trending"), href: `/${locale}/shop?sort=popular` },
  ];

  const tabClass = light ? "text-white/80 hover:text-white" : "text-ink/75 hover:text-ink";

  function panelLinks() {
    if (open === "collections") {
      return collections.map((c) => ({
        href: `/${locale}/shop?collection=${c.slug}`,
        name: c.name,
        image: c.imageUrl,
      }));
    }
    if (open === "trending") {
      return products
        .filter((p) => p.isBestSeller || p.isNewArrival)
        .slice(0, 12)
        .map((p) => ({
          href: `/${locale}/product/${p.slug}`,
          name: p.name,
          image: p.media[0]?.url ?? null,
        }));
    }
    if (open === "shop") {
      return categories.map((c) => ({
        href: `/${locale}/shop?category=${c.slug}`,
        name: c.name,
        image: products.find((p) => p.category?.slug === c.slug)?.media[0]?.url ?? null,
      }));
    }
    if (typeof open === "string") {
      return products
        .filter((p) => p.category?.slug === open)
        .slice(0, 12)
        .map((p) => ({
          href: `/${locale}/product/${p.slug}`,
          name: p.name,
          image: p.media[0]?.url ?? null,
        }));
    }
    return [];
  }

  const heading =
    open === "collections"
      ? t("nav.collections")
      : open === "trending"
        ? t("nav.trending")
        : open === "shop"
          ? t("nav.shop")
          : categories.find((c) => c.slug === open)?.name || "";

  const links = panelLinks();

  return (
    <div className="relative hidden min-w-0 flex-1 lg:block" onMouseLeave={() => setOpen(null)}>
      <div className="flex items-center justify-center gap-4 overflow-x-auto text-[13px] tracking-wide xl:gap-6">
        {tabs.map((tab) => (
          <Link
            key={String(tab.key)}
            href={tab.href}
            onMouseEnter={() => setOpen(tab.key)}
            onFocus={() => setOpen(tab.key)}
            className={`relative shrink-0 pb-0.5 whitespace-nowrap transition ${tabClass} ${
              open === tab.key ? "text-gold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gold" : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
        {extraLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hidden shrink-0 whitespace-nowrap transition xl:inline ${tabClass}`}
            onMouseEnter={() => setOpen(null)}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-screen -translate-x-1/2 border-b border-black/10 bg-[#fbf8f1] shadow-lg">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[1fr_22rem] md:px-8">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-gold">{heading}</p>
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                {links.length ? (
                  links.map((item) => (
                    <Link
                      key={item.href + item.name}
                      href={item.href}
                      className="flex items-center gap-3 text-sm text-ink/80 transition hover:text-ink"
                      onClick={() => setOpen(null)}
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt="" className="h-10 w-10 shrink-0 object-cover" />
                      ) : (
                        <span className="h-10 w-10 shrink-0 bg-paper-deep" />
                      )}
                      {item.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-ink/50">{t("shop.empty")}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {featured.map((col) => (
                <Link
                  key={col.id}
                  href={`/${locale}/shop?collection=${col.slug}`}
                  className="group relative min-h-[160px] overflow-hidden"
                  onClick={() => setOpen(null)}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${col.imageUrl || "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/35" />
                  <span className="absolute bottom-3 left-3 bg-gold-soft/95 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink">
                    {col.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
