"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";

export type ShopQuery = {
  category?: string;
  collection?: string;
  metal?: string;
  minPriceUsd?: string;
  maxPriceUsd?: string;
  minWeight?: string;
  maxWeight?: string;
  sort?: string;
  q?: string;
};

type FacetItem = { slug: string; name: string; count: number };

const PRICE_BUCKETS = [
  { key: "under", min: undefined, max: "500", labelKey: "priceUnder" as const },
  { key: "mid", min: "500", max: "1500", labelKey: "priceMid" as const },
  { key: "high", min: "1500", max: "3000", labelKey: "priceHigh" as const },
  { key: "top", min: "3000", max: undefined, labelKey: "priceTop" as const },
];

const WEIGHT_BUCKETS = [
  { key: "0-2", min: "0", max: "2", label: "0–2 g" },
  { key: "2-5", min: "2", max: "5", label: "2–5 g" },
  { key: "5-10", min: "5", max: "10", label: "5–10 g" },
  { key: "10-20", min: "10", max: "20", label: "10–20 g" },
  { key: "20+", min: "20", max: undefined, label: "20 g+" },
];

const METALS = [
  { slug: "Gold", swatch: "#d4af37" },
  { slug: "Platinum", swatch: "#c5c8ce" },
  { slug: "Silver", swatch: "#e8e8e8" },
];

function hrefWith(locale: string, current: ShopQuery, extra: Partial<ShopQuery>) {
  const params = new URLSearchParams();
  const merged: ShopQuery = { ...current, ...extra };
  Object.entries(merged).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  const qs = params.toString();
  return `/${locale}/shop${qs ? `?${qs}` : ""}`;
}

