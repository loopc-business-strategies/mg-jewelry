import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../SafeImage';
import { goldBuyingSteps, buyerJourneySteps } from '../../utils/brandConfig';
import { dualPathImages } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

function DualPathCard({ image, imageAlt, eyebrow, title, description, steps, ctaTo, ctaLabel, ctaClass }) {
  return (
    <div className="dual-path-card flex flex-col overflow-hidden rounded-xl border border-border shadow-sm bg-white">
      <div className="relative h-44 md:h-52 shrink-0 overflow-hidden">
        <SafeImage
          src={image}
          alt={imageAlt}
          disableFallback
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/40 to-transparent" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <p className="section-eyebrow mb-2">{eyebrow}</p>
        <h3 className="text-2xl font-semibold text-charcoal mb-3">{title}</h3>
        <p className="text-muted text-sm mb-6">{description}</p>
        <ol className="space-y-2 mb-8 flex-1">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-charcoal">
              <span className="text-gold font-semibold shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <Link to={ctaTo} className={`${ctaClass} text-xs w-fit`}>
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
    <section className="section-cream py-20 px-4 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-eyebrow mb-3">{t('dualPath.eyebrow')}</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-charcoal mb-4">{t('dualPath.title')}</h2>
          <p className="text-muted text-sm md:text-base leading-relaxed">
            {t('dualPath.oppositeModel')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
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
