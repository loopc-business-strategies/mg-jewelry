import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-black/10">
      <div className="gold-line" />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="font-display text-3xl tracking-[0.2em]">MG</div>
          <p className="mt-2 max-w-md text-sm text-ink/65">
            {t("tagline")} — {t("footer.showroom")}
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-ink/50">
          © {year} {t("brand")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
