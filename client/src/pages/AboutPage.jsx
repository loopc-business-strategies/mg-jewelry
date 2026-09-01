import SEOHead from '../components/SEOHead';
import { brand, trustIndicators, oppositeModelCopy } from '../utils/brandConfig';
import { aboutHero, factoryGallery, showroomGallery } from '../utils/imageConfig';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import PlaceholderImage from '../components/PlaceholderImage';

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

      <div className="relative h-64 md:h-80 overflow-hidden bg-linen">
        <SafeImage src={aboutHero} alt="Woman wearing ornate gold jewelry — Modern Gold Jewelry editorial" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-pearl/85 to-cream/50 flex items-center justify-center px-4">
          <h1 className="font-display text-3xl md:text-5xl text-charcoal text-center">Crafted in Namangan, Uzbekistan</h1>
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
          <h2 className="font-display text-3xl mb-4">How We Work</h2>
          <p className="text-muted leading-relaxed mb-4">
            {oppositeModelCopy}
          </p>
          <p className="text-muted leading-relaxed mb-4">
            <strong>Local sellers</strong> can bring gold to Modern Gold for inspection, valuation and purchase. <strong>International buyers</strong> — jewellers, gold traders and wholesalers — register as partners to source manufactured jewellery from our Namangan facility.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/gold-buying" className="btn-primary-gold text-xs">Sell Gold</Link>
            <Link to="/wholesale/register" className="btn-outline-gold text-xs">Become a Partner</Link>
          </div>
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
          <h2 className="font-display text-3xl mb-4">Factory & Showroom</h2>
          <p className="text-muted text-sm mb-6">Our manufacturing and showroom facilities in Namangan. Real photos will be added soon.</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {factoryGallery.slice(0, 4).map((item) => (
              <PlaceholderImage key={item.label} src={item.src} alt={item.label} label={`Modern Gold ${item.label}`} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {showroomGallery.map((item) => (
              <PlaceholderImage key={item.label} src={item.src} alt={item.label} label={`Modern Gold ${item.label}`} />
            ))}
          </div>
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
          <Link to="/custom-jewelry" className="text-sm tracking-wide text-charcoal hover:text-gold transition-colors">Explore custom jewelry manufacturing →</Link>
        </div>
      </div>
    </>
  );
}
