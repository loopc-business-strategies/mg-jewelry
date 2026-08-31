import SEOHead from '../components/SEOHead';
import ManufacturingSection from '../components/sections/ManufacturingSection';
import { brand, manufacturingSteps, trustIndicators } from '../utils/brandConfig';
import { manufacturingHero } from '../utils/imageConfig';
import { Link } from 'react-router-dom';

export default function ManufacturingPage() {
  return (
    <>
      <SEOHead
        title="Jewelry Manufacturing Process"
        description="Discover the Modern Gold Jewelry manufacturing journey — from design and development to casting, finishing, quality control and international delivery."
        path="/manufacturing"
      />
      <section className="relative py-24 px-4 section-gradient-cool overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={manufacturingHero} alt="Jewelry manufacturing at Modern Gold Jewelry" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Manufacturing Excellence</h1>
          <p className="text-muted text-lg leading-relaxed">
            {brand.legalName} combines skilled craftsmanship with modern production capabilities at our facility in Namangan, Uzbekistan.
          </p>
        </div>
      </section>
      <ManufacturingSection />
      <section id="quality" className="py-16 px-4 max-w-7xl mx-auto bg-ivory/50">
        <h2 className="font-display text-3xl text-center text-charcoal mb-4">Quality & Craftsmanship</h2>
        <p className="text-center text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Every piece reflects our commitment to precision manufacturing, rigorous quality control and professional craftsmanship.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustIndicators.slice(0, 3).map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-gold/10">
              <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="process" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {manufacturingSteps.map((step) => (
            <div key={step.step} className="flex gap-6 items-start border-b border-gold/10 pb-8">
              <span className="font-display text-4xl text-gold shrink-0">{step.step}</span>
              <div>
                <h2 className="font-display text-2xl text-charcoal mb-2">{step.title}</h2>
                <p className="text-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/contact?type=quote" className="bg-gold text-white px-8 py-3 rounded-full font-medium hover:bg-gold-dark transition-colors">
            Discuss Your Production Needs
          </Link>
        </div>
      </section>
    </>
  );
}
