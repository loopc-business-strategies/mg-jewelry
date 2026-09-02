import PhoneMockup from '../../mg-connect/PhoneMockup';
import { mgConnectShowcaseSteps } from '../../../utils/imageConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectShowcaseSection() {
  const { t } = useTranslation();
  const steps = t('mgConnect.showcase.steps');
  const screenNames = t('mgConnect.showcase.screenNames');

  return (
    <section className="section-cream py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14 max-w-[700px] mx-auto">
          <p className="section-eyebrow">{t('mgConnect.showcase.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('mgConnect.showcase.title')}</h2>
        </div>

        <div className="mg-connect-showcase-grid">
          {mgConnectShowcaseSteps.map((step, i) => {
            const copy = steps[i];
            const screenName = screenNames[step.id];
            return (
              <div key={step.id} className="mg-connect-showcase-step">
                <PhoneMockup
                  screen={step.id}
                  placeholderNumber={step.number}
                  placeholderName={screenName}
                />
                <div className="mt-5 text-center md:text-left">
                  <p className="type-micro text-gold mb-1">{copy.number} — {copy.title}</p>
                  <p className="type-card-desc">{copy.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
