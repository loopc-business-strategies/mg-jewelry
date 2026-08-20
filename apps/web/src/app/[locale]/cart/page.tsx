"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api, formatUsd } from "@/lib/api";
import { guestCart, type GuestCartItem } from "@/lib/guest-cart";
import { useAuthStore } from "@/lib/auth-store";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    priceUsdCents: number;
    image: string | null;
  };
};

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { hydrate, token } = useAuthStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const load = useCallback(() => {
    hydrate();
    const tok = localStorage.getItem("mg_token");
    if (!tok) {
      const g = guestCart.get();
      setIsGuest(true);
      setGuestItems(g);
      setItems([]);
      setSubtotal(g.reduce((s, i) => s + i.priceUsdCents * i.quantity, 0));
      setReady(true);
      return;
    }
    setIsGuest(false);
    api
      .cart(locale)
      .then((data) => {
        setItems((data.items as CartItem[]) || []);
        setSubtotal((data.subtotalUsd as number) || 0);
        setGuestItems([]);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setReady(true));
  }, [hydrate, locale]);

  useEffect(() => {
    load();
  }, [load, token]);

  async function setQty(productId: string, quantity: number) {
    try {
      if (isGuest || !localStorage.getItem("mg_token")) {
        const g = guestCart.update(productId, quantity);
        setGuestItems(g);
        setSubtotal(g.reduce((s, i) => s + i.priceUsdCents * i.quantity, 0));
        return;
      }
      const data = await api.cartUpdate(productId, quantity);
      setItems((data.items as CartItem[]) || []);
      setSubtotal((data.subtotalUsd as number) || 0);
      window.dispatchEvent(new Event("mg-cart-changed"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-8 md:px-8">
        <p className="text-ink/60">…</p>
      </div>
    );
  }

  const rows: Array<{
    key: string;
    productId: string;
    slug: string;
    name: string;
    image: string | null;
    quantity: number;
    priceUsdCents: number;
  }> = isGuest
    ? guestItems.map((g) => ({
        key: g.productId,
        productId: g.productId,
        slug: g.slug,
        name: g.name,
        image: g.image,
        quantity: g.quantity,
        priceUsdCents: g.priceUsdCents,
      }))
    : items.map((i) => ({
        key: i.id,
        productId: i.product.id,
        slug: i.product.slug,
        name: i.product.name,
        image: i.product.image,
        quantity: i.quantity,
        priceUsdCents: i.product.priceUsdCents,
      }));

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-8 md:px-8">
      <h1 className="font-display text-5xl">{t("title")}</h1>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {!rows.length ? (
        <div className="mt-10">
          <p className="text-ink/65">{t("empty")}</p>
          <Link href={`/${locale}/shop`} className="btn-ghost mt-6">
            {t("continue")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {rows.map((item) => (
            <div
              key={item.key}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4"
            >
              <div className="flex items-center gap-4">
                <div className="product-media h-20 w-20">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} />
                  ) : null}
                </div>
                <div>
                  <Link
                    href={`/${locale}/product/${item.slug}`}
                    className="font-display text-xl"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      className="border border-black/15 px-2 py-0.5"
                      onClick={() => setQty(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="border border-black/15 px-2 py-0.5"
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-2 text-ink/50 underline-offset-2 hover:underline"
                      onClick={() => setQty(item.productId, 0)}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </div>
              <p>{formatUsd(item.priceUsdCents * item.quantity, locale)}</p>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-ink/60">{t("subtotal")}</span>
            <span className="text-lg">{formatUsd(subtotal, locale)}</span>
          </div>
          {isGuest ? (
            <div className="space-y-3">
              <p className="text-sm text-ink/60">{t("signInToCheckout")}</p>
              <Link href={`/${locale}/auth`} className="btn-primary">
                {t("signIn")}
              </Link>
            </div>
          ) : (
            <Link href={`/${locale}/checkout`} className="btn-primary">
              {t("checkout")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
