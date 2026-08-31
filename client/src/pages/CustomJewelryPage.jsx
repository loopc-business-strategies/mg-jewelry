import SEOHead from '../components/SEOHead';
import CustomManufacturingSection from '../components/sections/CustomManufacturingSection';
import B2BSection from '../components/sections/B2BSection';
import { brand } from '../utils/brandConfig';
import { customHero } from '../utils/imageConfig';
import { Link } from 'react-router-dom';

export default function CustomJewelryPage() {
  return (
    <>
      <SEOHead
        title="Custom Jewelry Manufacturing"
        description="Custom jewelry manufacturing, private-label collections and bespoke production from Modern Gold Jewelry Manufacturing FE LLC in Uzbekistan."
        path="/custom-jewelry"
      />
      <section className="relative py-24 px-4 section-gradient-warm">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Custom Jewelry Manufacturing</h1>
          <p className="text-muted text-lg leading-relaxed">
            Partner with {brand.name} for bespoke designs, private-label jewelry and tailored production runs built to your brand specifications.
          </p>
        </div>
      </section>
      <CustomManufacturingSection />
      <section className="py-16 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {[
          { title: 'Custom Designs', desc: 'Bring your concepts to life with our design and development team.' },
          { title: 'Private Label', desc: 'Manufacture jewelry under your brand with consistent quality and production scale.' },
          { title: 'Wholesale Collections', desc: 'Curated collections ready for international wholesale distribution.' },
          { title: 'Product Development', desc: 'From prototype to production — full development support for new lines.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl p-8 border border-gold/10">
            <h2 className="font-display text-xl text-charcoal mb-2">{item.title}</h2>
            <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
      <div className="px-4 pb-16 max-w-7xl mx-auto">
        <img src={customHero} alt="Custom jewelry production" className="w-full rounded-2xl object-cover aspect-[21/9] border border-gold/10" />
      </div>
      <B2BSection />
      <div className="text-center pb-16">
        <Link to="/contact?type=quote" className="bg-gold text-white px-8 py-3 rounded-full font-medium hover:bg-gold-dark transition-colors">
          Discuss Your Collection
        </Link>
      </div>
    </>
  );
}
