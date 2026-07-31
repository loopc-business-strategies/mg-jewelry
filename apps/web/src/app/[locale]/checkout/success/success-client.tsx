"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export function SuccessClient() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const sp = useSearchParams();
  const orderId = sp.get("orderId");

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">{t("success")}</h1>
      {orderId ? (
        <p className="mt-4 text-ink/60">Order ID: {orderId}</p>
      ) : null}
      <Link href={`/${locale}/account`} className="btn-primary mt-8">
        Account
      </Link>
    </div>
  );
}
