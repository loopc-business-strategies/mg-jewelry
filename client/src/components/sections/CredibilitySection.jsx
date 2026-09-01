import { brand, credibilityPoints } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function CredibilitySection() {
  const { t } = useTranslation();
  const points = t('credibility.points');

  return (
    <section className="section-white py-16 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-eyebrow">{t('credibility.eyebrow')}</p>
          <h2 className="type-section-title mb-2">{t('credibility.title')}</h2>
          <p className="type-body-sm">{brand.legalName} · {brand.location}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border border border-border rounded-xl overflow-hidden">
          {(Array.isArray(points) ? points : credibilityPoints).map((point, i) => (
            <div key={point.title} className="p-5 bg-white text-center">
              <p className="type-stat mb-2">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="type-card-title mb-2">{point.title}</h3>
              <p className="type-form-help">{point.desc}</p>
            </div>
          ))}
        </div>
        <address className="mt-8 text-center type-body-sm not-italic">
          {brand.addressLines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </address>
      </div>
    </section>
  );
}
