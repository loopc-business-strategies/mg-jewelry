"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

const CONFIRMED = new Set([
  "PAID",
  "AWAITING_PICKUP",
  "PROCESSING",
  "COMPLETED",
]);

export function SuccessClient() {
  const tCheckout = useTranslations("checkout");
  const t = useTranslations("checkoutStatus");
  const locale = useLocale();
  const sp = useSearchParams();
  const orderId = sp.get("orderId");
  const { hydrate } = useAuthStore();
  const [state, setState] = useState<
    "loading" | "needAuth" | "confirmed" | "pending" | "missing"
  >("loading");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    hydrate();
    if (!orderId) {
      setState("missing");
      return;
    }
    if (!localStorage.getItem("mg_token")) {
      setState("needAuth");
      return;
    }
    api
      .order(orderId)
      .then((order) => {
        setOrderNumber(String(order.orderNumber || ""));
        const status = String(order.status || "");
        setState(CONFIRMED.has(status) ? "confirmed" : "pending");
      })
      .catch(() => setState("pending"));
  }, [hydrate, orderId]);

  if (state === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 md:px-8">
        <p className="text-ink/60">…</p>
      </div>
    );
  }

  if (state === "needAuth") {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 md:px-8">
        <h1 className="font-display text-5xl">{t("pending")}</h1>
        <p className="mt-4 text-ink/65">{t("signInToView")}</p>
        <Link href={`/${locale}/auth`} className="btn-primary mt-8">
          {t("viewOrder")}
        </Link>
      </div>
    );
  }

  if (state === "confirmed") {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 md:px-8">
        <h1 className="font-display text-5xl">{t("confirmed")}</h1>
        <p className="mt-4 text-ink/60">{tCheckout("success")}</p>
        {orderNumber ? (
          <p className="mt-2 text-sm text-ink/50">{orderNumber}</p>
        ) : null}
        <Link href={`/${locale}/account`} className="btn-primary mt-8">
          {t("viewOrder")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 md:px-8">
      <h1 className="font-display text-5xl">{t("pending")}</h1>
      <p className="mt-4 text-ink/65">{t("pendingBody")}</p>
      {orderId ? (
        <p className="mt-2 text-sm text-ink/50">Order ID: {orderId}</p>
      ) : null}
      <Link href={`/${locale}/account`} className="btn-primary mt-8">
        {t("viewOrder")}
      </Link>
    </div>
  );
}
