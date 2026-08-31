import SEOHead from '../components/SEOHead';
import { brand, trustIndicators } from '../utils/brandConfig';
import { aboutHero } from '../utils/imageConfig';
import { Link } from 'react-router-dom';

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
      <SEOHead title="About Us" description={`${brand.legalName} — jewelry manufacturing from Namangan, Uzbekistan, serving international markets.`} path="/about" schema={schema} />

      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={aboutHero} alt="Modern Gold Jewelry manufacturing facility" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-pearl/80 to-cream/40 flex items-center justify-center">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal">Crafted in Uzbekistan. Connected to the World.</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        <section id="story">
          <h2 className="font-display text-3xl mb-4">Our Story</h2>
          <p className="text-muted leading-relaxed mb-4">
            {brand.legalName} is a jewelry manufacturing company based in Namangan, Uzbekistan, focused on creating quality jewelry products for international markets.
          </p>
          <p className="text-muted leading-relaxed">
            We combine skilled craftsmanship, modern production capabilities and rigorous quality control to serve wholesalers, retailers, jewelry brands and international business partners across Central Asia, Russia, the UK, Singapore, Malaysia, Hong Kong, the United States and Dubai.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl mb-4">Mission & Vision</h2>
          <p className="text-muted leading-relaxed mb-4">
            <strong>Mission:</strong> To deliver precision-crafted jewelry manufacturing that empowers international partners with reliable quality, flexible production and professional service.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Vision:</strong> To be a trusted international jewelry manufacturer connecting Uzbekistan craftsmanship with global jewelry markets.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl mb-6">What We Offer</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {['Manufacturing expertise', 'Skilled craftsmanship', 'Modern production', 'Quality control', 'Custom manufacturing', 'Wholesale partnerships', 'International business', 'Reliable production'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-muted text-sm">
                <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl mb-6">Why Partners Trust Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {trustIndicators.slice(0, 3).map(({ title, desc }) => (
              <div key={title} className="text-center p-6 bg-cream rounded-xl border border-gold/10">
                <h3 className="font-display text-xl mb-2 text-charcoal">{title}</h3>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link to="/custom-jewelry" className="text-gold-dark font-medium hover:underline">Explore custom jewelry manufacturing →</Link>
        </div>
      </div>
    </>
  );
}
