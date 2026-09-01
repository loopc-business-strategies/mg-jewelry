import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Gem, Globe2, HardHat } from 'lucide-react';
import { heroBanner } from '../../utils/brandConfig';
import { heroImage } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';

const iconMap = { HardHat, Gem, Factory, Globe2 };

export default function HeroSection() {
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
          <p className="section-eyebrow mb-4">{heroBanner.eyebrow}</p>
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-charcoal leading-tight mb-5">
            {heroBanner.headlineBefore}{' '}
            <span className="text-gold">{heroBanner.headlineHighlight}</span>
            <br />
            {heroBanner.headlineAfter}
          </h1>
          <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            {heroBanner.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-12 md:mb-14">
            <Link to={heroBanner.primaryCta.path} className="btn-primary-gold">
              {heroBanner.primaryCta.label} <ArrowRight size={14} />
            </Link>
            <Link to={heroBanner.secondaryCta.path} className="btn-outline-gold">
              {heroBanner.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="hero-feature-grid grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl animate-reveal">
          {heroBanner.features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <div key={feature.title} className="hero-feature-item flex gap-3 items-start">
                {Icon && (
                  <Icon className="hero-feature-icon shrink-0 mt-0.5" size={26} strokeWidth={1.5} />
                )}
                <div>
                  <p className="text-xs md:text-sm font-semibold text-charcoal leading-snug">
                    {feature.title}
                  </p>
                  <p className="text-[11px] text-muted leading-relaxed mt-0.5 hidden sm:block">
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
