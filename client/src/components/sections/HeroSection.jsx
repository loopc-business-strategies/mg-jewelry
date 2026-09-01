import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brand, heroTrustBadges } from '../../utils/brandConfig';
import { heroImage } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center bg-linen overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <SafeImage src={heroImage} alt="Woman wearing luxury gold necklace — Modern Gold Jewelry editorial" className="w-full h-full object-cover" loading="eager" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-linen via-linen/95 to-linen/30" />
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-reveal max-w-xl">
          <p className="section-eyebrow mb-4">International Jewelry Manufacturing</p>
          <h1 className="headline-editorial mb-4">
            {brand.name}
          </h1>
          <p className="font-display text-xl md:text-2xl text-gold-dark italic mb-6">
            {brand.tagline}
          </p>
          <p className="text-muted text-base md:text-lg leading-relaxed mb-8">
            {brand.heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link to="/shop" className="btn-primary-gold">
              Explore Collections <ArrowRight size={14} />
            </Link>
            <Link to="/contact?type=quote" className="btn-outline-gold">
              Request a Quote
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-gold/15">
            {heroTrustBadges.map((badge) => (
              <div key={badge.title}>
                <p className="text-xs font-medium text-charcoal mb-1">{badge.title}</p>
                <p className="text-[11px] text-muted leading-relaxed">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block animate-reveal animate-float">
          <div className="relative image-zoom-hover rounded-sm overflow-hidden border border-gold/20 shadow-lg shadow-gold/10">
            <SafeImage
              src={heroImage}
              alt="Woman wearing luxury gold necklace — Modern Gold Jewelry editorial campaign"
              className="w-full aspect-[4/5] object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
