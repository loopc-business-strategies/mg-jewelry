import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { api, formatUsd, formatUzs } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductReviews } from "@/components/product-reviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const product = await api.product(slug, locale);
    const image = product.media[0]?.url;
    return {
      title: product.name,
      description: product.description?.slice(0, 160) || product.name,
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160) || product.name,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

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
  const stockLabel =
    product.stock <= 0
      ? t("outOfStock")
      : product.stock <= 2
        ? `${t("lowStock")} (${product.stock})`
        : `${t("inStock")} (${product.stock})`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: image || undefined,
    brand: {
      "@type": "Brand",
      name: "MG Jewelry",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.priceUsdCents / 100).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <h1 className="font-display mt-3 text-5xl md:text-6xl">
            {product.name}
          </h1>
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
              <span
                className={
                  product.stock <= 2 && product.stock > 0 ? "text-gold" : ""
                }
              >
                {stockLabel}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              locale={locale}
              productSlug={product.slug}
              productName={product.name}
              priceUsdCents={product.priceUsdCents}
              image={image || null}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <ProductReviews
          productId={product.id}
          initialReviews={(product.reviews || []).map((r) => ({
            ...r,
            createdAt: String(r.createdAt),
          }))}
        />
      </div>
    </>
  );
}
