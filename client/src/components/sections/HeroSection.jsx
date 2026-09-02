import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Gem, Globe2, HardHat } from 'lucide-react';
import { heroBanner } from '../../utils/brandConfig';
import { heroImage } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';
import { useTranslation } from '../../hooks/useTranslation';

const iconMap = { HardHat, Gem, Factory, Globe2 };

export default function HeroSection() {
  const { t } = useTranslation();
  const features = t('home.hero.features') || heroBanner.features;

  return (
    <section className="hero-banner relative min-h-[520px] md:min-h-[600px] overflow-hidden bg-white">
      <div className="absolute inset-0" aria-hidden="true">
        <SafeImage
          src={heroImage}
          alt="Gold refinery operations — molten gold pour at Modern Gold"
          disableFallback
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-right"
          loading="eager"
        />
        <div className="hero-banner-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="max-w-xl animate-reveal">
          <p className="section-eyebrow">{t('home.hero.eyebrow')}</p>
          <h1 className="type-hero-title mb-5">
            {t('home.hero.headlineBefore')}{' '}
            <span className="text-gold">{t('home.hero.headlineHighlight')}</span>
            <br />
            {t('home.hero.headlineAfter')}
          </h1>
          <p className="type-hero-desc prose-hero mb-8">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-12 md:mb-14">
            <Link to={heroBanner.primaryCta.path} className="btn-primary-gold">
              {t('home.hero.primaryCta')} <ArrowRight size={14} />
            </Link>
            <Link to={heroBanner.secondaryCta.path} className="btn-outline-gold">
              {t('home.hero.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="hero-feature-grid grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl animate-reveal">
          {Array.isArray(features) && features.map((feature, i) => {
            const Icon = iconMap[heroBanner.features[i]?.icon];
            return (
              <div key={feature.title} className="hero-feature-item flex gap-3 items-start">
                {Icon && (
                  <Icon className="hero-feature-icon shrink-0 mt-0.5" size={26} strokeWidth={1.5} />
                )}
                <div>
                  <p className="type-body-sm font-medium text-charcoal leading-snug">
                    {feature.title}
                  </p>
                  <p className="type-form-help mt-0.5 hidden sm:block">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
