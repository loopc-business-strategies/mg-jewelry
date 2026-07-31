"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { api, formatUsd, formatUzs } from "@/lib/api";

export default function OrderDetailPage() {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [ticketMsg, setTicketMsg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("mg_token")) {
      router.push(`/${locale}/auth`);
      return;
    }
    api
      .order(params.id)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [locale, params.id, router]);

  async function onTicket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.createTicket({
        type: String(fd.get("type") || "SUPPORT"),
        subject: String(fd.get("subject") || ""),
        message: String(fd.get("message") || ""),
        orderId: params.id,
      });
      setTicketMsg(t("ticketSent"));
      e.currentTarget.reset();
    } catch (err) {
      setTicketMsg(err instanceof Error ? err.message : "Error");
    }
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
        <p className="text-ink/60">…</p>
      </div>
    );
  }

  const items = (order.items as Array<Record<string, unknown>>) || [];
  const payments = (order.payments as Array<Record<string, unknown>>) || [];
  const addr = order.shippingAddress as Record<string, string> | null;
  const money =
    order.currency === "UZS"
      ? (n: number) => formatUzs(n, locale)
      : (n: number) => formatUsd(n, locale);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <Link href={`/${locale}/account`} className="text-sm text-ink/55">
          ← {t("title")}
        </Link>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => window.print()}
        >
          {t("printInvoice")}
        </button>
      </div>

      <article className="mt-8 border border-black/10 bg-white/60 px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <p className="font-display text-3xl tracking-[0.12em]">MG</p>
            <p className="mt-1 text-sm text-ink/60">
              Modern Gold Jewelry Manufacturing
            </p>
            <p className="text-xs text-ink/45">Hearts of Namangan</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium">{t("invoice")}</p>
            <p className="text-ink/60">{String(order.orderNumber)}</p>
            <p className="text-ink/55">{String(order.status)}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-sm">
          {items.map((item) => (
            <div
              key={String(item.id)}
              className="flex justify-between gap-4 border-b border-black/5 py-3"
            >
              <div>
                <p>{String(item.productName)}</p>
                <p className="text-ink/50">
                  × {String(item.quantity)} · {money(Number(item.unitPriceMinor))}
                </p>
              </div>
              <p>{money(Number(item.lineTotalMinor))}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/55">{t("subtotal")}</span>
            <span>{money(Number(order.subtotalMinor))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/55">{t("shipping")}</span>
            <span>{money(Number(order.shippingMinor || 0))}</span>
          </div>
          <div className="flex justify-between border-t border-black/10 pt-3 text-base font-medium">
            <span>{t("total")}</span>
            <span>{money(Number(order.totalMinor))}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 text-sm md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
              {t("fulfillment")}
            </p>
            <p className="mt-2">{String(order.fulfillmentType)}</p>
            {addr ? (
              <p className="mt-2 text-ink/60">
                {addr.fullName}
                <br />
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ""}
                <br />
                {addr.city}
                {addr.region ? `, ${addr.region}` : ""} {addr.postalCode || ""}
                <br />
                {addr.country}
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
              {t("payments")}
            </p>
            <div className="mt-2 space-y-1 text-ink/60">
              {payments.map((p) => (
                <p key={String(p.id)}>
                  {String(p.method)} · {String(p.status)} ·{" "}
                  {money(Number(p.amountMinor))}
                </p>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-ink/45">
          242, Girvonbulok Street · Davlatabad · Namangan City · Republic of
          Uzbekistan
        </p>
      </article>

      <form
        onSubmit={onTicket}
        className="mt-12 space-y-3 border-t border-black/10 pt-10 print:hidden"
      >
        <h2 className="font-display text-3xl">{t("requestHelp")}</h2>
        <label className="block text-sm">
          <span className="text-ink/55">{t("ticketType")}</span>
          <select
            name="type"
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
          >
            <option value="SUPPORT">{t("typeSupport")}</option>
            <option value="RETURN">{t("typeReturn")}</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-ink/55">{t("subject")}</span>
          <input
            name="subject"
            required
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/55">{t("message")}</span>
          <textarea
            name="message"
            required
            rows={3}
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
          />
        </label>
        {ticketMsg ? <p className="text-sm text-ink/65">{ticketMsg}</p> : null}
        <button type="submit" className="btn-primary">
          {t("sendTicket")}
        </button>
      </form>
    </div>
  );
}
