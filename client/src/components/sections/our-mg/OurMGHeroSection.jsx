import { Link } from 'react-router-dom';
import PhoneMockup from '../../our-mg/PhoneMockup';
import { ourMgApp } from '../../../utils/brandConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-reveal">
          <p className="section-eyebrow">{t('ourMg.hero.eyebrow')}</p>
          <h1 className="type-hero-title mb-5">{t('ourMg.hero.title')}</h1>
          <p className="type-hero-desc prose-hero mb-8">{t('ourMg.hero.description')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#about" className="btn-primary-gold">
              {t('ourMg.hero.primaryCta')}
            </a>
            <Link to={ourMgApp.webUrl} className="btn-outline-gold">
              {t('ourMg.hero.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="our-mg-hero-phones animate-reveal" aria-hidden="true">
          <PhoneMockup
            screen="products"
            placeholderName="Products"
            className="our-mg-hero-phone our-mg-hero-phone--left"
          />
          <PhoneMockup
            screen="home"
            placeholderName="Our MG"
            className="our-mg-hero-phone our-mg-hero-phone--center"
          />
          <PhoneMockup
            screen="orders"
            placeholderName="Bookings"
            className="our-mg-hero-phone our-mg-hero-phone--right"
          />
        </div>
      </div>
    </section>
  );
}
