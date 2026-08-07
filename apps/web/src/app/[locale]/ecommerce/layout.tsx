import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecommerce" });
  return {
    title: t("title"),
    description: t("intro").slice(0, 160),
    openGraph: {
      title: t("title"),
      description: t("intro").slice(0, 160),
    },
  };
}

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
