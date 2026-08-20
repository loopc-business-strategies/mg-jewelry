import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/product-card";
import { ShopChips, ShopFilters, SortSelect, type ShopQuery } from "@/components/shop-filters";
import { api, type ApiProduct } from "@/lib/api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: t("title"),
    description: "Shop luxury gold and diamond jewelry from MG Jewelry, Namangan.",
    openGraph: { title: t("title") },
  };
}

function inPrice(p: ApiProduct, min?: string, max?: string) {
  const usd = p.priceUsdCents / 100;
  if (min && usd < Number(min)) return false;
  if (max && usd > Number(max)) return false;
  return true;
}

function inWeight(p: ApiProduct, min?: string, max?: string) {
  if (min && p.weightGrams < Number(min)) return false;
  if (max && p.weightGrams > Number(max)) return false;
  return true;
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const query: ShopQuery = {
    category: sp.category,
    collection: sp.collection,
    metal: sp.metal,
    minPriceUsd: sp.minPriceUsd,
    maxPriceUsd: sp.maxPriceUsd,
    minWeight: sp.minWeight,
    maxWeight: sp.maxWeight,
    sort: sp.sort,
    q: sp.q,
  };

  const queryParts = [
    query.category ? `&category=${query.category}` : "",
    query.collection ? `&collection=${query.collection}` : "",
    query.metal ? `&metal=${query.metal}` : "",
    query.minPriceUsd ? `&minPriceUsd=${query.minPriceUsd}` : "",
    query.maxPriceUsd ? `&maxPriceUsd=${query.maxPriceUsd}` : "",
    query.minWeight ? `&minWeight=${query.minWeight}` : "",
    query.maxWeight ? `&maxWeight=${query.maxWeight}` : "",
    query.sort ? `&sort=${query.sort}` : "&sort=popular",
    query.q ? `&q=${encodeURIComponent(query.q)}` : "",
    "&pageSize=24",
  ].join("");

  let items: ApiProduct[] = [];
  let catalog: ApiProduct[] = [];
  let categories: Awaited<ReturnType<typeof api.categories>> = [];
  let collections: Awaited<ReturnType<typeof api.collections>> = [];
  try {
    const [products, cats, cols, all] = await Promise.all([
      api.products(locale, queryParts),
      api.categories(locale),
      api.collections(locale),
      api.products(locale, "&pageSize=48"),
    ]);
    items = products.items;
    catalog = all.items;
    categories = cats;
    collections = cols;
  } catch {
    items = [];
  }

  const categoryFacets = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: catalog.filter((p) => p.category?.slug === c.slug).length,
  }));
  const collectionFacets = collections.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: catalog.filter((p) => p.collection?.slug === c.slug).length,
  }));
  const metalCounts: Record<string, number> = {
    Gold: catalog.filter((p) => p.metal.toLowerCase() === "gold").length,
    Platinum: catalog.filter((p) => p.metal.toLowerCase() === "platinum").length,
    Silver: catalog.filter((p) => p.metal.toLowerCase() === "silver").length,
  };
  const priceCounts: Record<string, number> = {
    under: catalog.filter((p) => inPrice(p, undefined, "500")).length,
    mid: catalog.filter((p) => inPrice(p, "500", "1500")).length,
    high: catalog.filter((p) => inPrice(p, "1500", "3000")).length,
    top: catalog.filter((p) => inPrice(p, "3000")).length,
  };
  const weightCounts: Record<string, number> = {
    "0-2": catalog.filter((p) => inWeight(p, "0", "2")).length,
    "2-5": catalog.filter((p) => inWeight(p, "2", "5")).length,
    "5-10": catalog.filter((p) => inWeight(p, "5", "10")).length,
    "10-20": catalog.filter((p) => inWeight(p, "10", "20")).length,
    "20+": catalog.filter((p) => inWeight(p, "20")).length,
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-40 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("title")}</h1>

      <form action={`/${locale}/shop`} method="get" className="mt-8 max-w-xl">
        {query.category ? <input type="hidden" name="category" value={query.category} /> : null}
        {query.collection ? <input type="hidden" name="collection" value={query.collection} /> : null}
        {query.metal ? <input type="hidden" name="metal" value={query.metal} /> : null}
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={query.q || ""}
            placeholder={t("searchPlaceholder")}
            className="min-w-0 flex-1 border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
          />
          <button type="submit" className="btn-ghost px-4 py-2 text-sm">
            {t("search")}
          </button>
        </div>
      </form>

      <div className="mt-10 lg:flex lg:items-start lg:gap-10">
        <ShopFilters
          locale={locale}
          query={query}
          categories={categoryFacets}
          collections={collectionFacets}
          metalCounts={metalCounts}
          priceCounts={priceCounts}
          weightCounts={weightCounts}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-4 hidden justify-end lg:flex">
            <SortSelect locale={locale} query={query} />
          </div>
          <ShopChips
            locale={locale}
            query={query}
            categories={categoryFacets}
            collections={collectionFacets}
          />
          {items.length === 0 ? (
            <p className="mt-16 text-ink/60">{t("empty")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
