"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api, formatUsd } from "@/lib/api";
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
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const load = useCallback(() => {
    const tok = localStorage.getItem("mg_token");
    if (!tok) {
      setReady(true);
      return;
    }
    api
      .cart(locale)
      .then((data) => {
        setItems((data.items as CartItem[]) || []);
        setSubtotal((data.subtotalUsd as number) || 0);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setReady(true));
  }, [locale]);

  useEffect(() => {
    hydrate();
    load();
  }, [hydrate, load, token]);

  async function setQty(productId: string, quantity: number) {
    try {
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
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
        <p className="text-ink/60">…</p>
      </div>
    );
  }

  if (!token && !localStorage.getItem("mg_token")) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
        <h1 className="font-display text-5xl">{t("title")}</h1>
        <p className="mt-6 text-ink/65">{t("signInPrompt")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}/auth`} className="btn-primary">
            {t("signIn")}
          </Link>
          <Link href={`/${locale}/shop`} className="btn-ghost px-5 py-3">
            {t("continue")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">{t("title")}</h1>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {!items.length ? (
        <div className="mt-10">
          <p className="text-ink/65">{t("empty")}</p>
          <Link href={`/${locale}/shop`} className="btn-ghost mt-6">
            {t("continue")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4"
            >
              <div className="flex items-center gap-4">
                <div className="product-media h-20 w-20">
                  {item.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product.image} alt={item.product.name} />
                  ) : null}
                </div>
                <div>
                  <Link
                    href={`/${locale}/product/${item.product.slug}`}
                    className="font-display text-xl"
                  >
                    {item.product.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      className="border border-black/15 px-2 py-0.5"
                      onClick={() =>
                        setQty(item.product.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="border border-black/15 px-2 py-0.5"
                      onClick={() =>
                        setQty(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-2 text-ink/50 underline-offset-2 hover:underline"
                      onClick={() => setQty(item.product.id, 0)}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </div>
              <p>
                {formatUsd(item.product.priceUsdCents * item.quantity, locale)}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-ink/60">{t("subtotal")}</span>
            <span className="text-lg">{formatUsd(subtotal, locale)}</span>
          </div>
          <Link href={`/${locale}/checkout`} className="btn-primary">
            {t("checkout")}
          </Link>
        </div>
      )}
    </div>
  );
}
