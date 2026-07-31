"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const [fulfillmentType, setFulfillmentType] = useState("SHOWROOM_PICKUP");
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [currency, setCurrency] = useState<"USD" | "UZS">("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function placeOrder() {
    setLoading(true);
    setError("");
    try {
      const order = await api.checkout({
        fulfillmentType,
        paymentMethod,
        currency,
      });

      if (paymentMethod === "SHOWROOM") {
        router.push(`/${locale}/checkout/success?orderId=${order.id}`);
        return;
      }

      const method =
        paymentMethod === "STRIPE"
          ? "stripe"
          : paymentMethod === "PAYME"
            ? "payme"
            : "click";

      const pay = await api.pay(method, order.id);
      if ("url" in pay && pay.url) {
        if (pay.mode === "mock" || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          await api.pay("mock", order.id);
          router.push(`/${locale}/checkout/success?orderId=${order.id}&mock=1`);
          return;
        }
        window.location.href = pay.url;
        return;
      }
      router.push(`/${locale}/checkout/success?orderId=${order.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">{t("title")}</h1>

      <div className="mt-10 space-y-8">
        <fieldset>
          <legend className="mb-3 text-sm uppercase tracking-[0.2em] text-ink/50">
            {t("fulfillment")}
          </legend>
          <div className="space-y-2">
            {[
              ["SHOWROOM_PICKUP", t("pickup")],
              ["LOCAL_DELIVERY", t("local")],
              ["INTERNATIONAL_QUOTE", t("intl")],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 border border-black/10 px-4 py-3">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillmentType === value}
                  onChange={() => setFulfillmentType(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm uppercase tracking-[0.2em] text-ink/50">
            Currency
          </legend>
          <div className="flex gap-3">
            {(["USD", "UZS"] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={`border px-4 py-2 ${currency === c ? "border-gold" : "border-black/15"}`}
                onClick={() => {
                  setCurrency(c);
                  if (c === "UZS" && paymentMethod === "STRIPE") setPaymentMethod("PAYME");
                  if (c === "USD" && (paymentMethod === "PAYME" || paymentMethod === "CLICK")) {
                    setPaymentMethod("STRIPE");
                  }
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm uppercase tracking-[0.2em] text-ink/50">
            {t("payment")}
          </legend>
          <div className="space-y-2">
            {(currency === "USD"
              ? [
                  ["STRIPE", t("stripe")],
                  ["SHOWROOM", t("showroom")],
                ]
              : [
                  ["PAYME", t("payme")],
                  ["CLICK", t("click")],
                  ["SHOWROOM", t("showroom")],
                ]
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 border border-black/10 px-4 py-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button type="button" className="btn-primary" onClick={placeOrder} disabled={loading}>
          {loading ? "..." : t("place")}
        </button>
      </div>
    </div>
  );
}
