import { Link2, Eye, Zap, Briefcase } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

const icons = [Link2, Eye, Zap, Briefcase];

export default function MGConnectBenefitsSection() {
  const { t } = useTranslation();
  const benefits = t('mgConnect.benefits.items');

  return (
    <section className="section-white py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14 max-w-[700px] mx-auto">
          <p className="section-eyebrow">{t('mgConnect.benefits.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('mgConnect.benefits.title')}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, i) => {
            const Icon = icons[i];
            return (
              <div key={benefit.title} className="text-center p-5 md:p-6">
                <div className="w-11 h-11 rounded-full bg-cream border border-border flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="type-card-title mb-2">{benefit.title}</h3>
                <p className="type-card-desc">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
