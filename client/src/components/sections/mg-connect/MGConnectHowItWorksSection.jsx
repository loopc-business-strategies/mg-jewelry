import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectHowItWorksSection() {
  const { t } = useTranslation();
  const steps = t('mgConnect.howItWorks.steps');

  return (
    <section className="section-white py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <p className="section-eyebrow">{t('mgConnect.howItWorks.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('mgConnect.howItWorks.title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="text-center p-6 md:p-8 rounded-xl border border-border bg-cream/50"
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-white border border-border text-gold font-semibold text-sm mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="type-card-title mb-2">{step.title}</h3>
              <p className="type-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
