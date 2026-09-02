import PhoneMockup from '../../our-mg/PhoneMockup';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGAboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="section-eyebrow">{t('ourMg.about.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.about.title')}</h2>
          <p className="type-section-desc prose-section mb-6">{t('ourMg.about.description')}</p>
          <p className="type-body font-medium text-charcoal">{t('ourMg.about.tagline')}</p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PhoneMockup
            screen="home"
            placeholderNumber="02"
            placeholderName="Home"
            large
          />
        </div>
      </div>
    </section>
  );
}
