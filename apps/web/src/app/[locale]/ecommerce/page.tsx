"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/api";

export default function EcommercePage() {
  const t = useTranslations("ecommerce");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const paths = [
    { title: t("wholesaleTitle"), body: t("wholesaleBody") },
    { title: t("showroomTitle"), body: t("showroomBody") },
    { title: t("exportTitle"), body: t("exportBody") },
  ] as const;

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
        company: String(fd.get("company") || "") || undefined,
        volume: String(fd.get("volume") || "") || undefined,
        country: String(fd.get("country") || "") || undefined,
        kind: "wholesale",
        message: String(fd.get("message") || ""),
      });
      setMessage(t("inquirySuccess"));
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("inquiryError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-28 md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ink/45">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-display text-5xl md:text-6xl">{t("title")}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75">
        {t("intro")}
      </p>

      <div
        className="mt-12 min-h-[320px] bg-cover bg-center md:min-h-[420px]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1800&q=80)",
        }}
      />

      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {paths.map((item) => (
          <div key={item.title}>
            <h2 className="font-display text-2xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-16 max-w-xl space-y-4 border border-black/10 px-5 py-8"
      >
        <h2 className="font-display text-3xl">{t("inquiryTitle")}</h2>
        {(
          [
            ["name", t("name"), true],
            ["company", t("company"), true],
            ["email", t("email"), true],
            ["phone", t("phone"), false],
            ["country", t("country"), false],
            ["volume", t("volume"), false],
          ] as const
        ).map(([name, label, required]) => (
          <label key={name} className="block text-sm">
            <span className="text-ink/55">{label}</span>
            <input
              name={name}
              type={name === "email" ? "email" : "text"}
              required={required}
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="text-ink/55">{t("message")}</span>
          <textarea
            name="message"
            required
            rows={4}
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-ink/65">{message}</p> : null}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "…" : t("ctaInquire")}
        </button>
      </form>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href={`/${locale}/appointments`} className="btn-ghost px-6 py-3">
          {t("ctaBook")}
        </Link>
        <Link href={`/${locale}/shop`} className="btn-ghost px-6 py-3">
          {t("ctaShop")}
        </Link>
      </div>
    </div>
  );
}
