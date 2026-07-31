"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api, formatUsd } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

type Tab =
  | "overview"
  | "products"
  | "orders"
  | "appointments"
  | "tickets"
  | "inquiries"
  | "coupons"
  | "returns"
  | "settings";

export default function AdminPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const { hydrate, user } = useAuthStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [appointments, setAppointments] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [tickets, setTickets] = useState<Array<Record<string, unknown>>>([]);
  const [inquiries, setInquiries] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [coupons, setCoupons] = useState<Array<Record<string, unknown>>>([]);
  const [returns, setReturns] = useState<Array<Record<string, unknown>>>([]);
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [msg, setMsg] = useState("");

  async function refresh() {
    const [dash, prods, ords, appts, tix, inqs, cps, rets, sett] =
      await Promise.all([
        api.adminDashboard(),
        api.adminProducts(),
        api.adminOrders(),
        api.adminAppointments(),
        api.adminTickets(),
        api.adminInquiries(),
        api.adminCoupons(),
        api.adminReturns(),
        api.adminSettings(),
      ]);
    setData(dash);
    setProducts(prods);
    setOrders(ords);
    setAppointments(appts);
    setTickets(tix);
    setInquiries(inqs);
    setCoupons(cps);
    setReturns(rets);
    setSettings(sett);
  }

  useEffect(() => {
    hydrate();
    const raw = localStorage.getItem("mg_user");
    const u = raw ? JSON.parse(raw) : null;
    if (!localStorage.getItem("mg_token") || !u || u.role === "CUSTOMER") {
      router.push(`/${locale}/auth`);
      return;
    }
    refresh().catch(() => setData(null));
  }, [hydrate, locale, router, user]);

  const recent = (data?.recentOrders as Array<Record<string, unknown>>) || [];
  const showroom = (settings.showroom as Record<string, string>) || {};
  const brand = (settings.brand as Record<string, string>) || {};

  async function onCreateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const slug = String(fd.get("slug") || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    try {
      await api.adminCreateProduct({
        slug,
        sku: String(fd.get("sku") || ""),
        metal: String(fd.get("metal") || "Gold"),
        purity: String(fd.get("purity") || "585"),
        weightGrams: Number(fd.get("weightGrams") || 1),
        priceUsdCents: Math.round(Number(fd.get("priceUsd") || 0) * 100),
        priceUzs: Number(fd.get("priceUzs") || 0),
        quantity: Number(fd.get("quantity") || 1),
        imageUrl: String(fd.get("imageUrl") || "") || undefined,
        published: true,
        isNewArrival: true,
        translations: [
          {
            locale: "en",
            name,
            description: String(fd.get("description") || name),
          },
          {
            locale: "uz",
            name,
            description: String(fd.get("description") || name),
          },
          {
            locale: "ru",
            name,
            description: String(fd.get("description") || name),
          },
          {
            locale: "tr",
            name,
            description: String(fd.get("description") || name),
          },
        ],
      });
      setMsg(t("productCreated"));
      e.currentTarget.reset();
      await refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  async function onSaveBrand(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.adminSaveSetting("showroom", {
        ...showroom,
        brand: String(fd.get("brand") || "MG Jewelry"),
        fullName: String(
          fd.get("fullName") || "Modern Gold Jewelry Manufacturing",
        ),
        address: String(fd.get("address") || "242, Girvonbulok Street"),
        district: String(fd.get("district") || "Davlatabad District"),
        city: String(fd.get("city") || "Namangan City"),
        region: String(fd.get("region") || "Namangan Region"),
        country: String(fd.get("country") || "Republic of Uzbekistan"),
        telegram: String(fd.get("telegram") || ""),
        instagram: String(fd.get("instagram") || ""),
        email: String(fd.get("email") || ""),
      });
      await api.adminSaveSetting("brand", {
        ...brand,
        logoUrl: String(fd.get("logoUrl") || ""),
        heroImageUrl: String(fd.get("heroImageUrl") || ""),
      });
      setMsg(t("settingsSaved"));
      await refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  async function onCreateCoupon(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const percent = fd.get("percentOff");
      const amount = fd.get("amountOffMinor");
      await api.adminCreateCoupon({
        code: String(fd.get("code") || ""),
        percentOff: percent ? Number(percent) : null,
        amountOffMinor: amount ? Number(amount) : null,
        currency: String(fd.get("currency") || "") || null,
        active: true,
      });
      setMsg(t("couponCreated"));
      e.currentTarget.reset();
      await refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  const tabs: Array<[Tab, string]> = [
    ["overview", t("overview")],
    ["products", t("products")],
    ["orders", t("orders")],
    ["appointments", t("appointments")],
    ["tickets", t("tickets")],
    ["inquiries", t("inquiries")],
    ["coupons", t("coupons")],
    ["returns", t("returns")],
    ["settings", t("settings")],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-ink/55">Namangan showroom operations</p>

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

      {tab === "overview" ? (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [t("products"), data?.products],
              [t("orders"), data?.orders],
              [t("customers"), data?.customers],
              [t("appointments"), data?.pendingAppointments],
              [t("revenue"), formatUsd(Number(data?.revenueMinor || 0), locale)],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="border border-black/10 bg-white/40 px-5 py-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
                  {String(label)}
                </p>
                <p className="mt-3 font-display text-3xl">
                  {String(value ?? "—")}
                </p>
              </div>
            ))}
          </div>
          <h2 className="mt-12 text-sm uppercase tracking-[0.25em] text-ink/50">
            {t("orders")}
          </h2>
          <div className="mt-4 space-y-3">
            {recent.map((order) => (
              <div
                key={String(order.id)}
                className="flex justify-between border border-black/10 px-4 py-3 text-sm"
              >
                <span>{String(order.orderNumber)}</span>
                <span className="text-ink/55">{String(order.status)}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {tab === "products" ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <form onSubmit={onCreateProduct} className="space-y-3">
            <h2 className="font-display text-3xl">{t("addProduct")}</h2>
            {(
              [
                ["name", t("productName")],
                ["sku", "SKU"],
                ["metal", t("metal")],
                ["purity", t("purity")],
                ["weightGrams", t("weight")],
                ["priceUsd", "USD"],
                ["priceUzs", "UZS"],
                ["quantity", t("quantity")],
                ["imageUrl", t("imageUrl")],
              ] as const
            ).map(([name, label]) => (
              <label key={name} className="block text-sm">
                <span className="text-ink/55">{label}</span>
                <input
                  name={name}
                  required={!["imageUrl", "purity"].includes(name)}
                  className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
                />
              </label>
            ))}
            <label className="block text-sm">
              <span className="text-ink/55">{t("description")}</span>
              <textarea
                name="description"
                rows={3}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <button type="submit" className="btn-primary">
              {t("saveProduct")}
            </button>
          </form>

          <div className="space-y-3">
            <h2 className="font-display text-3xl">{t("products")}</h2>
            {products.map((p) => {
              const tr = (p.translations as Array<{ locale: string; name: string }>) || [];
              const name =
                tr.find((x) => x.locale === "en")?.name || String(p.sku);
              return (
                <div
                  key={String(p.id)}
                  className="border border-black/10 px-4 py-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-ink/50">
                        {String(p.sku)} · stock{" "}
                        {String(
                          (p.inventory as { quantity?: number } | null)
                            ?.quantity ?? 0,
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost px-3 py-1 text-xs"
                      onClick={async () => {
                        await api.adminUpdateProduct(String(p.id), {
                          published: !p.published,
                        });
                        await refresh();
                      }}
                    >
                      {p.published ? t("unpublish") : t("publish")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="mt-10 space-y-3">
          {orders.map((order) => (
            <div
              key={String(order.id)}
              className="flex flex-wrap items-center justify-between gap-3 border border-black/10 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{String(order.orderNumber)}</p>
                <p className="text-ink/50">
                  {String(order.status)} · {String(order.fulfillmentType)} ·{" "}
                  {String(order.currency)} {String(order.totalMinor)}
                </p>
                {String(order.status) === "PENDING_SHIPPING_QUOTE" ? (
                  <form
                    className="mt-2 flex flex-wrap items-end gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      try {
                        await api.adminShippingQuote(
                          String(order.id),
                          Number(fd.get("shippingMinor") || 0),
                        );
                        setMsg(t("quoteSent"));
                        await refresh();
                      } catch (err) {
                        setMsg(err instanceof Error ? err.message : "Error");
                      }
                    }}
                  >
                    <label className="text-xs">
                      <span className="text-ink/55">{t("shippingMinor")}</span>
                      <input
                        name="shippingMinor"
                        type="number"
                        min={0}
                        required
                        defaultValue={String(order.shippingMinor || 0)}
                        className="mt-1 block w-36 border border-black/15 bg-white/50 px-2 py-1"
                      />
                    </label>
                    <button type="submit" className="btn-ghost px-3 py-1">
                      {t("sendQuote")}
                    </button>
                  </form>
                ) : null}
              </div>
              <select
                className="border border-black/15 bg-white/50 px-2 py-1"
                defaultValue={String(order.status)}
                onChange={async (e) => {
                  await api.adminOrderStatus(String(order.id), e.target.value);
                  await refresh();
                }}
              >
                {[
                  "PENDING_PAYMENT",
                  "PAID",
                  "AWAITING_PICKUP",
                  "PENDING_SHIPPING_QUOTE",
                  "PROCESSING",
                  "SHIPPED",
                  "COMPLETED",
                  "CANCELLED",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "appointments" ? (
        <div className="mt-10 space-y-3">
          {appointments.map((a) => (
            <div
              key={String(a.id)}
              className="flex flex-wrap items-center justify-between gap-3 border border-black/10 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {String(a.name)} · {String(a.phone)}
                </p>
                <p className="text-ink/50">
                  {String(a.type)} · {String(a.date).slice(0, 10)} {String(a.slot)} ·{" "}
                  {String(a.status)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-ghost px-3 py-1 text-xs"
                  onClick={async () => {
                    await api.adminAppointmentStatus(String(a.id), "CONFIRMED");
                    await refresh();
                  }}
                >
                  {t("confirm")}
                </button>
                <button
                  type="button"
                  className="btn-ghost px-3 py-1 text-xs"
                  onClick={async () => {
                    await api.adminAppointmentStatus(String(a.id), "CANCELLED");
                    await refresh();
                  }}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "tickets" ? (
        <div className="mt-10 space-y-3">
          {tickets.map((tk) => {
            const u = (tk.user as Record<string, string>) || {};
            const o = (tk.order as Record<string, string>) || {};
            return (
              <div
                key={String(tk.id)}
                className="flex flex-wrap items-center justify-between gap-3 border border-black/10 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {String(tk.type)} · {String(tk.subject)}
                  </p>
                  <p className="text-ink/50">
                    {u.name} · {u.email}
                    {o.orderNumber ? ` · #${o.orderNumber}` : ""}
                  </p>
                  <p className="mt-1 text-ink/60">{String(tk.message)}</p>
                </div>
                <select
                  className="border border-black/15 bg-white/50 px-2 py-1"
                  defaultValue={String(tk.status)}
                  onChange={async (e) => {
                    await api.adminTicketStatus(String(tk.id), e.target.value);
                    await refresh();
                  }}
                >
                  {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      ) : null}

      {tab === "inquiries" ? (
        <div className="mt-10 space-y-3">
          {inquiries.map((iq) => {
            const product = (iq.product as Record<string, unknown>) || {};
            const translations =
              (product.translations as Array<Record<string, string>>) || [];
            const productName =
              translations[0]?.name ||
              String(iq.productSlug || product.slug || "");
            return (
              <div
                key={String(iq.id)}
                className="flex flex-wrap items-center justify-between gap-3 border border-black/10 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {String(iq.name)} · {String(iq.email)}
                  </p>
                  <p className="text-ink/50">
                    {iq.phone ? String(iq.phone) : ""}
                    {productName ? ` · ${productName}` : ""}
                  </p>
                  <p className="mt-1 text-ink/60">{String(iq.message)}</p>
                </div>
                <select
                  className="border border-black/15 bg-white/50 px-2 py-1"
                  defaultValue={String(iq.status)}
                  onChange={async (e) => {
                    await api.adminInquiryStatus(String(iq.id), e.target.value);
                    await refresh();
                  }}
                >
                  {["NEW", "IN_PROGRESS", "CLOSED"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      ) : null}

      {tab === "returns" ? (
        <div className="mt-10 space-y-3">
          {returns.map((r) => {
            const u = (r.user as Record<string, string>) || {};
            const o = (r.order as Record<string, string>) || {};
            return (
              <div
                key={String(r.id)}
                className="space-y-2 border border-black/10 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {String(r.rmaNumber)} · {o.orderNumber}
                    </p>
                    <p className="text-ink/50">
                      {u.name} · {u.email}
                    </p>
                    <p className="mt-1">
                      {String(r.reason)} — {String(r.message)}
                    </p>
                  </div>
                  <select
                    className="border border-black/15 bg-white/50 px-2 py-1"
                    defaultValue={String(r.status)}
                    onChange={async (e) => {
                      await api.adminUpdateReturn(String(r.id), {
                        status: e.target.value,
                        adminNotes: String(r.adminNotes || "") || undefined,
                      });
                      await refresh();
                    }}
                  >
                    {[
                      "REQUESTED",
                      "APPROVED",
                      "REJECTED",
                      "RECEIVED",
                      "REFUNDED",
                      "CLOSED",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <form
                  className="flex flex-wrap gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    await api.adminUpdateReturn(String(r.id), {
                      status: String(r.status),
                      adminNotes: String(fd.get("adminNotes") || ""),
                    });
                    setMsg(t("saveReturn"));
                    await refresh();
                  }}
                >
                  <input
                    name="adminNotes"
                    defaultValue={String(r.adminNotes || "")}
                    placeholder={t("adminNotes")}
                    className="min-w-[16rem] flex-1 border border-black/15 bg-white/50 px-2 py-1"
                  />
                  <button type="submit" className="btn-ghost px-3 py-1">
                    {t("saveReturn")}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : null}

      {tab === "coupons" ? (
        <div className="mt-10 space-y-8">
          <form onSubmit={onCreateCoupon} className="max-w-md space-y-3">
            <h2 className="font-display text-3xl">{t("createCoupon")}</h2>
            <label className="block text-sm">
              <span className="text-ink/55">{t("couponCode")}</span>
              <input
                name="code"
                required
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/55">{t("percentOff")}</span>
              <input
                name="percentOff"
                type="number"
                min={1}
                max={100}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/55">{t("amountOff")}</span>
              <input
                name="amountOffMinor"
                type="number"
                min={0}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/55">{t("currency")}</span>
              <input
                name="currency"
                placeholder="USD / UZS"
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <button type="submit" className="btn-primary">
              {t("createCoupon")}
            </button>
          </form>
          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={String(c.id)}
                className="flex flex-wrap items-center justify-between gap-3 border border-black/10 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{String(c.code)}</p>
                  <p className="text-ink/50">
                    {c.percentOff != null
                      ? `${c.percentOff}%`
                      : `${c.amountOffMinor} minor`}
                    {c.currency ? ` · ${String(c.currency)}` : ""}
                    {` · ${c.active ? t("active") : "off"}`}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-ghost px-3 py-1 text-sm"
                  onClick={async () => {
                    await api.adminUpdateCoupon(String(c.id), {
                      active: !c.active,
                    });
                    await refresh();
                  }}
                >
                  {c.active ? t("deactivate") : t("activate")}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "settings" ? (
        <form onSubmit={onSaveBrand} className="mt-10 max-w-xl space-y-3">
          <h2 className="font-display text-3xl">{t("settings")}</h2>
          {(
            [
              ["brand", "Brand", showroom.brand || "MG Jewelry"],
              [
                "fullName",
                "Full name",
                showroom.fullName || "Modern Gold Jewelry Manufacturing",
              ],
              [
                "address",
                t("address"),
                showroom.address || "242, Girvonbulok Street",
              ],
              [
                "district",
                "District",
                showroom.district || "Davlatabad District",
              ],
              ["city", "City", showroom.city || "Namangan City"],
              ["region", "Region", showroom.region || "Namangan Region"],
              [
                "country",
                "Country",
                showroom.country || "Republic of Uzbekistan",
              ],
              ["telegram", "Telegram", showroom.telegram || ""],
              ["instagram", "Instagram", showroom.instagram || ""],
              ["email", "Email", showroom.email || ""],
              ["logoUrl", t("logoUrl"), brand.logoUrl || ""],
              ["heroImageUrl", t("heroImageUrl"), brand.heroImageUrl || ""],
            ] as const
          ).map(([name, label, value]) => (
            <label key={name} className="block text-sm">
              <span className="text-ink/55">{label}</span>
              <input
                name={name}
                defaultValue={value}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
          ))}
          <button type="submit" className="btn-primary">
            {t("saveSettings")}
          </button>
        </form>
      ) : null}
    </div>
  );
}
