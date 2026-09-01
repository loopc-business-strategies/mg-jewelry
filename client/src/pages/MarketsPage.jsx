import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ScrollReveal from '../components/ScrollReveal';
import { brand, seoKeywords } from '../utils/brandConfig';

export default function MarketsPage() {
  return (
    <>
      <SEOHead
        title="Markets — Central Asia & Global Orientation"
        description={`Modern Gold is headquartered in ${brand.location}, Central Asia — connecting regional gold supply with international markets.`}
        path="/markets"
        keywords={seoKeywords}
      />

      <section className="section-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <p className="section-eyebrow text-gold mb-3">Markets</p>
            <h1 className="headline-corporate headline-corporate-light mb-6">
              Central Asia · Global Orientation
            </h1>
            <p className="text-off-white/70 max-w-2xl text-lg leading-relaxed">
              Modern Gold is rooted in Central Asia with a vision to serve international gold and jewellery markets worldwide.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <ScrollReveal>
              <h2 className="headline-corporate headline-corporate-dark text-2xl mb-8">Our Locations</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-white border border-gold/15">
                  <MapPin size={22} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark mb-1">Headquarters</p>
                    <p className="text-sm text-muted">{brand.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white border border-gold/15">
                  <MapPin size={22} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark mb-1">Factory</p>
                    <p className="text-sm text-muted">{brand.address}</p>
                    <p className="text-xs text-muted mt-2">[Client to provide factory address if different]</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white border border-gold/15">
                  <MapPin size={22} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark mb-1">Regional Presence</p>
                    <p className="text-sm text-muted">Central Asia — {brand.location}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="relative aspect-square bg-dark-surface border border-gold/15 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-5 h-5 bg-gold rounded-full mx-auto mb-6" />
                  <p className="font-display text-2xl font-semibold text-off-white mb-2">{brand.location}</p>
                  <p className="text-muted-light mb-2">Uzbekistan</p>
                  <p className="text-sm text-gold/70">Central Asia</p>
                  <p className="text-xs text-muted-light mt-8 uppercase tracking-wider">
                    Interactive map — coming soon
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-dark py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-light text-2xl mb-6">Export Markets</h2>
            <div className="p-8 border border-gold/20 bg-dark-surface mb-8">
              <p className="text-off-white/70 text-lg mb-2">Coming Soon</p>
              <p className="text-sm text-muted-light">
                Export market details will be published here once confirmed by the client.
                [Client to provide export countries and partner markets]
              </p>
            </div>
            <Link to="/buyers" className="btn-gold-solid">
              Become an International Buyer <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-light py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-4">Central Asia Context</h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              Central Asia holds significant gold industry potential. Modern Gold is positioned at the intersection
              of regional gold supply, professional manufacturing and international trade — building trusted
              relationships with partners worldwide.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
