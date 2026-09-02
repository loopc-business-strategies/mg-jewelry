import PhoneMockup from '../../mg-connect/PhoneMockup';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectExperienceSection() {
  const { t } = useTranslation();

  return (
    <section className="section-cream py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12 max-w-[600px] mx-auto">
          <h2 className="type-section-title mb-4">{t('mgConnect.experience.title')}</h2>
          <p className="type-section-desc">{t('mgConnect.experience.description')}</p>
        </div>

        <div className="mg-connect-experience-cluster relative mx-auto max-w-3xl h-[420px] md:h-[480px]">
          <PhoneMockup
            screen="home"
            placeholderNumber="02"
            placeholderName="Home"
            className="mg-connect-experience-phone mg-connect-experience-phone--main"
          />
          <PhoneMockup
            screen="products"
            placeholderNumber="03"
            placeholderName="Products"
            className="mg-connect-experience-phone mg-connect-experience-phone--sm mg-connect-experience-phone--left"
          />
          <PhoneMockup
            screen="profile"
            placeholderNumber="05"
            placeholderName="Profile"
            className="mg-connect-experience-phone mg-connect-experience-phone--sm mg-connect-experience-phone--right"
          />
        </div>
      </div>
    </section>
  );
}
