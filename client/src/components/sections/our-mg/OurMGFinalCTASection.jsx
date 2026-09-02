import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGFinalCTASection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-16 md:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="section-eyebrow">{t('ourMg.final.eyebrow')}</p>
        <h2 className="type-section-title mb-4">{t('ourMg.final.title')}</h2>
        <p className="type-section-desc prose-section mx-auto mb-8">{t('ourMg.final.description')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#about" className="btn-primary-gold">
            {t('ourMg.final.primaryCta')}
          </a>
          <Link to="/" className="btn-outline-gold">
            {t('ourMg.final.secondaryCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
