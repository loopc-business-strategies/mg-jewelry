import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ScrollReveal from '../components/ScrollReveal';
import PlaceholderImage from '../components/PlaceholderImage';
import SafeImage from '../components/SafeImage';
import { manufacturingSteps, seoKeywords } from '../utils/brandConfig';
import { factoryGallery, showroomGallery } from '../utils/imageConfig';

export default function ManufacturingPage() {
  const heroImage = factoryGallery[0]?.src;

  const productionSections = [
    { title: 'Chain Production', desc: 'Professional gold chain manufacturing in 14K, 18K and 22K.', image: factoryGallery[2], label: 'Chain Production' },
    { title: 'Bangle Production', desc: 'Gold bangle manufacturing for international wholesale buyers.', image: factoryGallery[3], label: 'Bangle Production' },
    { title: 'Gold Handling', desc: 'Precision gold preparation and alloy management.', image: factoryGallery[1], label: 'Gold Handling' },
    { title: 'Quality Control', desc: 'Weight, purity and craftsmanship verification at every stage.', image: factoryGallery[4], label: 'Quality Control' },
    { title: 'Packaging', desc: 'Export-ready packaging for international shipments.', image: factoryGallery[5], label: 'Packaging' },
  ];

  return (
    <>
      <SEOHead
        title="Manufacturing — Gold Chain & Bangle Production"
        description="Modern Gold manufacturing capabilities — factory, production, chains, bangles, quality control and packaging in Namangan, Uzbekistan."
        path="/manufacturing"
        keywords={seoKeywords}
      />

      <section className="relative min-h-[50vh] flex items-end bg-dark overflow-hidden">
        <SafeImage src={heroImage} alt="Factory" className="absolute inset-0 w-full h-full object-cover opacity-40" category="gold-jewelry" />
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
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <PlaceholderImage
              src={heroImage}
              alt="Factory overview"
              label="Modern Gold Factory Exterior"
              aspect="aspect-[16/10]"
            />
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
          {productionSections.map((section) => (
            <ScrollReveal key={section.title}>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="headline-corporate headline-corporate-dark text-2xl mb-4">{section.title}</h2>
                  <p className="text-muted leading-relaxed">{section.desc}</p>
                </div>
                <PlaceholderImage
                  src={section.image?.src}
                  alt={section.title}
                  label={`Modern Gold ${section.label}`}
                  aspect="aspect-[16/10]"
                />
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
            {factoryGallery.map((item) => (
              <ScrollReveal key={item.label}>
                <PlaceholderImage
                  src={item.src}
                  alt={item.label}
                  label={`Modern Gold ${item.label}`}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-8">
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-4">Showroom & Office</h2>
            <p className="text-muted max-w-2xl mb-8">
              Visit our showroom and business office in Namangan. Real photos will be added soon.
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {showroomGallery.map((item) => (
              <ScrollReveal key={item.label}>
                <PlaceholderImage
                  src={item.src}
                  alt={item.label}
                  label={`Modern Gold ${item.label}`}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16 text-center border-t border-gold/10">
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
