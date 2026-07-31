import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/product-card";
import { api } from "@/lib/api";
import Link from "next/link";

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

  const queryParts = [
    sp.category ? `&category=${sp.category}` : "",
    sp.collection ? `&collection=${sp.collection}` : "",
    sp.metal ? `&metal=${sp.metal}` : "",
    sp.sort ? `&sort=${sp.sort}` : "",
    sp.q ? `&q=${encodeURIComponent(sp.q)}` : "",
    "&pageSize=24",
  ].join("");

  let items: Awaited<ReturnType<typeof api.products>>["items"] = [];
  let categories: Awaited<ReturnType<typeof api.categories>> = [];
  try {
    const [products, cats] = await Promise.all([
      api.products(locale, queryParts),
      api.categories(locale),
    ]);
    items = products.items;
    categories = cats;
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("title")}</h1>

      <form
        action={`/${locale}/shop`}
        method="get"
        className="mt-8 flex max-w-xl flex-wrap gap-2"
      >
        {sp.category ? (
          <input type="hidden" name="category" value={sp.category} />
        ) : null}
        <input
          name="q"
          defaultValue={sp.q || ""}
          placeholder={t("searchPlaceholder")}
          className="min-w-[14rem] flex-1 border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
        />
        <button type="submit" className="btn-ghost px-4 py-2 text-sm">
          {t("search")}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href={`/${locale}/shop`}
          className={`border px-3 py-1.5 ${!sp.category ? "border-gold text-ink" : "border-black/15 text-ink/60"}`}
        >
          {t("all")}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/shop?category=${c.slug}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`}
            className={`border px-3 py-1.5 ${
              sp.category === c.slug
                ? "border-gold text-ink"
                : "border-black/15 text-ink/60"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-16 text-ink/60">{t("empty")}</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
