import { MapPin } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGCollectionCentersSection() {
  const { t } = useTranslation();
  const journey = t('ourMg.collectionCenters.journey');

  return (
    <section className="section-white py-16 md:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="section-eyebrow">{t('ourMg.collectionCenters.eyebrow')}</p>
        <h2 className="type-section-title mb-4">{t('ourMg.collectionCenters.title')}</h2>
        <p className="type-section-desc prose-section mx-auto mb-10">{t('ourMg.collectionCenters.description')}</p>

        <div className="our-mg-journey-stack">
          {journey.map((step, i) => (
            <div key={step.label}>
              <div className="our-mg-journey-stack__node">
                {i === 2 && <MapPin size={20} className="text-gold mb-1" aria-hidden="true" />}
                <span className="type-body-sm font-semibold tracking-wide text-charcoal">{step.label}</span>
                {step.desc && (
                  <p className="type-body-sm text-muted mt-1">{step.desc}</p>
                )}
              </div>
              {i < journey.length - 1 && (
                <div className="our-mg-journey-stack__arrow" aria-hidden="true">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
