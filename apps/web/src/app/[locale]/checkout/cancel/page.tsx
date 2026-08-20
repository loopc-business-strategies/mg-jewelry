"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function CheckoutCancelPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 md:px-8">
      <h1 className="font-display text-5xl">{t("cancel")}</h1>
      <Link href={`/${locale}/cart`} className="btn-ghost mt-8">
        Cart
      </Link>
    </div>
  );
}
