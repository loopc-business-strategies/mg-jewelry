import { Coins, UserCircle, FileText, Package } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

const icons = [Coins, UserCircle, FileText, Package];

export default function MGConnectIntroSection() {
  const { t } = useTranslation();
  const features = t('mgConnect.intro.features');

  return (
    <section className="section-cream py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14 max-w-[700px] mx-auto">
          <p className="section-eyebrow">{t('mgConnect.intro.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('mgConnect.intro.title')}</h2>
          <p className="type-section-desc prose-section mx-auto">{t('mgConnect.intro.description')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, i) => {
            const Icon = icons[i];
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-border p-5 md:p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="w-10 h-10 rounded-lg bg-cream border border-border flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="type-card-title mb-2">{feature.title}</h3>
                <p className="type-card-desc">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
