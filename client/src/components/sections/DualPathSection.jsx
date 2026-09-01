import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useTranslation } from '../../hooks/useTranslation';

export default function DualPathSection() {
  const { t } = useTranslation();
  const goldSteps = t('steps.goldBuying');
  const buyerSteps = t('steps.buyerJourney');

  return (
    <section className="section-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <p className="section-eyebrow mb-3">{t('dualPath.eyebrow')}</p>
          <h2 className="headline-corporate headline-corporate-light">
            {t('dualPath.title')}
          </h2>
          <p className="text-off-white/60 max-w-3xl mx-auto mt-6 text-sm md:text-base leading-relaxed">
            {t('dualPath.oppositeModel')}
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6">
          <ScrollReveal>
            <div className="dual-path-panel dual-path-panel-dark h-full">
              <p className="section-eyebrow text-gold mb-3">{t('dualPath.localEyebrow')}</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-off-white mb-4">
                {t('dualPath.localTitle')}
              </h3>
              <p className="text-off-white/70 mb-8 max-w-md">
                {t('dualPath.localDesc')}
              </p>
              <ol className="space-y-3 mb-10">
                {(Array.isArray(goldSteps) ? goldSteps : []).map((step, i) => (
                  <li key={step} className="process-step">
                    <span className="process-step-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-off-white/80 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <Link to="/gold-buying" className="btn-gold-solid">
                {t('cta.startSelling')} <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="dual-path-panel dual-path-panel-dark h-full border-gold/25">
              <p className="section-eyebrow text-gold mb-3">{t('dualPath.intlEyebrow')}</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-off-white mb-4">
                {t('dualPath.intlTitle')}
              </h3>
              <p className="text-off-white/70 mb-8 max-w-md">
                {t('dualPath.intlDesc')}
              </p>
              <ol className="space-y-3 mb-10">
                {(Array.isArray(buyerSteps) ? buyerSteps : []).map((step, i) => (
                  <li key={step} className="process-step">
                    <span className="process-step-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-off-white/80 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <Link to="/buyers/register" className="btn-gold-outline btn-gold-outline-light">
                {t('cta.becomeBuyer')} <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
