import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brand, heroTrustBadges } from '../../utils/brandConfig';
import { heroImage } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';

export default function HeroSection() {
  return (
    <section className="section-white py-16 md:py-24 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="animate-reveal max-w-xl">
          <p className="section-eyebrow mb-4">Mining · Refinery · Manufacturing</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {brand.name}
          </h1>
          <div className="section-title-line mb-5" />
          <p className="text-muted text-base md:text-lg leading-relaxed mb-3">
            {brand.tagline}
          </p>
          <p className="text-muted text-sm md:text-base leading-relaxed mb-2">
            {brand.heroSupportingLine}
          </p>
          <p className="text-muted text-sm md:text-base leading-relaxed mb-8">
            {brand.heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link to="/shop" className="btn-primary-gold">
              Explore Collections <ArrowRight size={14} />
            </Link>
            <Link to="/contact?type=quote" className="btn-outline-gold">
              Request a Quote
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-border">
            {heroTrustBadges.map((badge) => (
              <div key={badge.title}>
                <p className="text-xs font-semibold text-charcoal mb-1">{badge.title}</p>
                <p className="text-[11px] text-muted leading-relaxed">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="animate-reveal">
          <div className="relative image-zoom-hover rounded-lg overflow-hidden border border-border">
            <SafeImage
              src={heroImage}
              alt="Gold refinery operations — demo corporate photography"
              disableFallback
              className="w-full aspect-[4/5] object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
