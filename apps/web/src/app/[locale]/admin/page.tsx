"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api, formatUsd } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { ImageField } from "@/components/admin/image-field";

type Tab =
  | "overview"
  | "products"
  | "orders"
  | "customers"
  | "catalog"
  | "appointments"
  | "tickets"
  | "inquiries"
  | "coupons"
  | "returns"
  | "reviews"
  | "settings";

const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "AWAITING_PICKUP",
  "PENDING_SHIPPING_QUOTE",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

function trName(
  rows: Array<{ locale: string; name: string }> | undefined,
  fallback: string,
) {
  return rows?.find((x) => x.locale === "en")?.name || fallback;
}

export default function AdminPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { hydrate } = useAuthStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [customers, setCustomers] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [categories, setCategories] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [collections, setCollections] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [appointments, setAppointments] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [tickets, setTickets] = useState<Array<Record<string, unknown>>>([]);
  const [inquiries, setInquiries] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [coupons, setCoupons] = useState<Array<Record<string, unknown>>>([]);
  const [returns, setReturns] = useState<Array<Record<string, unknown>>>([]);
  const [reviews, setReviews] = useState<Array<Record<string, unknown>>>([]);
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [msg, setMsg] = useState("");
  const [loadError, setLoadError] = useState("");
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [collectionImageUrl, setCollectionImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [slotsText, setSlotsText] = useState("");

  async function refresh() {
    setLoadError("");
    const results = await Promise.allSettled([
      api.adminDashboard(),
      api.adminProducts(),
      api.adminOrders(),
      api.adminAppointments(),
      api.adminTickets(),
      api.adminInquiries(),
      api.adminCoupons(),
      api.adminReturns(),
      api.adminSettings(),
      api.adminCustomers(),
      api.adminCategories(),
      api.adminCollections(),
      api.adminReviews(),
    ]);
    const value = <T,>(i: number, fallback: T): T =>
      results[i].status === "fulfilled"
        ? (results[i] as PromiseFulfilledResult<T>).value
        : fallback;

    setData(value<Record<string, unknown> | null>(0, null));
    setProducts(value(1, []));
    setOrders(value(2, []));
    setAppointments(value(3, []));
    setTickets(value(4, []));
    setInquiries(value(5, []));
    setCoupons(value(6, []));
    setReturns(value(7, []));
    const sett = value<Record<string, unknown>>(8, {});
    setSettings(sett);
    setCustomers(value(9, []));
    setCategories(value(10, []));
    setCollections(value(11, []));
    setReviews(value(12, []));

    const brand = (sett.brand as Record<string, string>) || {};
    setLogoUrl(brand.logoUrl || "");
    setHeroImageUrl(brand.heroImageUrl || "");
    const slots =
      ((sett.appointmentSlots as { slots?: string[] }) || {}).slots || [];
    setSlotsText(slots.join(", "));

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed === results.length) {
      setLoadError("Could not load admin data. Sign in again or retry.");
    } else if (failed > 0) {
      setLoadError(`Some admin panels failed to load (${failed}).`);
    }
  }

  useEffect(() => {
    hydrate();
    let u: { role?: string } | null = null;
    try {
      const raw = localStorage.getItem("mg_user");
      u = raw ? (JSON.parse(raw) as { role?: string }) : null;
    } catch {
      localStorage.removeItem("mg_token");
      localStorage.removeItem("mg_user");
      window.location.assign(`/${locale}/auth`);
      return;
    }
    if (!localStorage.getItem("mg_token") || !u || u.role === "CUSTOMER") {
      window.location.assign(`/${locale}/auth`);
      return;
    }
    setReady(true);
    refresh().catch(() => {
      setData(null);
      setLoadError("Could not load admin data. Sign in again or retry.");
    });
  }, [hydrate, locale]);

  const recent = (data?.recentOrders as Array<Record<string, unknown>>) || [];
  const showroom = (settings.showroom as Record<string, string>) || {};
  const brand = (settings.brand as Record<string, string>) || {};
  const currencies = (settings.currencies as Record<string, string[]>) || {
    base: ["USD", "UZS"],
    display: ["USD", "UZS"],
  };

  const editing = useMemo(
    () => products.find((p) => String(p.id) === editingId) || null,
    [products, editingId],
  );

  useEffect(() => {
    if (!editing) {
      setEditImageUrl("");
      return;
    }
    const media = (editing.media as Array<{ url: string; isPrimary?: boolean }>) || [];
    const primary = media.find((m) => m.isPrimary) || media[0];
    setEditImageUrl(primary?.url || "");
  }, [editing]);

  function localeTranslations(fd: FormData, fallbackName: string, fallbackDesc: string) {
    const locales = ["en", "uz", "ru", "tr"] as const;
    return locales.map((loc) => ({
      locale: loc,
      name: String(fd.get(`name_${loc}`) || fallbackName),
      description: String(fd.get(`desc_${loc}`) || fallbackDesc),
    }));
  }

  async function onCreateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name_en") || fd.get("name") || "");
    const description = String(fd.get("desc_en") || fd.get("description") || name);
    const slug = String(fd.get("slug") || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    try {
      await api.adminCreateProduct({
        slug,
        sku: String(fd.get("sku") || ""),
        metal: String(fd.get("metal") || "Gold"),
        purity: String(fd.get("purity") || "585") || undefined,
        weightGrams: Number(fd.get("weightGrams") || 1),
        makingChargePct: Number(fd.get("makingChargePct") || 0),
        priceUsdCents: Math.round(Number(fd.get("priceUsd") || 0) * 100),
        priceUzs: Number(fd.get("priceUzs") || 0),
        quantity: Number(fd.get("quantity") || 1),
        imageUrl: createImageUrl || undefined,
        categoryId: String(fd.get("categoryId") || "") || undefined,
        collectionId: String(fd.get("collectionId") || "") || undefined,
        published: fd.get("published") === "on",
        isFeatured: fd.get("isFeatured") === "on",
        isBestSeller: fd.get("isBestSeller") === "on",
        isNewArrival: fd.get("isNewArrival") === "on",
        shipsInternational: fd.get("shipsInternational") === "on",
        translations: localeTranslations(fd, name, description),
      });
      setMsg(t("productCreated"));
      setCreateImageUrl("");
      e.currentTarget.reset();
      await refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  async function onUpdateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingId) return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name_en") || "");
    const description = String(fd.get("desc_en") || name);
    try {
      await api.adminUpdateProduct(editingId, {
        slug: String(fd.get("slug") || ""),
        sku: String(fd.get("sku") || ""),
        metal: String(fd.get("metal") || "Gold"),
        purity: String(fd.get("purity") || "") || undefined,
        weightGrams: Number(fd.get("weightGrams") || 1),
        makingChargePct: Number(fd.get("makingChargePct") || 0),
        priceUsdCents: Math.round(Number(fd.get("priceUsd") || 0) * 100),
        priceUzs: Number(fd.get("priceUzs") || 0),
        quantity: Number(fd.get("quantity") || 0),
        imageUrl: editImageUrl || undefined,
        categoryId: String(fd.get("categoryId") || "") || null,
        collectionId: String(fd.get("collectionId") || "") || null,
        published: fd.get("published") === "on",
        isFeatured: fd.get("isFeatured") === "on",
        isBestSeller: fd.get("isBestSeller") === "on",
        isNewArrival: fd.get("isNewArrival") === "on",
        shipsInternational: fd.get("shipsInternational") === "on",
        translations: localeTranslations(fd, name, description),
      });
      setMsg(t("productUpdated"));
      setEditingId(null);
      await refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  }

  async function onSaveSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const slots = slotsText
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
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
        phone: String(fd.get("phone") || ""),
        whatsapp: String(fd.get("whatsapp") || ""),
        hours: String(fd.get("hours") || ""),
        mapUrl: String(fd.get("mapUrl") || ""),
      });
      await api.adminSaveSetting("brand", {
        ...brand,
        logoUrl,
        heroImageUrl,
        heroHeadline: String(fd.get("heroHeadline") || ""),
        heroTagline: String(fd.get("heroTagline") || ""),
      });
      await api.adminSaveSetting("appointmentSlots", { slots });
      await api.adminSaveSetting("currencies", {
        base: String(fd.get("currencyBase") || "USD,UZS")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        display: String(fd.get("currencyDisplay") || "USD,UZS")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
        startsAt: String(fd.get("startsAt") || "") || null,
        endsAt: String(fd.get("endsAt") || "") || null,
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
    ["customers", t("customers")],
    ["catalog", t("catalog")],
    ["appointments", t("appointments")],
    ["tickets", t("tickets")],
    ["inquiries", t("inquiries")],
    ["coupons", t("coupons")],
    ["returns", t("returns")],
    ["reviews", t("reviews")],
    ["settings", t("settings")],
  ];

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8">
        <p className="text-ink/60">…</p>
      </div>
    );
  }

  const productFormFields = (p?: Record<string, unknown> | null) => {
    const tr =
      (p?.translations as Array<{
        locale: string;
        name: string;
        description: string;
      }>) || [];
    const byLoc = (loc: string) => tr.find((x) => x.locale === loc);
    return (
      <>
        {(
          [
            ["slug", "Slug", String(p?.slug || "")],
            ["sku", "SKU", String(p?.sku || "")],
            ["metal", t("metal"), String(p?.metal || "Gold")],
            ["purity", t("purity"), String(p?.purity || "585")],
            ["weightGrams", t("weight"), String(p?.weightGrams ?? "1")],
            [
              "makingChargePct",
              t("makingCharge"),
              String(p?.makingChargePct ?? "0"),
            ],
            [
              "priceUsd",
              "USD",
              p ? String(Number(p.priceUsdCents || 0) / 100) : "",
            ],
            ["priceUzs", "UZS", String(p?.priceUzs ?? "")],
            [
              "quantity",
              t("quantity"),
              String(
                (p?.inventory as { quantity?: number } | null)?.quantity ?? 1,
              ),
            ],
          ] as const
        ).map(([name, label, value]) => (
          <label key={name} className="block text-sm">
            <span className="text-ink/55">{label}</span>
            <input
              name={name}
              defaultValue={value}
              required={!["purity", "makingChargePct", "slug"].includes(name)}
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
        ))}
        {(["en", "uz", "ru", "tr"] as const).map((loc) => (
          <div key={loc} className="space-y-2 border border-black/10 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
              {loc}
            </p>
            <label className="block text-sm">
              <span className="text-ink/55">{t("productName")}</span>
              <input
                name={`name_${loc}`}
                defaultValue={byLoc(loc)?.name || ""}
                required={loc === "en"}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/55">{t("description")}</span>
              <textarea
                name={`desc_${loc}`}
                rows={2}
                defaultValue={byLoc(loc)?.description || ""}
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
          </div>
        ))}
        <label className="block text-sm">
          <span className="text-ink/55">{t("category")}</span>
          <select
            name="categoryId"
            defaultValue={String(p?.categoryId || "")}
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={String(c.id)} value={String(c.id)}>
                {trName(
                  c.translations as Array<{ locale: string; name: string }>,
                  String(c.slug),
                )}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-ink/55">{t("collection")}</span>
          <select
            name="collectionId"
            defaultValue={String(p?.collectionId || "")}
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2"
          >
            <option value="">—</option>
            {collections.map((c) => (
              <option key={String(c.id)} value={String(c.id)}>
                {trName(
                  c.translations as Array<{ locale: string; name: string }>,
                  String(c.slug),
                )}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-4 text-sm">
          {(
            [
              ["published", t("publish"), p ? Boolean(p.published) : true],
              ["isFeatured", t("featured"), Boolean(p?.isFeatured)],
              ["isBestSeller", t("bestseller"), Boolean(p?.isBestSeller)],
              ["isNewArrival", t("newArrival"), p ? Boolean(p.isNewArrival) : true],
              [
                "shipsInternational",
                t("shipsIntl"),
                p ? Boolean(p.shipsInternational) : true,
              ],
            ] as const
          ).map(([name, label, checked]) => (
            <label key={name} className="flex items-center gap-2">
              <input name={name} type="checkbox" defaultChecked={checked} />
              {label}
            </label>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-ink/55">Namangan showroom operations</p>

      {loadError ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 border border-black/15 px-4 py-3 text-sm">
          <p className="text-ink/70">{loadError}</p>
          <button
            type="button"
            className="btn-ghost px-3 py-1"
            onClick={() => refresh()}
          >
            Retry
          </button>
          <a href={`/${locale}/auth`} className="btn-ghost px-3 py-1">
            Sign in again
          </a>
        </div>
      ) : null}

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
          {editing ? (
            <form key={String(editing.id)} onSubmit={onUpdateProduct} className="space-y-3">
              <h2 className="font-display text-3xl">{t("editProduct")}</h2>
              {productFormFields(editing)}
              <ImageField
                name="imageUrl"
                label={t("imageUrl")}
                value={editImageUrl}
                onChange={setEditImageUrl}
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {t("saveProduct")}
                </button>
                <button
                  type="button"
                  className="btn-ghost px-4"
                  onClick={() => setEditingId(null)}
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onCreateProduct} className="space-y-3">
              <h2 className="font-display text-3xl">{t("addProduct")}</h2>
              {productFormFields(null)}
              <ImageField
                name="imageUrl"
                label={t("imageUrl")}
                value={createImageUrl}
                onChange={setCreateImageUrl}
              />
              <button type="submit" className="btn-primary">
                {t("saveProduct")}
              </button>
            </form>
          )}

          <div className="space-y-3">
            <h2 className="font-display text-3xl">{t("products")}</h2>
            {products.map((p) => {
              const name = trName(
                p.translations as Array<{ locale: string; name: string }>,
                String(p.sku),
              );
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
                        {p.published ? "" : " · draft"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        className="btn-ghost px-3 py-1 text-xs"
                        onClick={() => setEditingId(String(p.id))}
                      >
                        {t("edit")}
                      </button>
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
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="mt-10 space-y-3">
          {orders.map((order) => {
            const user = (order.user as Record<string, string>) || {};
            const items =
              (order.items as Array<Record<string, unknown>>) || [];
            const payments =
              (order.payments as Array<Record<string, unknown>>) || [];
            const open = expandedOrder === String(order.id);
            return (
              <div
                key={String(order.id)}
                className="border border-black/10 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{String(order.orderNumber)}</p>
                    <p className="text-ink/50">
                      {String(order.status)} · {String(order.fulfillmentType)} ·{" "}
                      {String(order.currency)} {String(order.totalMinor)}
                    </p>
                    <p className="text-ink/45">
                      {user.name} · {user.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="btn-ghost px-3 py-1 text-xs"
                      onClick={() =>
                        setExpandedOrder(open ? null : String(order.id))
                      }
                    >
                      {open ? t("hideDetails") : t("details")}
                    </button>
                    <select
                      className="border border-black/15 bg-white/50 px-2 py-1"
                      value={String(order.status)}
                      onChange={async (e) => {
                        await api.adminOrderStatus(
                          String(order.id),
                          e.target.value,
                        );
                        await refresh();
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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
                {open ? (
                  <div className="mt-3 space-y-2 border-t border-black/10 pt-3 text-ink/65">
                    <p>
                      {t("shipping")}: {String(order.shippingMinor || 0)} ·{" "}
                      {t("notes")}: {String(order.notes || "—")}
                    </p>
                    <ul className="space-y-1">
                      {items.map((it) => (
                        <li key={String(it.id)}>
                          {String(it.productName || it.productId)} ×{" "}
                          {String(it.quantity)} — {String(it.unitPriceMinor)}
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-1">
                      {payments.map((pay) => (
                        <li key={String(pay.id)}>
                          {String(pay.method)} · {String(pay.status)} ·{" "}
                          {String(pay.amountMinor)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {tab === "customers" ? (
        <div className="mt-10 space-y-3">
          {customers.length === 0 ? (
            <p className="text-ink/50">{t("empty")}</p>
          ) : null}
          {customers.map((c) => (
            <div
              key={String(c.id)}
              className="flex flex-wrap justify-between gap-3 border border-black/10 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{String(c.name)}</p>
                <p className="text-ink/50">
                  {String(c.email)}
                  {c.phone ? ` · ${String(c.phone)}` : ""}
                </p>
              </div>
              <p className="text-ink/55">
                {String((c._count as { orders?: number })?.orders ?? 0)}{" "}
                {t("orders").toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "catalog" ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                try {
                  await api.adminCreateCategory({
                    name: String(fd.get("name") || ""),
                    slug: String(fd.get("slug") || fd.get("name") || ""),
                    description: String(fd.get("description") || "") || undefined,
                  });
                  setMsg(t("categoryCreated"));
                  e.currentTarget.reset();
                  await refresh();
                } catch (err) {
                  setMsg(err instanceof Error ? err.message : "Error");
                }
              }}
            >
              <h2 className="font-display text-3xl">{t("categories")}</h2>
              <input
                name="name"
                required
                placeholder={t("productName")}
                className="w-full border border-black/15 bg-white/50 px-3 py-2"
              />
              <input
                name="slug"
                placeholder="slug"
                className="w-full border border-black/15 bg-white/50 px-3 py-2"
              />
              <textarea
                name="description"
                rows={2}
                className="w-full border border-black/15 bg-white/50 px-3 py-2"
              />
              <button type="submit" className="btn-primary">
                {t("addCategory")}
              </button>
            </form>
            <div className="space-y-2">
              {categories.map((c) => (
                <div
                  key={String(c.id)}
                  className="border border-black/10 px-3 py-2 text-sm"
                >
                  {trName(
                    c.translations as Array<{ locale: string; name: string }>,
                    String(c.slug),
                  )}{" "}
                  <span className="text-ink/45">
                    · {(c._count as { products?: number })?.products ?? 0}{" "}
                    {t("products").toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                try {
                  await api.adminCreateCollection({
                    name: String(fd.get("name") || ""),
                    slug: String(fd.get("slug") || fd.get("name") || ""),
                    description: String(fd.get("description") || "") || undefined,
                    featured: fd.get("featured") === "on",
                    imageUrl: collectionImageUrl || undefined,
                  });
                  setMsg(t("collectionCreated"));
                  setCollectionImageUrl("");
                  e.currentTarget.reset();
                  await refresh();
                } catch (err) {
                  setMsg(err instanceof Error ? err.message : "Error");
                }
              }}
            >
              <h2 className="font-display text-3xl">{t("collections")}</h2>
              <input
                name="name"
                required
                placeholder={t("productName")}
                className="w-full border border-black/15 bg-white/50 px-3 py-2"
              />
              <input
                name="slug"
                placeholder="slug"
                className="w-full border border-black/15 bg-white/50 px-3 py-2"
              />
              <textarea
                name="description"
                rows={2}
                className="w-full border border-black/15 bg-white/50 px-3 py-2"
              />
              <ImageField
                name="imageUrl"
                label={t("imageUrl")}
                value={collectionImageUrl}
                onChange={setCollectionImageUrl}
              />
              <label className="flex items-center gap-2 text-sm">
                <input name="featured" type="checkbox" /> {t("featured")}
              </label>
              <button type="submit" className="btn-primary">
                {t("addCollection")}
              </button>
            </form>
            <div className="space-y-2">
              {collections.map((c) => (
                <div
                  key={String(c.id)}
                  className="flex flex-wrap items-center justify-between gap-2 border border-black/10 px-3 py-2 text-sm"
                >
                  <span>
                    {trName(
                      c.translations as Array<{ locale: string; name: string }>,
                      String(c.slug),
                    )}
                    {c.featured ? ` · ${t("featured")}` : ""}
                  </span>
                  <button
                    type="button"
                    className="btn-ghost px-2 py-1 text-xs"
                    onClick={async () => {
                      await api.adminUpdateCollection(String(c.id), {
                        featured: !c.featured,
                      });
                      await refresh();
                    }}
                  >
                    {c.featured ? t("unfeature") : t("featured")}
                  </button>
                </div>
              ))}
            </div>
          </div>
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
                  {String(a.type)} · {String(a.date).slice(0, 10)}{" "}
                  {String(a.slot)} · {String(a.status)}
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
                    await api.adminAppointmentStatus(String(a.id), "COMPLETED");
                    await refresh();
                  }}
                >
                  {t("complete")}
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
            <label className="block text-sm">
              <span className="text-ink/55">{t("startsAt")}</span>
              <input
                name="startsAt"
                type="date"
                className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/55">{t("endsAt")}</span>
              <input
                name="endsAt"
                type="date"
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
                className="space-y-2 border border-black/10 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{String(c.code)}</p>
                    <p className="text-ink/50">
                      {c.percentOff != null
                        ? `${c.percentOff}%`
                        : `${c.amountOffMinor} minor`}
                      {c.currency ? ` · ${String(c.currency)}` : ""}
                      {` · ${c.active ? t("active") : "off"}`}
                      {c.startsAt
                        ? ` · from ${String(c.startsAt).slice(0, 10)}`
                        : ""}
                      {c.endsAt
                        ? ` · until ${String(c.endsAt).slice(0, 10)}`
                        : ""}
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
                <form
                  className="flex flex-wrap gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const percent = fd.get("percentOff");
                    const amount = fd.get("amountOffMinor");
                    await api.adminUpdateCoupon(String(c.id), {
                      percentOff: percent ? Number(percent) : null,
                      amountOffMinor: amount ? Number(amount) : null,
                      currency: String(fd.get("currency") || "") || null,
                      startsAt: String(fd.get("startsAt") || "") || null,
                      endsAt: String(fd.get("endsAt") || "") || null,
                    });
                    setMsg(t("couponUpdated"));
                    await refresh();
                  }}
                >
                  <input
                    name="percentOff"
                    type="number"
                    placeholder="%"
                    defaultValue={c.percentOff != null ? String(c.percentOff) : ""}
                    className="w-20 border border-black/15 px-2 py-1"
                  />
                  <input
                    name="amountOffMinor"
                    type="number"
                    placeholder="amount"
                    defaultValue={
                      c.amountOffMinor != null ? String(c.amountOffMinor) : ""
                    }
                    className="w-28 border border-black/15 px-2 py-1"
                  />
                  <input
                    name="currency"
                    placeholder="USD"
                    defaultValue={String(c.currency || "")}
                    className="w-20 border border-black/15 px-2 py-1"
                  />
                  <input
                    name="startsAt"
                    type="date"
                    defaultValue={
                      c.startsAt ? String(c.startsAt).slice(0, 10) : ""
                    }
                    className="border border-black/15 px-2 py-1"
                  />
                  <input
                    name="endsAt"
                    type="date"
                    defaultValue={c.endsAt ? String(c.endsAt).slice(0, 10) : ""}
                    className="border border-black/15 px-2 py-1"
                  />
                  <button type="submit" className="btn-ghost px-3 py-1">
                    {t("saveCoupon")}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "reviews" ? (
        <div className="mt-10 space-y-3">
          {reviews.length === 0 ? (
            <p className="text-ink/50">{t("empty")}</p>
          ) : null}
          {reviews.map((r) => {
            const u = (r.user as Record<string, string>) || {};
            const p = (r.product as Record<string, unknown>) || {};
            const pname = trName(
              p.translations as Array<{ locale: string; name: string }>,
              String(p.sku || p.slug || ""),
            );
            return (
              <div
                key={String(r.id)}
                className="flex flex-wrap items-start justify-between gap-3 border border-black/10 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {pname} · {String(r.rating)}★
                  </p>
                  <p className="text-ink/50">
                    {u.name} · {u.email}
                    {r.published ? "" : ` · ${t("hidden")}`}
                  </p>
                  {r.title ? (
                    <p className="mt-1 font-medium">{String(r.title)}</p>
                  ) : null}
                  <p className="mt-1 text-ink/60">{String(r.body)}</p>
                </div>
                <button
                  type="button"
                  className="btn-ghost px-3 py-1 text-xs"
                  onClick={async () => {
                    await api.adminUpdateReview(
                      String(r.id),
                      !r.published,
                    );
                    await refresh();
                  }}
                >
                  {r.published ? t("hideReview") : t("approveReview")}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {tab === "settings" ? (
        <form onSubmit={onSaveSettings} className="mt-10 max-w-xl space-y-3">
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
              ["phone", t("phone"), showroom.phone || ""],
              ["whatsapp", t("whatsapp"), showroom.whatsapp || ""],
              ["hours", t("hours"), showroom.hours || ""],
              ["mapUrl", t("mapUrl"), showroom.mapUrl || ""],
              ["telegram", "Telegram", showroom.telegram || ""],
              ["instagram", "Instagram", showroom.instagram || ""],
              ["email", "Email", showroom.email || ""],
              [
                "heroHeadline",
                t("heroHeadline"),
                brand.heroHeadline || "",
              ],
              ["heroTagline", t("heroTagline"), brand.heroTagline || ""],
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
          <ImageField
            name="logoUrl"
            label={t("logoUrl")}
            value={logoUrl}
            onChange={setLogoUrl}
          />
          <ImageField
            name="heroImageUrl"
            label={t("heroImageUrl")}
            value={heroImageUrl}
            onChange={setHeroImageUrl}
          />
          <label className="block text-sm">
            <span className="text-ink/55">{t("appointmentSlots")}</span>
            <textarea
              value={slotsText}
              onChange={(e) => setSlotsText(e.target.value)}
              rows={2}
              placeholder="10:00, 11:00, 14:00"
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("currencyBase")}</span>
            <input
              name="currencyBase"
              defaultValue={(currencies.base || ["USD", "UZS"]).join(",")}
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("currencyDisplay")}</span>
            <input
              name="currencyDisplay"
              defaultValue={(currencies.display || ["USD", "UZS"]).join(",")}
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
            />
          </label>
          <button type="submit" className="btn-primary">
            {t("saveSettings")}
          </button>
        </form>
      ) : null}
    </div>
  );
}
