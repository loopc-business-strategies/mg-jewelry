import Link from "next/link";
import type { ApiProduct } from "@/lib/api";
import { formatUsd } from "@/lib/api";

export function ProductCard({
  product,
  locale,
}: {
  product: ApiProduct;
  locale: string;
}) {
  const image = product.media[0]?.url;

  return (
    <Link href={`/${locale}/product/${product.slug}`} className="group block">
      <div className="product-media aspect-[4/5]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.media[0]?.alt || product.name} />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40">
            MG
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl tracking-wide text-ink group-hover:text-ink/80">
            {product.name}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink/45">
            {product.metal}
            {product.purity ? ` / ${product.purity}` : ""}
          </p>
        </div>
        <p className="text-sm text-ink/80">{formatUsd(product.priceUsdCents, locale)}</p>
      </div>
    </Link>
  );
}
