"use client";

import { useTranslations } from "next-intl";

export function PromoTicker({ light }: { light?: boolean }) {
  const t = useTranslations("ticker");
  const items = [t("shipping"), t("showroom"), t("appointments")];
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`overflow-hidden border-b ${
        light
          ? "border-white/15 bg-black/25 text-gold-soft"
          : "border-gold/30 bg-[#111]/95 text-gold-soft"
      }`}
    >
      <div className="promo-ticker-track gap-8 py-1.5 text-[10px] uppercase tracking-[0.28em] sm:text-[11px]">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8">
            {item}
            <span aria-hidden className="text-gold">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
