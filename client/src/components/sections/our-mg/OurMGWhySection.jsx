import { Smartphone, Clock, Layers, Zap, Link2, MonitorSmartphone } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

const benefitIcons = [Smartphone, Clock, Layers, Zap, Link2, MonitorSmartphone];

export default function OurMGWhySection() {
  const { t } = useTranslation();
  const items = t('ourMg.why.items');

  return (
    <section className="section-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <p className="section-eyebrow">{t('ourMg.why.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.why.title')}</h2>
        </div>
        <div className="our-mg-benefit-grid">
          {items.map((item, i) => {
            const Icon = benefitIcons[i] || Smartphone;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="type-card-title mb-2">{item.title}</h3>
                <p className="type-body-sm text-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
