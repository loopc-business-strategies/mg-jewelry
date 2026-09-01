import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../SafeImage';
import { goldBuyingSteps, buyerJourneySteps } from '../../utils/brandConfig';
import { dualPathImages } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

function DualPathCard({ image, imageAlt, eyebrow, title, description, steps, ctaTo, ctaLabel, ctaClass }) {
  return (
    <div className="dual-path-card flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]">
      <div className="relative h-52 md:h-64 shrink-0 overflow-hidden">
        <SafeImage
          src={image}
          alt={imageAlt}
          disableFallback
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-8 md:p-10 flex flex-col flex-1">
        <p className="dual-path-eyebrow mb-2">{eyebrow}</p>
        <h3 className="text-2xl md:text-[1.625rem] font-semibold text-charcoal mb-3">{title}</h3>
        <p className="text-muted text-sm mb-6">{description}</p>
        <ol className="space-y-2 mb-8 flex-1">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-charcoal">
              <span className="text-gold font-semibold shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <Link to={ctaTo} className={`${ctaClass} text-sm w-fit`}>
          {ctaLabel} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function DualPathSection() {
  const { t } = useTranslation();
  const localSteps = t('steps.goldBuying');
  const buyerSteps = t('steps.buyerJourney');

  return (
    <section className="dual-path-section py-20 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14 max-w-[700px] mx-auto">
          <p className="dual-path-eyebrow mb-3">{t('dualPath.eyebrow')}</p>
          <h2 className="text-4xl md:text-[2.5rem] font-semibold text-charcoal mb-4 leading-tight">
            {t('dualPath.title')}
          </h2>
          <p className="text-muted text-sm md:text-base leading-relaxed">
            {t('dualPath.oppositeModel')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <DualPathCard
            image={dualPathImages.sellGold}
            imageAlt="Local customer selling gold at a professional counter — demo photography"
            eyebrow={t('dualPath.localEyebrow')}
            title={t('dualPath.localTitle')}
            description={t('dualPath.localDesc')}
            steps={(Array.isArray(localSteps) ? localSteps : goldBuyingSteps).slice(0, 6)}
            ctaTo="/gold-buying"
            ctaLabel={t('cta.sellGold')}
            ctaClass="btn-primary-gold"
          />
          <DualPathCard
            image={dualPathImages.buyGold}
            imageAlt="International buyer sourcing gold jewellery — demo photography"
            eyebrow={t('dualPath.intlEyebrow')}
            title={t('dualPath.intlTitle')}
            description={t('dualPath.intlDesc')}
            steps={Array.isArray(buyerSteps) ? buyerSteps : buyerJourneySteps}
            ctaTo="/wholesale/register"
            ctaLabel={t('cta.becomePartner')}
            ctaClass="btn-outline-gold"
          />
        </div>
      </div>
    </section>
  );
}
