import { Link } from 'react-router-dom';
import PhoneMockup from '../../our-mg/PhoneMockup';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGFinalCTASection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-16 md:py-20 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h2 className="type-section-title mb-4">{t('ourMg.final.title')}</h2>
          <p className="type-section-desc prose-section mb-8">{t('ourMg.final.description')}</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href="#download" className="btn-primary-gold">
              {t('ourMg.final.primaryCta')}
            </a>
            <Link to="/" className="btn-outline-gold">
              {t('ourMg.final.secondaryCta')}
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PhoneMockup
            screen="home"
            placeholderNumber="02"
            placeholderName="Home"
            large
          />
        </div>
      </div>
    </section>
  );
}
