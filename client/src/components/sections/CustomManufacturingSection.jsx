import { Link } from 'react-router-dom';
import { customHero } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';
import { useTranslation } from '../../hooks/useTranslation';

export default function CustomManufacturingSection() {
  const { t } = useTranslation();
  const items = t('home.customManufacturing.items') || [];

  return (
    <section className="section-cream py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-xl border border-border order-2 lg:order-1">
          <SafeImage src={customHero} alt="Woman wearing luxury gold jewelry set — custom jewelry editorial" category="custom-jewelry" className="w-full aspect-[4/3] object-cover" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="section-eyebrow">{t('home.customManufacturing.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('home.customManufacturing.title')}</h2>
          <p className="type-body mb-6 prose-section">
            {t('home.customManufacturing.desc')}
          </p>
          <ul className="space-y-3 mb-8">
            {Array.isArray(items) && items.map((item) => (
              <li key={item} className="flex items-center gap-3 type-body-sm">
                <span className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-gold text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/custom-jewelry" className="inline-flex btn-outline-gold">
            {t('home.customManufacturing.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
