import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import { BrandMark } from "@/components/brand-mark";

export async function SiteFooter() {
  const t = await getTranslations();
  const locale = await getLocale();
  const year = new Date().getFullYear();
  let showroom: Record<string, string> = {};
  let logoUrl = "";
  try {
    const settings = await api.publicSettings();
    showroom = (settings.showroom as Record<string, string>) || {};
    const brand = (settings.brand as Record<string, string>) || {};
    logoUrl = brand.logoUrl || "";
  } catch {
    showroom = {};
  }

  return (
    <footer className="mt-24 border-t border-black/10">
      <div className="gold-line" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
        <div>
          <BrandMark size="footer" src={logoUrl} />
          <p className="mt-2 max-w-md text-sm text-ink/65">
            {t("tagline")} — {t("footer.showroom")}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-ink/50">
            © {year} {t("brand")}. {t("footer.rights")}
          </p>
        </div>
        <div className="text-sm text-ink/65">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
            {t("footer.explore")}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href={`/${locale}/shop`} className="hover:text-ink">
              {t("nav.shop")}
            </Link>
            <Link href={`/${locale}/ecommerce`} className="hover:text-ink">
              {t("nav.ecommerce")}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-ink">
              {t("nav.contact")}
            </Link>
            <Link href={`/${locale}/appointments`} className="hover:text-ink">
              {t("nav.book")}
            </Link>
          </div>
        </div>
        <div className="text-sm text-ink/65">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
            {t("footer.trust")}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href={`/${locale}/privacy`} className="hover:text-ink">
              {t("footer.privacy")}
            </Link>
            <Link href={`/${locale}/offer`} className="hover:text-ink">
              {t("footer.offer")}
            </Link>
            {showroom.telegram ? (
              <span>Telegram {showroom.telegram}</span>
            ) : null}
            {showroom.whatsapp ? (
              <span>WhatsApp {showroom.whatsapp}</span>
            ) : null}
            {showroom.email ? <span>{showroom.email}</span> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
