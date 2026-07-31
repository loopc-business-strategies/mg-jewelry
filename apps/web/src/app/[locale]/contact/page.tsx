import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("title")}</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-ink/75">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">
              {t("showroom")}
            </p>
            <p className="mt-2 text-lg">{t("city")}</p>
            <p>Modern Gold Jewelry — MG Jewelry</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">
              {t("telegram")}
            </p>
            <p className="mt-2">@mgjewelry</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">
              {t("email")}
            </p>
            <p className="mt-2">hello@mgjewelry.uz</p>
          </div>
          <Link href={`/${locale}/appointments`} className="btn-primary mt-4 inline-flex">
            {t("bookCta")}
          </Link>
        </div>
        <div
          className="min-h-[280px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80)",
          }}
        />
      </div>
    </div>
  );
}
