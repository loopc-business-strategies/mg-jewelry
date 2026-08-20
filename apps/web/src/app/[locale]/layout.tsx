import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LocaleLang } from "@/components/locale-lang";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { HeaderSpacer } from "@/components/header-spacer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleLang locale={locale} />
      <div className="luxury-grid min-h-screen pb-16 lg:pb-0">
        <SiteHeader />
        <HeaderSpacer />
        <main>{children}</main>
        <SiteFooter />
        <MobileTabBar />
      </div>
    </NextIntlClientProvider>
  );
}
