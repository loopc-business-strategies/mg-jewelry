import SEOHead from '../components/SEOHead';
import OurManufacturingSection from '../components/sections/OurManufacturingSection';
import OurPresenceSection from '../components/sections/OurPresenceSection';
import { brand, trustIndicators } from '../utils/brandConfig';
import { aboutBanner } from '../utils/imageConfig';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import { useTranslation } from '../hooks/useTranslation';
import { ShieldCheck, Building2, Factory, Globe2 } from 'lucide-react';

const TRUST_ICONS = [ShieldCheck, Building2, Factory, Globe2];

export default function AboutPage() {
  const { t } = useTranslation();
  const offers = t('about.offers') || [];
  const trustPoints = t('credibility.points') || trustIndicators.slice(0, 4);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.legalName,
    alternateName: brand.name,
    description: t('brand.tagline'),
    url: brand.siteUrl,
    logo: `${brand.siteUrl}${brand.logo}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '242 Girvonbulok Street',
      addressLocality: 'Namangan Davlatabad',
      addressRegion: 'Namangan',
      addressCountry: 'UZ',
    },
  };

  return (
    <>
      <SEOHead title={t('seo.aboutTitle')} description={t('seo.aboutDesc')} path="/about" schema={schema} />

      <div className="relative h-64 md:h-80 overflow-hidden bg-white">
        <SafeImage src={aboutBanner} alt={t('alts.aboutBanner')} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-pearl/85 to-cream/50 flex items-center justify-center px-4">
          <h1 className="headline-editorial text-center">{t('about.hero')}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12 prose-content">
        <section id="story">
          <h2 className="mb-4">{t('about.storyTitle')}</h2>
          <p className="type-body mb-4">
            {t('about.storyP1').replace('Modern Gold Jewelry Manufacturing FE LLC', brand.legalName)}
          </p>
          <p className="type-body">
            {t('about.storyP2')}
          </p>
        </section>

        <section>
          <h2 className="mb-4">{t('about.howTitle')}</h2>
          <p className="type-body mb-4">
            {t('dualPath.oppositeModel')}
          </p>
          <p className="type-body mb-4">
            {t('about.howP')}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/gold-buying" className="btn-primary-gold">{t('cta.sellGold')}</Link>
            <Link to="/wholesale/register" className="btn-outline-gold">{t('cta.becomePartner')}</Link>
          </div>
        </section>

        <section>
          <h2 className="mb-4">{t('about.missionTitle')}</h2>
          <p className="type-body mb-4">
            <strong className="text-charcoal font-semibold">{t('ui.mission')}</strong> {t('about.mission')}
          </p>
          <p className="type-body">
            <strong className="text-charcoal font-semibold">{t('ui.vision')}</strong> {t('about.vision')}
          </p>
        </section>

        <section>
          <h2 className="mb-6">{t('about.offerTitle')}</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {Array.isArray(offers) && offers.map((item) => (
              <li key={item} className="flex items-center gap-2 type-body-sm">
                <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <OurManufacturingSection />

      <OurPresenceSection />

      <section className="trust-section py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <p className="section-eyebrow">{t('credibility.eyebrow')}</p>
            <h2 className="type-section-title">{t('about.trustTitle')}</h2>
            <div className="presence-gradient-accent w-14 h-1 rounded-full mx-auto mt-4" />
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {Array.isArray(trustPoints) && trustPoints.slice(0, 4).map(({ title, desc }, i) => {
              const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <article key={title} className="trust-card group">
                  <span className="trust-card-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="trust-card-icon">
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <h3 className="type-card-title mb-2">{title}</h3>
                  <p className="type-body-sm">{desc}</p>
                </article>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/custom-jewelry" className="type-body-sm font-medium text-charcoal hover:text-gold transition-colors">{t('about.customLink')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
