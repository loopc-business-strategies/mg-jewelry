import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PhoneMockup from '../../mg-connect/PhoneMockup';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-16 md:py-20 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-reveal">
          <p className="section-eyebrow">{t('mgConnect.hero.eyebrow')}</p>
          <h1 className="type-hero-title mb-5">{t('mgConnect.hero.title')}</h1>
          <p className="type-hero-desc prose-hero mb-8">{t('mgConnect.hero.description')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#app-access" className="btn-primary-gold">
              {t('mgConnect.hero.primaryCta')} <ArrowRight size={14} />
            </a>
            <Link to="/wholesale/register" className="btn-outline-gold">
              {t('mgConnect.hero.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="mg-connect-hero-phones relative mx-auto lg:mx-0 w-full max-w-[320px] lg:max-w-none h-[380px] md:h-[420px] animate-reveal">
          <PhoneMockup
            screen="login"
            className="mg-connect-hero-phone mg-connect-hero-phone--back"
          />
          <PhoneMockup
            screen="goldBuying"
            className="mg-connect-hero-phone mg-connect-hero-phone--mid"
          />
          <PhoneMockup
            screen="dashboard"
            className="mg-connect-hero-phone mg-connect-hero-phone--front"
          />
        </div>
      </div>
    </section>
  );
}
