import SEOHead from '../components/SEOHead';
import CustomManufacturingSection from '../components/sections/CustomManufacturingSection';
import B2BSection from '../components/sections/B2BSection';
import { brand } from '../utils/brandConfig';
import { customHero } from '../utils/imageConfig';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import { useTranslation } from '../hooks/useTranslation';

export default function CustomJewelryPage() {
  const { t } = useTranslation();
  const cards = t('customJewelry.cards') || [];

  return (
    <>
      <SEOHead
        title={t('customJewelry.seoTitle')}
        description={`${t('customJewelry.desc')} ${brand.legalName} in Uzbekistan.`}
        path="/custom-jewelry"
      />
      <section className="relative py-24 px-4 section-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-4">{t('customJewelry.title')}</h1>
          <p className="text-muted text-lg leading-relaxed">
            {t('customJewelry.desc')}
          </p>
        </div>
      </section>
      <CustomManufacturingSection />
      <section className="py-16 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {Array.isArray(cards) && cards.map((item) => (
          <div
            key={item.title}
            id={item.title === 'Private Label' ? 'private-label' : undefined}
            className="bg-white rounded-2xl p-8 border border-border"
          >
            <h2 className="font-semibold text-charcoal text-xl mb-2">{item.title}</h2>
            <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
      <div className="px-4 pb-16 max-w-7xl mx-auto">
        <SafeImage src={customHero} alt="Woman wearing luxury gold jewelry set — custom jewelry editorial" category="custom-jewelry" className="w-full rounded-2xl object-cover aspect-[21/9] border border-border" />
      </div>
      <B2BSection />
      <div className="text-center pb-16">
        <Link to="/contact?type=quote" className="btn-primary-gold text-xs">
          {t('customJewelry.cta')}
        </Link>
      </div>
    </>
  );
}
