import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function EcommercePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ecommerce");

  const paths = [
    { title: t("wholesaleTitle"), body: t("wholesaleBody") },
    { title: t("showroomTitle"), body: t("showroomBody") },
    { title: t("exportTitle"), body: t("exportBody") },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-28 md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ink/45">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-display text-5xl md:text-6xl">{t("title")}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75">
        {t("intro")}
      </p>

      <div
        className="mt-12 min-h-[320px] bg-cover bg-center md:min-h-[420px]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1800&q=80)",
        }}
      />

      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {paths.map((item) => (
          <div key={item.title}>
            <h2 className="font-display text-2xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap gap-4">
        <Link href={`/${locale}/contact`} className="btn-primary">
          {t("ctaInquire")}
        </Link>
        <Link href={`/${locale}/appointments`} className="btn-ghost px-6 py-3">
          {t("ctaBook")}
        </Link>
        <Link href={`/${locale}/shop`} className="btn-ghost px-6 py-3">
          {t("ctaShop")}
        </Link>
      </div>
    </div>
  );
}
