import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ScrollReveal from '../components/ScrollReveal';
import SafeImage from '../components/SafeImage';
import { manufacturingSteps, manufacturingCapabilities, IMAGE_PLACEHOLDER_LABEL, seoKeywords } from '../utils/brandConfig';

const FACTORY_IMAGES = {
  overview: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80&auto=format&fit=crop',
  production: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80&auto=format&fit=crop',
  chains: 'https://images.unsplash.com/photo-1617038220319-276d3aab2915?w=1200&q=80&auto=format&fit=crop',
  bangles: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80&auto=format&fit=crop',
  qc: 'https://images.unsplash.com/photo-1610375461246-207c099ac6cc?w=1200&q=80&auto=format&fit=crop',
};

function ImageBlock({ src, label, alt }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden image-zoom-hover">
      <SafeImage src={src} alt={alt} category="gold-jewelry" className="w-full h-full object-cover opacity-80" />
      <span className="image-placeholder-label">Modern Gold {label} — {IMAGE_PLACEHOLDER_LABEL}</span>
    </div>
  );
}

export default function ManufacturingPage() {
  return (
    <>
      <SEOHead
        title="Manufacturing — Gold Chain & Bangle Production"
        description="Modern Gold manufacturing capabilities — factory, production, chains, bangles, quality control and packaging."
        path="/manufacturing"
        keywords={seoKeywords}
      />

      <section className="relative min-h-[50vh] flex items-end bg-dark overflow-hidden">
        <SafeImage src={FACTORY_IMAGES.overview} alt="Factory" className="absolute inset-0 w-full h-full object-cover opacity-40" category="gold-jewelry" />
        <div className="absolute inset-0 corporate-hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12 pt-32 w-full">
          <p className="section-eyebrow text-gold mb-3">Manufacturing</p>
          <h1 className="headline-corporate headline-corporate-light">Professional Gold Production</h1>
          <p className="text-off-white/70 mt-4 max-w-xl">
            Large-scale gold chain and bangle manufacturing for international business partners.
          </p>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-12">
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-4">Factory Overview</h2>
            <p className="text-muted max-w-2xl">
              Modern Gold operates professional manufacturing facilities in Namangan, Uzbekistan.
              Production capacity: [Client to provide]
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <ImageBlock src={FACTORY_IMAGES.overview} label="Factory Exterior" alt="Factory overview" />
          </ScrollReveal>
        </div>
      </section>

      <section className="section-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-12">
            <h2 className="headline-corporate headline-corporate-light text-2xl mb-4">Production Process</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturingSteps.map((step) => (
              <ScrollReveal key={step.step}>
                <div className="p-6 border border-gold/15 bg-dark-surface">
                  <p className="text-gold text-sm font-semibold mb-2">{step.step}</p>
                  <h3 className="font-display font-semibold text-off-white mb-2">{step.title}</h3>
                  <p className="text-sm text-off-white/60">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          {[
            { title: 'Chain Production', desc: 'Professional gold chain manufacturing in 14K, 18K and 22K.', image: FACTORY_IMAGES.chains, label: 'Chain Production' },
            { title: 'Bangle Production', desc: 'Gold bangle manufacturing for international wholesale buyers.', image: FACTORY_IMAGES.bangles, label: 'Bangle Production' },
            { title: 'Gold Handling', desc: 'Precision gold preparation and alloy management.', image: FACTORY_IMAGES.production, label: 'Gold Handling' },
            { title: 'Quality Control', desc: 'Weight, purity and craftsmanship verification at every stage.', image: FACTORY_IMAGES.qc, label: 'Quality Control' },
            { title: 'Packaging', desc: 'Export-ready packaging for international shipments.', image: FACTORY_IMAGES.overview, label: 'Packaging' },
          ].map((section) => (
            <ScrollReveal key={section.title}>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="headline-corporate headline-corporate-dark text-2xl mb-4">{section.title}</h2>
                  <p className="text-muted leading-relaxed">{section.desc}</p>
                </div>
                <ImageBlock src={section.image} label={section.label} alt={section.title} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-8">
            <h2 className="headline-corporate headline-corporate-light text-2xl mb-4">Factory Gallery</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {manufacturingCapabilities.map((cap, i) => (
              <ScrollReveal key={cap}>
                <ImageBlock src={Object.values(FACTORY_IMAGES)[i % 5]} label={cap} alt={cap} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="headline-corporate headline-corporate-dark text-2xl mb-6">View Our Products</h2>
          <Link to="/products" className="btn-gold-solid">
            Product Catalogue <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
