"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export function AddToCartButton({
  productId,
  locale,
  productSlug,
}: {
  productId: string;
  locale: string;
  productSlug?: string;
}) {
  const t = useTranslations("product");
  const router = useRouter();
  const { token, hydrate } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onAdd() {
    hydrate();
    const current = localStorage.getItem("mg_token");
    if (!current && !token) {
      router.push(`/${locale}/auth`);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await api.addToCart(productId, 1);
      setMessage("Added");
      router.push(`/${locale}/cart`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function onWish() {
    hydrate();
    if (!localStorage.getItem("mg_token")) {
      router.push(`/${locale}/auth`);
      return;
    }
    await api.wishlistToggle(productId);
    setMessage("Wishlist updated");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={onAdd} disabled={loading}>
          {loading ? "..." : t("addToCart")}
        </button>
        <button type="button" className="btn-ghost" onClick={onWish}>
          {t("wishlist")}
        </button>
        {productSlug ? (
          <a
            href={`/${locale}/contact?product=${encodeURIComponent(productSlug)}`}
            className="btn-ghost"
          >
            {t("inquire")}
          </a>
        ) : null}
      </div>
      {message ? <p className="text-sm text-ink/60">{message}</p> : null}
    </div>
  );
}
