import PhoneMockup from '../../mg-connect/PhoneMockup';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectAboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about-the-app" className="section-cream py-16 md:py-20 px-4 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="section-eyebrow">{t('mgConnect.about.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('mgConnect.about.title')}</h2>
          <p className="type-section-desc mb-6">{t('mgConnect.about.description')}</p>
          <span className="inline-block type-micro text-gold font-semibold tracking-wider px-3 py-1.5 rounded-full border border-gold/30 bg-white">
            {t('mgConnect.about.badge')}
          </span>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PhoneMockup
            screen="home"
            placeholderNumber="02"
            placeholderName="Home"
            className="mg-connect-phone-large"
          />
        </div>
      </div>
    </section>
  );
}
