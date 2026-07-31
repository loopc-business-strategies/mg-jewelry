"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const locales = [
  { code: "en", label: "EN" },
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "tr", label: "TR" },
];

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, hydrate } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    hydrate();
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hydrate]);

  const links = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/collections`, label: t("nav.collections") },
    { href: `/${locale}/shop`, label: t("nav.shop") },
    { href: `/${locale}/appointments`, label: t("nav.book") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/10 bg-[#f7f3eb]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href={`/${locale}`} className="group">
          <div className="font-display text-2xl tracking-[0.18em] text-ink md:text-3xl">
            MG
          </div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-ink/60 group-hover:text-gold">
            {t("brand")}
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm tracking-wide md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/75 transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 text-xs tracking-wider sm:flex">
            {locales.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                className={`px-1.5 py-1 ${
                  locale === l.code ? "text-gold" : "text-ink/50 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link href={`/${locale}/cart`} aria-label={t("nav.cart")}>
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Link
            href={user ? `/${locale}/account` : `/${locale}/auth`}
            aria-label={t("nav.account")}
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-[#f7f3eb] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2 text-xs tracking-wider">
              {locales.map((l) => (
                <Link key={l.code} href={`/${l.code}`} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
