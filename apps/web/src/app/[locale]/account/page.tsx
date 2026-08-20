"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api, formatUsd, formatUzs } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

type Tab =
  | "orders"
  | "addresses"
  | "wishlist"
  | "appointments"
  | "tickets"
  | "returns";

export default function AccountPage() {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const { user, hydrate, logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [addresses, setAddresses] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [wishlist, setWishlist] = useState<Array<Record<string, unknown>>>([]);
  const [appointments, setAppointments] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [tickets, setTickets] = useState<Array<Record<string, unknown>>>([]);
  const [returns, setReturns] = useState<Array<Record<string, unknown>>>([]);
  const [msg, setMsg] = useState("");

  async function refresh() {
    const [o, a, w, ap, tk, re] = await Promise.all([
      api.orders().catch(() => []),
      api.addresses().catch(() => []),
      api.wishlist(locale).catch(() => []),
      api.myAppointments().catch(() => []),
      api.myTickets().catch(() => []),
      api.myReturns().catch(() => []),
    ]);
    setOrders(o);
    setAddresses(a);
    setWishlist(w);
    setAppointments(ap);
    setTickets(tk);
    setReturns(re);
  }

  useEffect(() => {
    hydrate();
    if (!localStorage.getItem("mg_token")) {
      router.push(`/${locale}/auth`);
      return;
    }
    refresh().catch(() => undefined);
  }, [hydrate, locale, router]);

  async function onAddAddress(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.createAddress({
        label: String(fd.get("label") || "Home"),
        fullName: String(fd.get("fullName") || ""),
        phone: String(fd.get("phone") || ""),
        line1: String(fd.get("line1") || ""),
        line2: String(fd.get("line2") || "") || undefined,
        city: String(fd.get("city") || ""),
        region: String(fd.get("region") || "") || undefined,
        country: String(fd.get("country") || ""),
        postalCode: String(fd.get("postalCode") || "") || undefined,
        isDefault: fd.get("isDefault") === "on",
      });
      setMsg(t("addressSaved"));
      e.currentTarget.reset();
      await refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  async function onCreateTicket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.createTicket({
        type: String(fd.get("type") || "SUPPORT"),
        subject: String(fd.get("subject") || ""),
        message: String(fd.get("message") || ""),
        orderId: String(fd.get("orderId") || "") || undefined,
      });
      setMsg(t("ticketSent"));
      e.currentTarget.reset();
      await refresh();
      setTab("tickets");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  async function onCreateReturn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.createReturn({
        orderId: String(fd.get("orderId") || ""),
        reason: String(fd.get("reason") || ""),
        message: String(fd.get("message") || ""),
      });
      setMsg(t("returnSent"));
      e.currentTarget.reset();
      await refresh();
      setTab("returns");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  const tabs: Array<[Tab, string]> = [
    ["orders", t("orders")],
    ["addresses", t("addresses")],
    ["wishlist", t("wishlist")],
    ["appointments", t("appointments")],
    ["tickets", t("tickets")],
    ["returns", t("returns")],
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-8 md:px-8">
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

      <div className="mt-8 flex flex-wrap gap-2 text-sm">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`border px-3 py-1.5 ${
              tab === id ? "border-gold" : "border-black/15 text-ink/60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {msg ? <p className="mt-4 text-sm text-ink/65">{msg}</p> : null}

      {tab === "orders" ? (
        <div className="mt-8 space-y-3">
          {!orders.length ? (
            <p className="text-ink/60">—</p>
          ) : (
            orders.map((order) => (
              <Link
                key={String(order.id)}
                href={`/${locale}/account/orders/${order.id}`}
                className="block border border-black/10 px-4 py-4 transition hover:border-gold"
              >
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-medium">
                    {String(order.orderNumber)}
                  </span>
                  <span className="text-ink/55">{String(order.status)}</span>
                </div>
                <p className="mt-1 text-sm text-ink/55">
                  {order.currency === "UZS"
                    ? formatUzs(Number(order.totalMinor || 0), locale)
                    : formatUsd(Number(order.totalMinor || 0), locale)}
                </p>
              </Link>
            ))
          )}
        </div>
      ) : null}

      {tab === "addresses" ? (
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <form onSubmit={onAddAddress} className="space-y-3">
            <h2 className="font-display text-3xl">{t("addAddress")}</h2>
            {(
              [
                ["label", t("label")],
                ["fullName", t("fullName")],
                ["phone", t("phone")],
                ["line1", t("line1")],
                ["line2", t("line2")],
                ["city", t("city")],
                ["region", t("region")],
                ["country", t("country")],
                ["postalCode", t("postalCode")],
              ] as const
            ).map(([name, label]) => (
              <label key={name} className="block text-sm">
                <span className="text-ink/55">{label}</span>
                <input
                  name={name}
                  required={!["line2", "region", "postalCode", "label"].includes(
                    name,
                  )}
                  className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
                />
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm">
              <input name="isDefault" type="checkbox" />
              {t("setDefault")}
            </label>
            <button type="submit" className="btn-primary">
              {t("saveAddress")}
            </button>
          </form>
          <div className="space-y-3">
            {addresses.map((a) => (
              <div
                key={String(a.id)}
                className="border border-black/10 px-4 py-3 text-sm"
              >
                <p className="font-medium">
                  {String(a.label)}
                  {a.isDefault ? ` · ${t("default")}` : ""}
                </p>
                <p className="mt-1 text-ink/60">
                  {String(a.fullName)} · {String(a.phone)}
                </p>
                <p className="text-ink/60">
                  {String(a.line1)}
                  {a.line2 ? `, ${String(a.line2)}` : ""}
                </p>
                <p className="text-ink/60">
                  {String(a.city)}
                  {a.region ? `, ${String(a.region)}` : ""} · {String(a.country)}
                </p>
                <button
                  type="button"
                  className="btn-ghost mt-2 px-2 py-1 text-xs"
                  onClick={async () => {
                    await api.deleteAddress(String(a.id));
                    await refresh();
                  }}
                >
                  {t("remove")}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "wishlist" ? (
        <div className="mt-8 space-y-3">
          {!wishlist.length ? (
            <p className="text-ink/60">—</p>
          ) : (
            wishlist.map((item) => {
              const product = (item.product as Record<string, unknown>) || item;
              return (
                <Link
                  key={String(item.id || product.id)}
                  href={`/${locale}/product/${product.slug || ""}`}
                  className="block border border-black/10 px-4 py-3 text-sm"
                >
                  {String(product.name || product.slug || item.productId)}
                </Link>
              );
            })
          )}
        </div>
      ) : null}

      {tab === "appointments" ? (
        <div className="mt-8 space-y-3">
          {!appointments.length ? (
            <p className="text-ink/60">—</p>
          ) : (
            appointments.map((a) => (
              <div
                key={String(a.id)}
                className="border border-black/10 px-4 py-3 text-sm"
              >
                <p className="font-medium">
                  {String(a.type)} · {String(a.status)}
                </p>
                <p className="text-ink/55">
                  {String(a.date).slice(0, 10)} {String(a.slot)}
                </p>
              </div>
            ))
          )}
          <Link href={`/${locale}/appointments`} className="btn-ghost inline-flex">
            {t("bookAgain")}
          </Link>
        </div>
      ) : null}

      {tab === "tickets" ? (
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <form onSubmit={onCreateTicket} className="space-y-3">
            <h2 className="font-display text-3xl">{t("newTicket")}</h2>
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
              <span className="text-ink/55">{t("relatedOrder")}</span>
              <select
                name="orderId"
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              >
                <option value="">{t("noOrder")}</option>
                {orders.map((o) => (
                  <option key={String(o.id)} value={String(o.id)}>
                    {String(o.orderNumber)}
                  </option>
                ))}
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
                rows={4}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <button type="submit" className="btn-primary">
              {t("sendTicket")}
            </button>
          </form>
          <div className="space-y-3">
            {tickets.map((tk) => (
              <div
                key={String(tk.id)}
                className="border border-black/10 px-4 py-3 text-sm"
              >
                <p className="font-medium">
                  {String(tk.type)} · {String(tk.status)}
                </p>
                <p className="mt-1">{String(tk.subject)}</p>
                <p className="text-ink/55">{String(tk.message)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "returns" ? (
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <form onSubmit={onCreateReturn} className="space-y-3">
            <h2 className="font-display text-3xl">{t("newReturn")}</h2>
            <label className="block text-sm">
              <span className="text-ink/55">{t("selectOrder")}</span>
              <select
                name="orderId"
                required
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              >
                {orders.map((o) => (
                  <option key={String(o.id)} value={String(o.id)}>
                    {String(o.orderNumber)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-ink/55">{t("returnReason")}</span>
              <input
                name="reason"
                required
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/55">{t("message")}</span>
              <textarea
                name="message"
                required
                rows={4}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <button type="submit" className="btn-primary">
              {t("sendReturn")}
            </button>
          </form>
          <div className="space-y-3">
            {!returns.length ? (
              <p className="text-sm text-ink/55">{t("noReturns")}</p>
            ) : (
              returns.map((r) => {
                const o = (r.order as Record<string, string>) || {};
                return (
                  <div
                    key={String(r.id)}
                    className="border border-black/10 px-4 py-3 text-sm"
                  >
                    <p className="font-medium">
                      {String(r.rmaNumber)} · {String(r.status)}
                    </p>
                    <p className="text-ink/55">
                      {o.orderNumber} · {String(r.reason)}
                    </p>
                    <p className="mt-1 text-ink/60">{String(r.message)}</p>
                    {r.adminNotes ? (
                      <p className="mt-1 text-ink/50">{String(r.adminNotes)}</p>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
