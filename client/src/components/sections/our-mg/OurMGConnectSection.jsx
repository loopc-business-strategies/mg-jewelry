import { useTranslation } from '../../../hooks/useTranslation';

function JourneySteps({ title, steps }) {
  return (
    <div className="our-mg-connect-split__panel">
      <h3 className="type-body-sm font-semibold tracking-wide text-gold mb-4">{title}</h3>
      <ol className="our-mg-connect-split__steps">
        {steps.map((step, i) => (
          <li key={step} className="our-mg-connect-split__step">
            {i > 0 && <span className="our-mg-connect-split__arrow" aria-hidden="true">→</span>}
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function OurMGConnectSection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-16 md:py-20 px-4 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <p className="section-eyebrow">{t('ourMg.connect.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.connect.title')}</h2>
        </div>
        <div className="our-mg-connect-split">
          <JourneySteps title={t('ourMg.connect.buyTitle')} steps={t('ourMg.connect.buySteps')} />
          <div className="our-mg-connect-split__hub">
            <span className="type-body-sm font-semibold tracking-wide">Our MG</span>
          </div>
          <JourneySteps title={t('ourMg.connect.sellTitle')} steps={t('ourMg.connect.sellSteps')} />
        </div>
      </div>
    </section>
  );
}
