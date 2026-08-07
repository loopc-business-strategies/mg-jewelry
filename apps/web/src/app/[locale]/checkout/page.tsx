"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const ta = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const [fulfillmentType, setFulfillmentType] = useState("SHOWROOM_PICKUP");
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [currency, setCurrency] = useState<"USD" | "UZS">("USD");
  const [addresses, setAddresses] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [shippingAddressId, setShippingAddressId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponNote, setCouponNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState<
    Array<{
      quantity: number;
      product: { name: string; priceUsdCents: number; priceUzs: number };
    }>
  >([]);
  const [subtotalUsd, setSubtotalUsd] = useState(0);
  const [subtotalUzs, setSubtotalUzs] = useState(0);

  const needsAddress =
    fulfillmentType === "LOCAL_DELIVERY" ||
    fulfillmentType === "INTERNATIONAL_QUOTE";

  useEffect(() => {
    if (!localStorage.getItem("mg_token")) return;
    api
      .addresses()
      .then((list) => {
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setShippingAddressId(String(def.id));
      })
      .catch(() => setAddresses([]));
    api
      .cart(locale)
      .then((data) => {
        setCartItems(
          (data.items as Array<{
            quantity: number;
            product: {
              name: string;
              priceUsdCents: number;
              priceUzs: number;
            };
          }>) || [],
        );
        setSubtotalUsd(Number(data.subtotalUsd || 0));
        setSubtotalUzs(Number(data.subtotalUzs || 0));
      })
      .catch(() => {
        setCartItems([]);
      });
  }, [locale]);

  async function placeOrder() {
    setLoading(true);
    setError("");
    try {
      if (needsAddress && !shippingAddressId) {
        setError(t("addressRequired"));
        setLoading(false);
        return;
      }

      const order = await api.checkout({
        fulfillmentType,
        paymentMethod,
        currency,
        ...(needsAddress ? { shippingAddressId } : {}),
        ...(couponCode.trim() ? { couponCode: couponCode.trim() } : {}),
      });

      if (fulfillmentType === "INTERNATIONAL_QUOTE") {
        router.push(
          `/${locale}/account/orders/${order.id}?quote=1`,
        );
        return;
      }

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

      const pay = await api.pay(method, order.id, locale);
      if (pay.mode === "mock") {
        try {
          await api.pay("mock", order.id, locale);
          router.push(
            `/${locale}/checkout/success?orderId=${order.id}&mock=1`,
          );
        } catch {
          setError(
            "Demo/mock payments are disabled. Configure Stripe, Payme, or Click.",
          );
        }
        return;
      }
      if (pay.url) {
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
        {cartItems.length ? (
          <div className="border border-black/10 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
              {t("summary")}
            </p>
            <ul className="mt-3 space-y-2">
              {cartItems.map((item, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-ink/60">
                    {currency === "UZS"
                      ? item.product.priceUzs * item.quantity
                      : (item.product.priceUsdCents * item.quantity) / 100}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-black/10 pt-3 font-medium">
              <span>{t("subtotal")}</span>
              <span>
                {currency === "UZS" ? subtotalUzs : subtotalUsd / 100}{" "}
                {currency}
              </span>
            </p>
          </div>
        ) : null}

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
              <label
                key={value}
                className="flex items-center gap-3 border border-black/10 px-4 py-3"
              >
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

        {needsAddress ? (
          <fieldset>
            <legend className="mb-3 text-sm uppercase tracking-[0.2em] text-ink/50">
              {t("shippingAddress")}
            </legend>
            {!addresses.length ? (
              <p className="text-sm text-ink/60">
                {t("noAddresses")}{" "}
                <Link
                  href={`/${locale}/account`}
                  className="underline underline-offset-2"
                >
                  {ta("addresses")}
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label
                    key={String(a.id)}
                    className="flex items-start gap-3 border border-black/10 px-4 py-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={shippingAddressId === String(a.id)}
                      onChange={() => setShippingAddressId(String(a.id))}
                    />
                    <span>
                      <span className="font-medium">{String(a.label)}</span>
                      <br />
                      {String(a.fullName)} · {String(a.phone)}
                      <br />
                      {String(a.line1)}
                      {a.line2 ? `, ${String(a.line2)}` : ""}
                      <br />
                      {String(a.city)}
                      {a.region ? `, ${String(a.region)}` : ""} ·{" "}
                      {String(a.country)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        ) : null}

        <fieldset>
          <legend className="mb-3 text-sm uppercase tracking-[0.2em] text-ink/50">
            {t("coupon")}
          </legend>
          <div className="flex flex-wrap gap-2">
            <input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponNote("");
              }}
              placeholder="WELCOME10"
              className="min-w-[12rem] flex-1 border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
            <button
              type="button"
              className="btn-ghost px-4 py-2 text-sm"
              onClick={async () => {
                setError("");
                setCouponNote("");
                try {
                  const cart = await api.cart(locale);
                  const subtotal =
                    currency === "UZS"
                      ? Number(cart.subtotalUzs || 0)
                      : Number(cart.subtotalUsd || 0);
                  const applied = await api.validateCoupon(
                    couponCode,
                    currency,
                    subtotal,
                  );
                  setCouponNote(
                    `${t("couponApplied")}: −${applied.discountMinor}`,
                  );
                } catch {
                  setError(t("couponInvalid"));
                }
              }}
            >
              {t("couponApply")}
            </button>
          </div>
          {couponNote ? (
            <p className="mt-2 text-sm text-ink/60">{couponNote}</p>
          ) : null}
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm uppercase tracking-[0.2em] text-ink/50">
            {t("currency")}
          </legend>
          <div className="flex gap-3">
            {(["USD", "UZS"] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={`border px-4 py-2 ${currency === c ? "border-gold" : "border-black/15"}`}
                onClick={() => {
                  setCurrency(c);
                  if (c === "UZS" && paymentMethod === "STRIPE")
                    setPaymentMethod("PAYME");
                  if (
                    c === "USD" &&
                    (paymentMethod === "PAYME" || paymentMethod === "CLICK")
                  ) {
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
              <label
                key={value}
                className="flex items-center gap-3 border border-black/10 px-4 py-3"
              >
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

        <button
          type="button"
          className="btn-primary"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? "..." : t("place")}
        </button>
      </div>
    </div>
  );
}
