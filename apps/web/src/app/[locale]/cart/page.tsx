"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    hydrate();
    const tok = localStorage.getItem("mg_token");
    if (!tok) return;
    api
      .cart(locale)
      .then((data) => {
        setItems((data.items as CartItem[]) || []);
        setSubtotal((data.subtotalUsd as number) || 0);
      })
      .catch((e) => setError(e.message));
  }, [hydrate, locale, token]);

  if (!token && typeof window !== "undefined" && !localStorage.getItem("mg_token")) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
        <h1 className="font-display text-5xl">{t("title")}</h1>
        <p className="mt-6 text-ink/65">{t("empty")}</p>
        <Link href={`/${locale}/auth`} className="btn-primary mt-8">
          Sign in
        </Link>
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
              className="flex items-center justify-between gap-4 border-b border-black/10 pb-4"
            >
              <div className="flex items-center gap-4">
                <div className="product-media h-20 w-20">
                  {item.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product.image} alt={item.product.name} />
                  ) : null}
                </div>
                <div>
                  <Link href={`/${locale}/product/${item.product.slug}`} className="font-display text-xl">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-ink/55">× {item.quantity}</p>
                </div>
              </div>
              <p>{formatUsd(item.product.priceUsdCents * item.quantity, locale)}</p>
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
