import PhoneMockup from '../../our-mg/PhoneMockup';
import { ourMgShowcaseScreens } from '../../../utils/imageConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGShowcaseSection() {
  const { t } = useTranslation();
  const labels = t('ourMg.showcase.labels');
  const screenNames = t('ourMg.showcase.screenNames');

  return (
    <section className="section-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <p className="section-eyebrow">{t('ourMg.showcase.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.showcase.title')}</h2>
        </div>
        <div className="our-mg-showcase-grid">
          {ourMgShowcaseScreens.map((screen) => (
            <div key={screen.id} className="our-mg-showcase-step">
              <PhoneMockup
                screen={screen.id}
                placeholderNumber={screen.number}
                placeholderName={screenNames[screen.id]}
              />
              <p className="type-body-sm font-medium text-charcoal mt-4 text-center">
                {labels[screen.labelKey]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
