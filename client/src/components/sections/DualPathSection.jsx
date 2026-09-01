import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { goldBuyingSteps, buyerJourneySteps } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

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
          <div className="p-8 bg-white border border-border rounded-xl shadow-sm">
            <p className="section-eyebrow mb-2">{t('dualPath.localEyebrow')}</p>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">{t('dualPath.localTitle')}</h3>
            <p className="text-muted text-sm mb-6">{t('dualPath.localDesc')}</p>
            <ol className="space-y-2 mb-8">
              {(Array.isArray(localSteps) ? localSteps : goldBuyingSteps).slice(0, 6).map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-charcoal">
                  <span className="text-gold font-semibold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Link to="/gold-buying" className="btn-primary-gold text-xs">
              {t('cta.sellGold')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-8 bg-white border border-border rounded-xl shadow-sm">
            <p className="section-eyebrow mb-2">{t('dualPath.intlEyebrow')}</p>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">{t('dualPath.intlTitle')}</h3>
            <p className="text-muted text-sm mb-6">{t('dualPath.intlDesc')}</p>
            <ol className="space-y-2 mb-8">
              {(Array.isArray(buyerSteps) ? buyerSteps : buyerJourneySteps).map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-charcoal">
                  <span className="text-gold font-semibold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Link to="/wholesale/register" className="btn-outline-gold text-xs">
              {t('cta.becomePartner')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
