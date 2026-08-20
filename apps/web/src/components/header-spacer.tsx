"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function HeaderSpacer() {
  const locale = useLocale();
  const pathname = usePathname();
  const onHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  if (onHome) return null;
  return <div className="h-[7.5rem] shrink-0 sm:h-[8.25rem]" aria-hidden />;
}
