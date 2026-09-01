import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brand, heroTrustBadges } from '../../utils/brandConfig';
import SafeImage from '../SafeImage';
import BrandLogo from '../BrandLogo';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1610375461246-207c099ac6cc?w=1920&q=80&auto=format&fit=crop';

export default function CorporateHeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-dark">
      <div className="absolute inset-0">
        <SafeImage
          src={HERO_IMAGE}
          alt="Gold industry manufacturing"
          className="w-full h-full object-cover opacity-50"
          category="gold-jewelry"
        />
        <div className="absolute inset-0 corporate-hero-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16 md:pb-24 pt-32 w-full animate-reveal">
        <div className="max-w-3xl">
          <BrandLogo className="h-16 w-16 mb-6" alt={brand.name} />
          <p className="section-eyebrow text-gold mb-4">{brand.location}</p>
          <h1 className="headline-corporate headline-corporate-light mb-6">
            {brand.heroHeadline}
          </h1>
          <p className="text-lg text-off-white/75 leading-relaxed mb-10 max-w-2xl">
            {brand.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/gold-buying" className="btn-gold-solid">
              Sell Gold <ArrowRight size={16} />
            </Link>
            <Link to="/buyers" className="btn-gold-outline btn-gold-outline-light">
              Buy From Modern Gold
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 pt-8 border-t border-gold/20">
            {heroTrustBadges.map((badge) => (
              <div key={badge.title}>
                <p className="text-sm font-semibold text-off-white mb-1">{badge.title}</p>
                <p className="text-xs text-muted-light">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
