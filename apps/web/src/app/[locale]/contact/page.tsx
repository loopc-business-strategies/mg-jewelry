import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { api } from "@/lib/api";
import { ContactPageClient } from "@/components/contact-page-client";

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

  let showroom: Record<string, string> = FALLBACK_SHOWROOM;
  try {
    const settings = await api.publicSettings();
    const s = (settings.showroom as Record<string, string>) || {};
    showroom = { ...FALLBACK_SHOWROOM, ...s };
  } catch {
    // use fallback
  }

  return (
    <Suspense fallback={<div className="px-5 pb-20 pt-28">…</div>}>
      <ContactPageClient showroom={showroom} />
    </Suspense>
  );
}
