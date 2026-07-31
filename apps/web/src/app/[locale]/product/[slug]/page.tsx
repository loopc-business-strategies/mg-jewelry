import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { api, formatUsd, formatUzs } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");

  let product: Awaited<ReturnType<typeof api.product>> | null = null;
  try {
    product = await api.product(slug, locale);
  } catch {
    notFound();
  }
  if (!product) notFound();

  const image = product.media[0]?.url;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-28 md:grid-cols-2 md:px-8">
      <div className="product-media aspect-square md:sticky md:top-28 md:self-start">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} />
        ) : null}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
          {product.collection?.name || product.category?.name}
        </p>
        <h1 className="font-display mt-3 text-5xl md:text-6xl">{product.name}</h1>
        <p className="mt-4 text-lg text-ink/80">
          {formatUsd(product.priceUsdCents, locale)}
          <span className="mx-2 text-ink/30">/</span>
          <span className="text-base text-ink/55">
            {formatUzs(product.priceUzs, locale)}
          </span>
        </p>
        <p className="mt-6 max-w-xl text-ink/70 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-8 space-y-3 border-y border-black/10 py-6 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-ink/50">{t("weight")}</span>
            <span>{product.weightGrams} g</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink/50">{t("purity")}</span>
            <span>
              {product.metal} {product.purity}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink/50">{t("making")}</span>
            <span>{product.makingChargePct}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink/50">{t("availability")}</span>
            <span>
              {t("inStock")} ({product.stock})
            </span>
          </div>
        </div>

        <div className="mt-8">
          <AddToCartButton productId={product.id} locale={locale} />
        </div>
      </div>
    </div>
  );
}
