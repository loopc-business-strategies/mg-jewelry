import { Link } from 'react-router-dom';
import { brand } from '../../utils/brandConfig';
import { aboutHero } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';
import { useTranslation } from '../../hooks/useTranslation';

export default function AboutPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="section-cream py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="section-eyebrow">{t('home.aboutPreview.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('home.aboutPreview.title')}</h2>
          <p className="type-body mb-4 prose-section">
            {t('home.aboutPreview.p1').replace('Modern Gold Jewelry Manufacturing FE LLC', brand.legalName) || `${brand.legalName} is a jewelry manufacturing company based in Namangan, Uzbekistan, focused on creating quality jewelry products for international markets.`}
          </p>
          <p className="type-body mb-6 prose-section">
            {t('home.aboutPreview.p2')}
          </p>
          <Link to="/about" className="type-body-sm font-medium text-gold hover:underline">{t('home.aboutPreview.link')}</Link>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
          <SafeImage src={aboutHero} alt="Woman wearing ornate gold jewelry — Modern Gold Jewelry editorial" className="w-full aspect-[4/3] object-cover" />
        </div>
      </div>
    </section>
  );
}
