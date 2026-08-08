import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactPageClient } from "@/components/contact-page-client";
import { getPublicSettings } from "@/lib/cached-settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: "Contact MG Jewelry showroom in Namangan, Uzbekistan.",
    openGraph: { title: t("title") },
  };
}

const FALLBACK_SHOWROOM = {
  fullName: "Modern Gold Jewelry Manufacturing",
  address: "242, Girvonbulok Street",
  district: "Davlatabad District",
  city: "Namangan City",
  region: "Namangan Region",
  country: "Republic of Uzbekistan",
  telegram: "@mgjewelry",
  email: "hello@mgjewelry.uz",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getPublicSettings();
  const s = (settings.showroom as Record<string, string>) || {};
  const showroom: Record<string, string> = { ...FALLBACK_SHOWROOM, ...s };

  return (
    <Suspense fallback={<div className="px-5 pb-20 pt-28">…</div>}>
      <ContactPageClient showroom={showroom} />
    </Suspense>
  );
}
