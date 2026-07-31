"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api, formatUsd } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function AdminPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const { hydrate, user } = useAuthStore();
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    hydrate();
    const raw = localStorage.getItem("mg_user");
    const u = raw ? JSON.parse(raw) : null;
    if (!localStorage.getItem("mg_token") || !u || u.role === "CUSTOMER") {
      router.push(`/${locale}/auth`);
      return;
    }
    api.adminDashboard().then(setData).catch(() => setData(null));
  }, [hydrate, locale, router, user]);

  const recent = (data?.recentOrders as Array<Record<string, unknown>>) || [];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-ink/55">Namangan showroom operations</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [t("products"), data?.products],
          [t("orders"), data?.orders],
          [t("customers"), data?.customers],
          [t("revenue"), formatUsd(Number(data?.revenueMinor || 0), locale)],
        ].map(([label, value]) => (
          <div key={String(label)} className="border border-black/10 bg-white/40 px-5 py-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">{label}</p>
            <p className="mt-3 font-display text-3xl">{String(value ?? "—")}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-sm uppercase tracking-[0.25em] text-ink/50">
        {t("orders")}
      </h2>
      <div className="mt-4 space-y-3">
        {recent.map((order) => (
          <div key={String(order.id)} className="flex justify-between border border-black/10 px-4 py-3 text-sm">
            <span>{String(order.orderNumber)}</span>
            <span className="text-ink/55">{String(order.status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
