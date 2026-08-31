import SEOHead from '../components/SEOHead';
import MarketsSection from '../components/sections/MarketsSection';
import { brand, internationalMarkets } from '../utils/brandConfig';
import { marketsHero } from '../utils/imageConfig';
import { Link } from 'react-router-dom';

export default function MarketsPage() {
  return (
    <>
      <SEOHead
        title="Global Jewelry Markets"
        description="Modern Gold Jewelry serves international jewelry markets across Central Asia, Russia, UK, Singapore, Malaysia, Hong Kong, USA and Dubai from our manufacturing base in Uzbekistan."
        path="/markets"
      />
      <section className="relative py-24 px-4 bg-pearl">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Global Market Reach</h1>
            <p className="text-muted text-lg leading-relaxed mb-6">
              From Namangan, Uzbekistan, we manufacture jewelry for partners and businesses across the world's most dynamic jewelry markets.
            </p>
            <Link to="/wholesale/register" className="inline-flex bg-gold text-white px-6 py-3 rounded-full font-medium hover:bg-gold-dark transition-colors">
              Become an International Partner
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gold/10">
            <img src={marketsHero} alt="International jewelry markets served by Modern Gold Jewelry" className="w-full aspect-video object-cover" />
          </div>
        </div>
      </section>
      <MarketsSection />
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <p className="text-muted leading-relaxed">
          We work with wholesalers, retailers, jewelry brands and distributors in {internationalMarkets.map((m) => m.name).join(', ')} — delivering quality manufacturing with international business standards.
        </p>
      </section>
    </>
  );
}
