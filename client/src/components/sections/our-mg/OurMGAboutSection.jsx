import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGAboutSection() {
  const { t } = useTranslation();
  const cards = t('ourMg.about.cards');

  return (
    <section id="about" className="section-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
          <p className="section-eyebrow">{t('ourMg.about.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.about.title')}</h2>
          <p className="type-section-desc prose-section">{t('ourMg.about.description')}</p>
        </div>
        <div className="our-mg-value-grid">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-border p-6 shadow-[var(--shadow-soft)]"
            >
              <span className="type-micro text-gold font-semibold tracking-wider mb-3 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="type-body-sm font-semibold tracking-wide mb-2">{card.title}</h3>
              <p className="type-body-sm text-muted">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
