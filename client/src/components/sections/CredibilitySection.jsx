import { brand, credibilityPoints } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function CredibilitySection() {
  const { t } = useTranslation();
  const points = t('credibility.points');

  return (
    <section className="py-16 px-4 bg-cream border-b border-gold/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-2">{t('credibility.eyebrow')}</p>
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-2">{t('credibility.title')}</h2>
          <p className="text-sm text-muted">{brand.legalName} · {brand.location}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.isArray(points) ? points : credibilityPoints).map((point) => (
            <div key={point.title} className="p-5 bg-white border border-gold/10 rounded-xl text-center">
              <h3 className="font-display text-lg text-charcoal mb-2">{point.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
        <address className="mt-8 text-center text-sm text-muted not-italic">
          {brand.addressLines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </address>
      </div>
    </section>
  );
}
