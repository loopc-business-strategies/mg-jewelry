import SEOHead from '../components/SEOHead';
import ScrollReveal from '../components/ScrollReveal';
import SafeImage from '../components/SafeImage';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brand, trustIndicators, companyStory, manufacturingCapabilities, IMAGE_PLACEHOLDER_LABEL, seoKeywords } from '../utils/brandConfig';

const ABOUT_HERO = 'https://images.unsplash.com/photo-1610375461246-207c099ac6cc?w=1920&q=80&auto=format&fit=crop';

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.legalName,
    alternateName: brand.name,
    description: brand.tagline,
    url: brand.siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '242 Girvonbulok Street',
      addressLocality: 'Namangan Davlatabad',
      addressRegion: 'Namangan',
      addressCountry: 'UZ',
    },
  };

  return (
    <>
      <SEOHead
        title="About Modern Gold — Gold Industry Company"
        description={`Learn about ${brand.name} — gold jewellery manufacturing and gold industry operations from ${brand.location}.`}
        path="/about"
        keywords={seoKeywords}
        schema={schema}
      />

      <section className="relative h-64 md:h-96 overflow-hidden bg-dark">
        <SafeImage src={ABOUT_HERO} alt="Modern Gold operations" className="w-full h-full object-cover opacity-40" category="gold-jewelry" />
        <div className="absolute inset-0 corporate-hero-overlay" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
            <p className="section-eyebrow text-gold mb-3">About Us</p>
            <h1 className="headline-corporate headline-corporate-light">Modern Gold</h1>
          </div>
        </div>
        <span className="image-placeholder-label">Modern Gold Headquarters — {IMAGE_PLACEHOLDER_LABEL}</span>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-6">Company Overview</h2>
            <p className="text-muted leading-relaxed mb-4">
              {brand.legalName} is a gold industry company based in Namangan, Uzbekistan. The company produces
              gold chains and bangles for business and international buyers, while expanding across the broader
              gold industry value chain.
            </p>
            <p className="text-muted leading-relaxed">
              Modern Gold connects regional gold supply with professional manufacturing and international trade —
              serving both local gold sellers and global business partners.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-12">
            <h2 className="headline-corporate headline-corporate-light text-2xl mb-4">Company History</h2>
            <p className="text-off-white/70 max-w-2xl">
              From jewellery production to gold industry leadership — our growth trajectory.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyStory.phases.map((phase, i) => (
              <ScrollReveal key={phase.title}>
                <div className="p-6 border border-gold/15 bg-dark-surface h-full">
                  <p className="text-xs tracking-widest uppercase text-gold mb-2">Phase {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-display font-semibold text-off-white mb-2">{phase.title}</h3>
                  <p className="text-sm text-off-white/60">{phase.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-6">Jewellery Manufacturing</h2>
            <p className="text-muted leading-relaxed mb-6">
              Our core manufacturing focus is gold chains and bangles — produced in 14K, 18K and 22K purities
              for international business buyers. Every product is manufactured to professional standards with
              rigorous quality control.
            </p>
            <Link to="/manufacturing" className="btn-gold-outline inline-flex">
              View Manufacturing <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden">
              <SafeImage src={ABOUT_HERO} alt="Manufacturing" category="gold-jewelry" className="w-full h-full object-cover" />
              <span className="image-placeholder-label">Modern Gold Factory — {IMAGE_PLACEHOLDER_LABEL}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-light py-16 border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-12 text-center">
            <h2 className="headline-corporate headline-corporate-dark text-2xl">Why Modern Gold</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {trustIndicators.map((item) => (
              <ScrollReveal key={item.title}>
                <div className="p-6 bg-white border border-gold/10 text-center h-full">
                  <h3 className="font-display font-semibold text-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-12">
            <h2 className="headline-corporate headline-corporate-light text-2xl mb-4">Leadership & Team</h2>
            <p className="text-off-white/60">[Client to provide leadership information and photos]</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {['Leadership', 'Production Team', 'Quality Team'].map((role) => (
              <div key={role} className="relative aspect-[3/4] bg-dark-surface border border-gold/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-light">{role}</p>
                </div>
                <span className="image-placeholder-label">Modern Gold {role} — {IMAGE_PLACEHOLDER_LABEL}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-6">Factory & Showroom</h2>
            <p className="text-muted leading-relaxed mb-4">{brand.address}</p>
            <p className="text-sm text-muted mb-6">Production capacity: [Client to provide]</p>
            <div className="flex flex-wrap gap-2">
              {manufacturingCapabilities.slice(0, 4).map((cap) => (
                <span key={cap} className="px-3 py-1 text-xs uppercase tracking-wider border border-gold/20 text-gold-dark">{cap}</span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden">
              <SafeImage src={ABOUT_HERO} alt="Showroom" category="gold-jewelry" className="w-full h-full object-cover" />
              <span className="image-placeholder-label">Modern Gold Showroom — {IMAGE_PLACEHOLDER_LABEL}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-dark py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="headline-corporate headline-corporate-light text-2xl mb-6">International Vision</h2>
          <p className="text-off-white/70 mb-8">
            Modern Gold is building toward becoming a trusted regional gold industry company with global reach.
            Export markets — coming soon. [Client to provide]
          </p>
          <Link to="/buyers" className="btn-gold-solid">
            Partner With Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
