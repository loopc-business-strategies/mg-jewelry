import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';

function JourneyPanel({ title, description, steps, variant, ctaLabel, ctaTo, ctaClassName }) {
  return (
    <div className={`our-mg-connect-split__panel our-mg-connect-split__panel--${variant}`}>
      <h3 className="type-body-sm font-semibold tracking-wide text-gold mb-2">{title}</h3>
      <p className="type-body-sm text-muted mb-5">{description}</p>
      <ol className="our-mg-connect-split__steps">
        {steps.map((step, i) => (
          <li key={step} className="our-mg-connect-split__step">
            <span className="our-mg-connect-split__num">{String(i + 1).padStart(2, '0')}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <Link to={ctaTo} className={`${ctaClassName} inline-flex mt-6`}>
        {ctaLabel}
      </Link>
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
          <JourneyPanel
            variant="buy"
            title={t('ourMg.connect.buyTitle')}
            description={t('ourMg.connect.buyDesc')}
            steps={t('ourMg.connect.buySteps')}
            ctaLabel={t('ourMg.connect.buyCta')}
            ctaTo="/shop"
            ctaClassName="btn-primary-gold"
          />
          <div className="our-mg-connect-split__hub">
            <span className="type-body-sm font-semibold tracking-wide">Our MG</span>
          </div>
          <JourneyPanel
            variant="sell"
            title={t('ourMg.connect.sellTitle')}
            description={t('ourMg.connect.sellDesc')}
            steps={t('ourMg.connect.sellSteps')}
            ctaLabel={t('ourMg.connect.sellCta')}
            ctaTo="/gold-buying"
            ctaClassName="btn-outline-gold"
          />
        </div>
      </div>
    </section>
  );
}