function CheckRow({
  checked,
  href,
  label,
  count,
}: {
  checked: boolean;
  href: string;
  label: string;
  count?: number;
}) {
  return (
    <Link href={href} className="flex items-center gap-2 py-1.5 text-sm text-ink/75 hover:text-ink">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
          checked ? "border-gold bg-gold" : "border-black/25 bg-white"
        }`}
      >
        {checked ? <span className="h-1.5 w-1.5 bg-ink" /> : null}
      </span>
      <span className="flex-1">{label}</span>
      {count != null ? <span className="text-xs text-ink/40">({count})</span> : null}
    </Link>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 py-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink">{title}</p>
      {children}
    </div>
  );
}

function TruncatedList({ items }: { items: React.ReactNode[] }) {
  const t = useTranslations("shop");
  const [open, setOpen] = useState(false);
  const shown = open ? items : items.slice(0, 5);
  const extra = items.length - 5;
  return (
    <div>
      {shown}
      {extra > 0 ? (
        <button
          type="button"
          className="mt-1 flex items-center gap-1 text-xs text-gold"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t("showLess") : `${extra} ${t("more")}`}
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      ) : null}
    </div>
  );
}

export function ShopFilters({
  locale,
  query,
  categories,
  collections,
  metalCounts,
  priceCounts,
  weightCounts,
}: {
  locale: string;
  query: ShopQuery;
  categories: FacetItem[];
  collections: FacetItem[];
  metalCounts: Record<string, number>;
  priceCounts: Record<string, number>;
  weightCounts: Record<string, number>;
}) {
  const t = useTranslations("shop");
  const [drawer, setDrawer] = useState(false);

  const body = (
    <>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold tracking-[0.12em] uppercase text-ink">{t("filters")}</p>
        <Link href={`/${locale}/shop`} className="text-xs text-gold hover:underline">
          {t("clearAll")}
        </Link>
      </div>

      <FilterGroup title={t("productType")}>
        <TruncatedList
          items={categories.map((c) => (
            <CheckRow
              key={c.slug}
              checked={query.category === c.slug}
              href={hrefWith(locale, query, {
                category: query.category === c.slug ? undefined : c.slug,
              })}
              label={c.name}
              count={c.count}
            />
          ))}
        />
      </FilterGroup>

      <FilterGroup title={t("collections")}>
        <TruncatedList
          items={collections.map((c) => (
            <CheckRow
              key={c.slug}
              checked={query.collection === c.slug}
              href={hrefWith(locale, query, {
                collection: query.collection === c.slug ? undefined : c.slug,
              })}
              label={c.name}
              count={c.count}
            />
          ))}
        />
      </FilterGroup>

      <FilterGroup title={t("material")}>
        {METALS.map((m) => (
          <Link
            key={m.slug}
            href={hrefWith(locale, query, {
              metal: query.metal === m.slug ? undefined : m.slug,
            })}
            className="flex items-center gap-2 py-1.5 text-sm text-ink/75 hover:text-ink"
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                query.metal === m.slug ? "border-gold bg-gold" : "border-black/25 bg-white"
              }`}
            />
            <span className="h-3 w-3 rounded-full border border-black/15" style={{ background: m.swatch }} />
            <span className="flex-1">{m.slug}</span>
            <span className="text-xs text-ink/40">({metalCounts[m.slug] || 0})</span>
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup title={t("price")}>
        {PRICE_BUCKETS.map((b) => {
          const active =
            (query.minPriceUsd || "") === (b.min || "") &&
            (query.maxPriceUsd || "") === (b.max || "");
          return (
            <CheckRow
              key={b.key}
              checked={active}
              href={hrefWith(locale, query, {
                minPriceUsd: active ? undefined : b.min,
                maxPriceUsd: active ? undefined : b.max,
              })}
              label={t(b.labelKey)}
              count={priceCounts[b.key] || 0}
            />
          );
        })}
      </FilterGroup>

      <FilterGroup title={t("weight")}>
        {WEIGHT_BUCKETS.map((b) => {
          const active =
            (query.minWeight || "") === (b.min || "") &&
            (query.maxWeight || "") === (b.max || "");
          return (
            <CheckRow
              key={b.key}
              checked={active}
              href={hrefWith(locale, query, {
                minWeight: active ? undefined : b.min,
                maxWeight: active ? undefined : b.max,
              })}
              label={b.label}
              count={weightCounts[b.key] || 0}
            />
          );
        })}
      </FilterGroup>
    </>
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          className="btn-ghost px-4 py-2 text-sm"
          onClick={() => setDrawer(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters")}
        </button>
        <SortSelect locale={locale} query={query} />
      </div>

      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:self-start lg:sticky lg:top-36">
        {body}
      </aside>

      {drawer ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={t("clearAll")}
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,90vw)] overflow-y-auto bg-[#fbf8f1] px-5 py-6 shadow-xl">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {body}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SortSelect({ locale, query }: { locale: string; query: ShopQuery }) {
  const t = useTranslations("shop");
  return (
    <form action={`/${locale}/shop`} method="get" className="flex items-center gap-2 text-sm">
      {query.category ? <input type="hidden" name="category" value={query.category} /> : null}
      {query.collection ? <input type="hidden" name="collection" value={query.collection} /> : null}
      {query.metal ? <input type="hidden" name="metal" value={query.metal} /> : null}
      {query.minPriceUsd ? <input type="hidden" name="minPriceUsd" value={query.minPriceUsd} /> : null}
      {query.maxPriceUsd ? <input type="hidden" name="maxPriceUsd" value={query.maxPriceUsd} /> : null}
      {query.minWeight ? <input type="hidden" name="minWeight" value={query.minWeight} /> : null}
      {query.maxWeight ? <input type="hidden" name="maxWeight" value={query.maxWeight} /> : null}
      {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
      <label className="text-ink/50">{t("sort")}:</label>
      <select
        name="sort"
        defaultValue={query.sort || "popular"}
        className="border border-black/15 bg-white/70 px-2 py-1.5"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        <option value="popular">{t("sortFeatured")}</option>
        <option value="newest">{t("sortNewest")}</option>
        <option value="price_asc">{t("sortPriceAsc")}</option>
        <option value="price_desc">{t("sortPriceDesc")}</option>
      </select>
    </form>
  );
}

export function ShopChips({
  locale,
  query,
  categories,
  collections,
}: {
  locale: string;
  query: ShopQuery;
  categories: FacetItem[];
  collections: FacetItem[];
}) {
  const t = useTranslations("shop");
  const chips: Array<{ label: string; href: string }> = [];
  const cat = categories.find((c) => c.slug === query.category);
  if (cat) {
    chips.push({ label: cat.name, href: hrefWith(locale, query, { category: undefined }) });
  }
  const col = collections.find((c) => c.slug === query.collection);
  if (col) {
    chips.push({ label: col.name, href: hrefWith(locale, query, { collection: undefined }) });
  }
  if (query.metal) {
    chips.push({ label: query.metal, href: hrefWith(locale, query, { metal: undefined }) });
  }
  const price = PRICE_BUCKETS.find(
    (b) => (b.min || "") === (query.minPriceUsd || "") && (b.max || "") === (query.maxPriceUsd || ""),
  );
  if (price) {
    chips.push({
      label: t(price.labelKey),
      href: hrefWith(locale, query, { minPriceUsd: undefined, maxPriceUsd: undefined }),
    });
  }
  const weight = WEIGHT_BUCKETS.find(
    (b) => (b.min || "") === (query.minWeight || "") && (b.max || "") === (query.maxWeight || ""),
  );
  if (weight) {
    chips.push({
      label: weight.label,
      href: hrefWith(locale, query, { minWeight: undefined, maxWeight: undefined }),
    });
  }
  if (!chips.length) return null;
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className="inline-flex items-center gap-1.5 border border-ink/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.12em]"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </Link>
      ))}
    </div>
  );
}
