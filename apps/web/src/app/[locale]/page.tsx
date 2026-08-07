import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/product-card";
import { HeroMotion } from "@/components/hero-motion";
import { api } from "@/lib/api";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  let products: Awaited<ReturnType<typeof api.products>>["items"] = [];
  let collections: Awaited<ReturnType<typeof api.collections>> = [];
  let brand: Record<string, string> = {};
  try {
    const [p, c, settings] = await Promise.all([
      api.products(locale, "&pageSize=8"),
      api.collections(locale),
      api.publicSettings(),
    ]);
    products = p.items;
    collections = c;
    brand = (settings.brand as Record<string, string>) || {};
  } catch {
    products = [];
    collections = [];
  }
  const heroImage =
    brand.heroImageUrl ||
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80";
  const heroTitle = brand.heroHeadline || t("hero.title");
  const heroSubtitle = brand.heroTagline || t("hero.subtitle");

  const bestsellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newest = products.filter((p) => p.isNewArrival).slice(0, 4);
  const featuredCollections = collections.filter((c) => c.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JewelryStore",
            name: "MG Jewelry",
            alternateName: "Modern Gold Jewelry Manufacturing",
            description: "Hearts of Namangan — luxury gold jewelry from Namangan, Uzbekistan.",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://mg-jewelry.vercel.app",
            address: {
              "@type": "PostalAddress",
              streetAddress: "242, Girvonbulok Street, Davlatabad District",
              addressLocality: "Namangan City",
              addressRegion: "Namangan Region",
              addressCountry: "UZ",
            },
          }),
        }}
      />
      <section className="relative min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-32 md:px-8 md:pb-28">
          <HeroMotion>
            <p className="mb-4 text-xs uppercase tracking-[0.45em] text-gold-soft">
              Namangan · Worldwide
            </p>
            <h1 className="font-display max-w-3xl text-5xl leading-[0.95] text-white md:text-7xl lg:text-8xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
              {heroSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`/${locale}/shop`} className="btn-primary border-white bg-white text-ink">
                {t("hero.ctaShop")}
              </Link>
              <Link
                href={`/${locale}/appointments`}
                className="btn-ghost border-white/40 text-white hover:border-gold hover:bg-white/5"
              >
                {t("hero.ctaVisit")}
              </Link>
            </div>
          </HeroMotion>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl md:text-5xl">{t("home.featured")}</h2>
          <Link href={`/${locale}/collections`} className="text-sm tracking-wide text-ink/60">
            {t("nav.collections")}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredCollections.map((collection) => (
            <Link
              key={collection.id}
              href={`/${locale}/shop?collection=${collection.slug}`}
              className="group relative min-h-[320px] overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${collection.imageUrl || "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1400&q=80"})`,
                }}
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="relative flex h-full min-h-[320px] flex-col justify-end p-8 text-white">
                <h3 className="font-display text-3xl">{collection.name}</h3>
                <p className="mt-2 max-w-md text-sm text-white/75">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <h2 className="font-display mb-10 text-4xl md:text-5xl">{t("home.bestsellers")}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(bestsellers.length ? bestsellers : products.slice(0, 4)).map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <h2 className="font-display mb-10 text-4xl md:text-5xl">{t("home.newArrivals")}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(newest.length ? newest : products.slice(0, 4)).map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div
            className="min-h-[360px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1617038260897-41db1bdb2e87?auto=format&fit=crop&w=1400&q=80)",
            }}
          />
          <div>
            <h2 className="font-display text-4xl md:text-5xl">{t("home.showroomTitle")}</h2>
            <p className="mt-5 text-ink/70">{t("home.showroomText")}</p>
            <Link href={`/${locale}/appointments`} className="btn-primary mt-8">
              {t("hero.ctaVisit")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-white/30 px-5 py-16 md:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">
            {t("home.newsletter")}
          </h2>
          <p className="mt-3 text-sm text-ink/60">
            Private atelier notes — contact us to join the list.
          </p>
          <Link href={`/${locale}/contact`} className="btn-primary mt-8">
            {t("home.newsletterCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
