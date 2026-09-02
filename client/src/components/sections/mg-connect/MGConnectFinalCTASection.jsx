import PhoneMockup from '../../mg-connect/PhoneMockup';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectFinalCTASection() {
  const { t } = useTranslation();

  return (
    <section className="section-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <h2 className="type-section-title mb-4">{t('mgConnect.final.title')}</h2>
          <p className="type-section-desc mb-8 max-w-md mx-auto lg:mx-0">{t('mgConnect.final.description')}</p>
          <a href="#download" className="btn-primary-gold">
            {t('mgConnect.final.cta')}
          </a>
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
