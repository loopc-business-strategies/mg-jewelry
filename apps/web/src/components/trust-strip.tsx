"use client";

import { Globe, RotateCcw, Store, Video } from "lucide-react";
import { useTranslations } from "next-intl";

const items = [
  { title: "shippingTitle" as const, body: "shippingBody" as const, Icon: Globe },
  { title: "showroomTitle" as const, body: "showroomBody" as const, Icon: Store },
  { title: "consultTitle" as const, body: "consultBody" as const, Icon: Video },
  { title: "returnsTitle" as const, body: "returnsBody" as const, Icon: RotateCcw },
];

export function TrustStrip() {
  const t = useTranslations("trust");

  return (
    <section className="border-y border-black/10 bg-white/40">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        {items.map(({ title, body, Icon }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/80">{t(title)}</p>
              <p className="mt-1 text-sm text-ink/55">{t(body)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
