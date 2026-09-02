import { Link } from 'react-router-dom';
import PhoneMockup from '../../our-mg/PhoneMockup';
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
            <a href="#download" className="btn-primary-gold">
              {t('ourMg.hero.primaryCta')}
            </a>
            <Link to="/" className="btn-outline-gold">
              {t('ourMg.hero.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="our-mg-hero-phones relative mx-auto lg:mx-0 w-full max-w-[360px] lg:max-w-none h-[420px] md:h-[480px] animate-reveal">
          <PhoneMockup
            screen="login"
            placeholderNumber="01"
            placeholderName="Login"
            className="our-mg-hero-phone our-mg-hero-phone--back"
          />
          <PhoneMockup
            screen="products"
            placeholderNumber="03"
            placeholderName="Products"
            className="our-mg-hero-phone our-mg-hero-phone--mid"
          />
          <PhoneMockup
            screen="home"
            placeholderNumber="02"
            placeholderName="Home"
            className="our-mg-hero-phone our-mg-hero-phone--front"
          />
        </div>
      </div>
    </section>
  );
}
