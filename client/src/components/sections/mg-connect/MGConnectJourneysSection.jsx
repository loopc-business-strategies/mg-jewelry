import { Link } from 'react-router-dom';
import { Users, Globe2, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

function JourneyCard({ icon: Icon, eyebrow, title, description, steps, ctaTo, ctaLabel, variant }) {
  return (
    <div className={`mg-connect-journey-card mg-connect-journey-card--${variant} bg-white rounded-2xl border border-border p-8 md:p-10 shadow-[var(--shadow-soft)]`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-cream border border-border flex items-center justify-center">
          <Icon size={20} className="text-gold" strokeWidth={1.5} />
        </div>
        <p className="type-micro">{eyebrow}</p>
      </div>
      <h3 className="type-section-title mb-3">{title}</h3>
      <p className="type-section-desc mb-8">{description}</p>
      <ol className="space-y-3 mb-8">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2 type-body-sm text-charcoal">
            <span className="w-6 h-6 rounded-full bg-cream border border-border flex items-center justify-center text-[10px] font-semibold text-gold shrink-0">
              {i + 1}
            </span>
            <span className="flex-1">{step}</span>
            {i < steps.length - 1 && (
              <ChevronRight size={14} className="text-muted shrink-0 hidden sm:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <Link to={ctaTo} className={variant === 'sell' ? 'btn-primary-gold' : 'btn-outline-gold'}>
        {ctaLabel}
      </Link>
    </div>
  );
}

export default function MGConnectJourneysSection() {
  const { t } = useTranslation();

  return (
    <section className="section-cream py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14 max-w-[700px] mx-auto">
          <h2 className="type-section-title mb-4">{t('mgConnect.journeys.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <JourneyCard
            variant="sell"
            icon={Users}
            eyebrow={t('mgConnect.journeys.sell.eyebrow')}
            title={t('mgConnect.journeys.sell.title')}
            description={t('mgConnect.journeys.sell.description')}
            steps={t('mgConnect.journeys.sell.steps')}
            ctaTo="/gold-buying"
            ctaLabel={t('mgConnect.journeys.sell.cta')}
          />
          <JourneyCard
            variant="buy"
            icon={Globe2}
            eyebrow={t('mgConnect.journeys.buy.eyebrow')}
            title={t('mgConnect.journeys.buy.title')}
            description={t('mgConnect.journeys.buy.description')}
            steps={t('mgConnect.journeys.buy.steps')}
            ctaTo="/wholesale/register"
            ctaLabel={t('mgConnect.journeys.buy.cta')}
          />
        </div>
      </div>
    </section>
  );
}
