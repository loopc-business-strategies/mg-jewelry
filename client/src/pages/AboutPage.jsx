import SEOHead from '../components/SEOHead';
import OurManufacturingSection from '../components/sections/OurManufacturingSection';
import OurPresenceSection from '../components/sections/OurPresenceSection';
import { brand, trustIndicators } from '../utils/brandConfig';
import { aboutHero } from '../utils/imageConfig';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import { useTranslation } from '../hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();
  const offers = t('about.offers') || [];
  const trustPoints = t('credibility.points') || trustIndicators.slice(0, 3);

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
        <SafeImage src={aboutHero} alt="Woman wearing ornate gold jewelry — Modern Gold Jewelry editorial" className="w-full h-full object-cover" />
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
            <strong className="text-charcoal font-semibold">Mission:</strong> {t('about.mission')}
          </p>
          <p className="type-body">
            <strong className="text-charcoal font-semibold">Vision:</strong> {t('about.vision')}
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

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-12 prose-content">
        <section>
          <h2 className="mb-6">{t('about.trustTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Array.isArray(trustPoints) && trustPoints.slice(0, 3).map(({ title, desc }) => (
              <div key={title} className="text-center p-6 bg-cream rounded-xl border border-border">
                <h3 className="type-card-title mb-2">{title}</h3>
                <p className="type-body-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link to="/custom-jewelry" className="type-body-sm font-medium text-charcoal hover:text-gold transition-colors">{t('about.customLink')}</Link>
        </div>
      </div>
    </>
  );
}
