import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("offerTitle")}</h1>
      <div className="mt-10 space-y-6 text-ink/75 leading-relaxed">
        <p>{t("offerIntro")}</p>
        <section>
          <h2 className="font-display text-2xl text-ink">{t("offerGoods")}</h2>
          <p className="mt-3">{t("offerGoodsBody")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">{t("offerOrders")}</h2>
          <p className="mt-3">{t("offerOrdersBody")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">{t("offerReturns")}</h2>
          <p className="mt-3">{t("offerReturnsBody")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">{t("offerSeller")}</h2>
          <p className="mt-3">{t("offerSellerBody")}</p>
        </section>
      </div>
    </div>
  );
}
