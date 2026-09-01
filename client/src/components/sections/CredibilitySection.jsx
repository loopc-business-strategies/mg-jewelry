import { brand, credibilityPoints } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function CredibilitySection() {
  const { t } = useTranslation();
  const points = t('credibility.points');

  return (
    <section className="section-white py-16 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-2">{t('credibility.eyebrow')}</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-charcoal mb-2">{t('credibility.title')}</h2>
          <p className="text-sm text-muted">{brand.legalName} · {brand.location}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border border border-border rounded-xl overflow-hidden">
          {(Array.isArray(points) ? points : credibilityPoints).map((point, i) => (
            <div key={point.title} className="p-5 bg-white text-center">
              <p className="text-2xl font-semibold text-gold mb-2">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="text-lg font-semibold text-charcoal mb-2">{point.title}</h3>
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
