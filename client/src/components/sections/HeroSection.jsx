import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Gem, Globe2, HardHat } from 'lucide-react';
import { heroBanner } from '../../utils/brandConfig';
import { heroSlides } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

const iconMap = { HardHat, Gem, Factory, Globe2 };
const MOTIONS = ['zoom-in', 'pan-left', 'zoom-out', 'pan-right'];

const slideNumber = (i) => String(i + 1).padStart(2, '0');

export default function HeroSection() {
  const { t } = useTranslation();
  const features = t('home.hero.features') || heroBanner.features;
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(() => typeof document !== 'undefined' && document.hidden);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const goTo = (index) => {
    if (index === active) return;
    setPrevious(active);
    setActive(index);
  };

  const showNext = () => goTo((active + 1) % heroSlides.length);
  const paused = hovered || tabHidden;
  const activeSlide = heroSlides[active];

  return (
    <section
      className={`hero-banner relative min-h-[520px] md:min-h-[600px] overflow-hidden bg-white ${paused ? 'is-paused' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {heroSlides.map((slide, i) => {
          const state = i === active ? 'is-active' : i === previous ? 'is-leaving' : '';
          return (
            <div key={slide.id} className={`hero-slide hero-slide--${MOTIONS[i % MOTIONS.length]} ${state}`}>
              <img
                src={slide.image}
                alt={t(`alts.heroSlides.${slide.id}`)}
                className="object-[70%_center] md:object-right"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
              />
            </div>
          );
        })}
        <div className="hero-banner-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-24 md:pt-20 md:pb-36">
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
              {t('home.hero.primaryCta')} <ArrowRight size={14} className="rtl:-scale-x-100" />
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

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-5 md:pb-8 flex justify-end">
          <div className="hero-progress">
            <p className="hero-progress-caption" aria-live="polite">
              <span className="hero-progress-num">{slideNumber(active)}</span>
              {t(`home.hero.slides.${activeSlide.id}`)}
            </p>
            <div className="hero-progress-items">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`hero-progress-item ${i === active ? 'is-active' : ''}`}
                  aria-label={t(`home.hero.slides.${slide.id}`)}
                  aria-current={i === active ? 'true' : undefined}
                >
                  <span className="hero-progress-track">
                    <span
                      className="hero-progress-fill"
                      onAnimationEnd={i === active ? showNext : undefined}
                    />
                  </span>
                  <span className="hero-progress-label">
                    <span className="hero-progress-num">{slideNumber(i)}</span>
                    {t(`home.hero.slides.${slide.id}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
