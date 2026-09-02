import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGDifferentSection() {
  const { t } = useTranslation();
  const points = t('ourMg.different.points');

  return (
    <section className="section-cream py-16 md:py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="type-section-title mb-4">{t('ourMg.different.title')}</h2>
        <p className="type-section-desc prose-section mx-auto mb-10">{t('ourMg.different.description')}</p>
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          {points.map((point) => (
            <div
              key={point.title}
              className="bg-white rounded-xl border border-border p-6 shadow-[var(--shadow-soft)]"
            >
              <h3 className="type-body-sm font-semibold tracking-wide text-gold mb-2">{point.title}</h3>
              <p className="type-body-sm text-muted">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
