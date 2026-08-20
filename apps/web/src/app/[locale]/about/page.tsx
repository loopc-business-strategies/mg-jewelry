import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("body").slice(0, 160),
    openGraph: { title: t("title"), description: t("body").slice(0, 160) },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-8 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("title")}</h1>
      <p className="mt-8 text-lg leading-relaxed text-ink/75">{t("body")}</p>
      <div
        className="mt-12 min-h-[360px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1617038260897-41db1bdb2e87?auto=format&fit=crop&w=1600&q=80)",
        }}
      />
    </div>
  );
}
