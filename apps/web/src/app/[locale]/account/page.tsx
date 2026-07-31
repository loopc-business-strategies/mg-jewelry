"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function AccountPage() {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const { user, hydrate, logout } = useAuthStore();
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    hydrate();
    if (!localStorage.getItem("mg_token")) {
      router.push(`/${locale}/auth`);
      return;
    }
    api.orders().then(setOrders).catch(() => setOrders([]));
  }, [hydrate, locale, router]);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">{t("title")}</h1>
          <p className="mt-2 text-ink/60">{user?.name}</p>
        </div>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            logout();
            router.push(`/${locale}`);
          }}
        >
          {t("logout")}
        </button>
      </div>

      <h2 className="mt-12 text-sm uppercase tracking-[0.25em] text-ink/50">
        {t("orders")}
      </h2>
      <div className="mt-4 space-y-3">
        {!orders.length ? (
          <p className="text-ink/60">—</p>
        ) : (
          orders.map((order) => (
            <div key={String(order.id)} className="border border-black/10 px-4 py-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-medium">{String(order.orderNumber)}</span>
                <span className="text-ink/55">{String(order.status)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
