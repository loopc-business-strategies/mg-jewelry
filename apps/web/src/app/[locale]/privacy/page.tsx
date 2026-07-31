import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("privacyTitle")}</h1>
      <div className="mt-10 space-y-6 text-ink/75 leading-relaxed">
        <p>{t("privacyIntro")}</p>
        <section>
          <h2 className="font-display text-2xl text-ink">{t("privacyCollect")}</h2>
          <p className="mt-3">{t("privacyCollectBody")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">{t("privacyUse")}</h2>
          <p className="mt-3">{t("privacyUseBody")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">{t("privacyContact")}</h2>
          <p className="mt-3">{t("privacyContactBody")}</p>
        </section>
      </div>
    </div>
  );
}
