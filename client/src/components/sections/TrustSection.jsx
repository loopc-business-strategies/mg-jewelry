import { trustIndicators } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

const icons = ['⚙️', '✦', '💎', '🌍', '✨', '🤝'];

export default function TrustSection() {
  const { t } = useTranslation();
  const points = t('credibility.points') || trustIndicators;

  return (
    <section className="section-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="type-section-title text-center mb-12">{t('home.trust.title')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
          {Array.isArray(points) && points.map((item, i) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 border border-border text-center animate-reveal">
              <span className="text-2xl mb-3 block">{icons[i]}</span>
              <h3 className="text-lg font-semibold text-charcoal mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
