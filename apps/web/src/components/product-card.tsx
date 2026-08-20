"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ApiProduct } from "@/lib/api";
import { api, formatUsd } from "@/lib/api";
import { guestCart } from "@/lib/guest-cart";
import { useAuthStore } from "@/lib/auth-store";

export function ProductCard({
  product,
  locale,
}: {
  product: ApiProduct;
  locale: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { token, hydrate } = useAuthStore();
  const [busy, setBusy] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const images = product.media.map((m) => m.url).filter(Boolean);
  const image = images[mediaIndex] || images[0];
  const hoverImage = images.length > 1 ? images[(mediaIndex + 1) % images.length] : undefined;

  async function onQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    hydrate();
    setBusy(true);
    try {
      if (!localStorage.getItem("mg_token") && !token) {
        guestCart.add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceUsdCents: product.priceUsdCents,
          image: image ?? null,
        });
        return;
      }
      await api.addToCart(product.id, 1);
      window.dispatchEvent(new Event("mg-cart-changed"));
    } catch {
      /* keep overlay usable */
    } finally {
      setBusy(false);
    }
  }

  async function onWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    hydrate();
    if (!localStorage.getItem("mg_token")) {
      router.push(`/${locale}/auth`);
      return;
    }
    await api.wishlistToggle(product.id);
  }

  return (
    <Link href={`/${locale}/product/${product.slug}`} className="group block">
      <div className="product-media relative aspect-[4/5]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="product-media-primary"
            src={image}
            alt={product.media[mediaIndex]?.alt || product.name}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40">MG</div>
        )}
        {hoverImage && mediaIndex === 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="product-media-alt" src={hoverImage} alt="" />
        ) : null}

        {product.isNewArrival || product.isBestSeller ? (
          <span className="absolute left-3 top-3 z-10 bg-ink/85 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-soft">
            {product.isNewArrival ? t("home.badgeNew") : t("home.badgeBestseller")}
          </span>
        ) : null}

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition duration-300 group-hover:opacity-100 max-lg:opacity-100">
          <button
            type="button"
            onClick={onWish}
            aria-label={t("product.wishlist")}
            className="flex h-9 w-9 items-center justify-center bg-white/90 text-ink shadow-sm transition hover:bg-gold hover:text-ink"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onQuickAdd}
            disabled={busy}
            aria-label={t("product.addToCart")}
            className="flex h-9 w-9 items-center justify-center bg-white/90 text-ink shadow-sm transition hover:bg-gold hover:text-ink"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        {images.length > 1 ? (
          <div className="absolute bottom-3 left-3 z-10 flex gap-1 opacity-0 transition group-hover:opacity-100 max-lg:opacity-100">
            <button
              type="button"
              aria-label="Previous image"
              className="flex h-7 w-7 items-center justify-center bg-white/90 text-ink"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMediaIndex((i) => (i - 1 + images.length) % images.length);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="flex h-7 w-7 items-center justify-center bg-white/90 text-ink"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMediaIndex((i) => (i + 1) % images.length);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
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
