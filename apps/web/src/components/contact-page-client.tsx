"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/api";

const FALLBACK_SHOWROOM = {
  fullName: "Modern Gold Jewelry Manufacturing",
  address: "242, Girvonbulok Street",
  district: "Davlatabad District",
  city: "Namangan City",
  region: "Namangan Region",
  country: "Republic of Uzbekistan",
  telegram: "@mgjewelry",
  email: "hello@mgjewelry.uz",
};

export function ContactPageClient({
  showroom: initialShowroom,
}: {
  showroom: Record<string, string>;
}) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const search = useSearchParams();
  const productSlug = search.get("product") || "";
  const showroom = useMemo(
    () => ({ ...FALLBACK_SHOWROOM, ...initialShowroom }),
    [initialShowroom],
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    try {
      await api.createInquiry({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || "") || undefined,
        message: String(fd.get("message") || ""),
        productSlug: productSlug || undefined,
      });
      setMessage(t("success"));
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("title")}</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-ink/75">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">
              {t("showroom")}
            </p>
            <p className="mt-2 text-lg">{showroom.fullName}</p>
            <div className="mt-2 space-y-0.5">
              <p>{showroom.address}</p>
              <p>{showroom.district}</p>
              <p>
                {showroom.city}, {showroom.region}
              </p>
              <p>{showroom.country}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">
              {t("telegram")}
            </p>
            <p className="mt-2">{showroom.telegram || "@mgjewelry"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">
              {t("email")}
            </p>
            <p className="mt-2">{showroom.email || "hello@mgjewelry.uz"}</p>
          </div>
          <Link
            href={`/${locale}/appointments`}
            className="btn-primary mt-4 inline-flex"
          >
            {t("bookCta")}
          </Link>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <h2 className="font-display text-3xl">{t("inquiryTitle")}</h2>
          {productSlug ? (
            <p className="text-sm text-ink/55">
              {t("aboutProduct")}: <span className="text-ink">{productSlug}</span>
            </p>
          ) : null}
          <label className="block text-sm">
            <span className="text-ink/55">{t("name")}</span>
            <input
              name="name"
              required
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("emailField")}</span>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("phone")}</span>
            <input
              name="phone"
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("message")}</span>
            <textarea
              name="message"
              required
              rows={4}
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          {message ? <p className="text-sm text-ink/60">{message}</p> : null}
          {error ? <p className="text-sm text-red-700/80">{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "…" : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
