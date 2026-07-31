"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { api } from "@/lib/api";

export function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    body: string;
    user: { name: string };
    createdAt: string;
  }>;
}) {
  const t = useTranslations("product");
  const locale = useLocale();
  const [reviews, setReviews] = useState(initialReviews);
  const [msg, setMsg] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(!!localStorage.getItem("mg_token"));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const review = await api.submitReview(productId, {
        rating: Number(fd.get("rating") || 5),
        title: String(fd.get("title") || "") || undefined,
        body: String(fd.get("body") || ""),
      });
      setReviews((prev) => [
        {
          id: String(review.id),
          rating: Number(review.rating),
          title: (review.title as string | null) || null,
          body: String(review.body),
          user: { name: String((review.user as { name?: string })?.name || "") },
          createdAt: String(review.createdAt || new Date().toISOString()),
        },
        ...prev,
      ]);
      setMsg(t("reviewThanks"));
      e.currentTarget.reset();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <section className="mt-16 border-t border-black/10 pt-12">
      <h2 className="font-display text-3xl">{t("reviews")}</h2>
      <div className="mt-6 space-y-4">
        {!reviews.length ? (
          <p className="text-sm text-ink/55">{t("noReviews")}</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border border-black/10 px-4 py-3 text-sm">
              <p className="font-medium">
                {r.user.name} · {"★".repeat(r.rating)}
                {"☆".repeat(Math.max(0, 5 - r.rating))}
              </p>
              {r.title ? <p className="mt-1">{r.title}</p> : null}
              <p className="mt-1 text-ink/65">{r.body}</p>
            </div>
          ))
        )}
      </div>

      {signedIn ? (
        <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-3">
          <h3 className="text-sm uppercase tracking-[0.2em] text-ink/50">
            {t("writeReview")}
          </h3>
          <label className="block text-sm">
            <span className="text-ink/55">{t("rating")}</span>
            <select
              name="rating"
              defaultValue="5"
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("reviewTitle")}</span>
            <input
              name="title"
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("reviewBody")}</span>
            <textarea
              name="body"
              required
              rows={3}
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          {msg ? <p className="text-sm text-ink/60">{msg}</p> : null}
          <button type="submit" className="btn-primary">
            {t("submitReview")}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-ink/55">
          <Link href={`/${locale}/auth`} className="underline underline-offset-2">
            {t("signInToReview")}
          </Link>
        </p>
      )}
    </section>
  );
}
