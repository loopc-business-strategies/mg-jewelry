"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Calendar, Home, ShoppingBag, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { guestCart } from "@/lib/guest-cart";
import { useAuthStore } from "@/lib/auth-store";

export function MobileTabBar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { token, hydrate } = useAuthStore();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    hydrate();
    function refreshCount() {
      if (!localStorage.getItem("mg_token")) {
        setCartCount(guestCart.count());
        return;
      }
      api
        .cart(locale)
        .then((data) => {
          const items = (data.items as Array<{ quantity: number }>) || [];
          setCartCount(items.reduce((n, i) => n + (i.quantity || 0), 0));
        })
        .catch(() => setCartCount(guestCart.count()));
    }
    refreshCount();
    window.addEventListener("mg-cart-changed", refreshCount);
    return () => window.removeEventListener("mg-cart-changed", refreshCount);
  }, [locale, token, hydrate]);

  const tabs = [
    { href: `/${locale}`, label: t("home"), Icon: Home, match: (p: string) => p === `/${locale}` },
    {
      href: `/${locale}/shop`,
      label: t("shop"),
      Icon: Store,
      match: (p: string) => p.startsWith(`/${locale}/shop`) || p.startsWith(`/${locale}/product`),
    },
    {
      href: `/${locale}/appointments`,
      label: t("book"),
      Icon: Calendar,
      match: (p: string) => p.startsWith(`/${locale}/appointments`),
    },
    {
      href: `/${locale}/cart`,
      label: t("cart"),
      Icon: ShoppingBag,
      match: (p: string) => p.startsWith(`/${locale}/cart`),
      badge: cartCount,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f7f3eb]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] uppercase tracking-[0.16em] ${
                active ? "text-ink" : "text-ink/45"
              }`}
            >
              <tab.Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.5} />
              {tab.label}
              {tab.badge ? (
                <span className="absolute right-[22%] top-1 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[9px] text-white">
                  {tab.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
