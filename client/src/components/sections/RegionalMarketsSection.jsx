import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { brand } from '../../utils/brandConfig';

export default function RegionalMarketsSection() {
  return (
    <section className="section-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <p className="section-eyebrow mb-3">Markets</p>
            <h2 className="headline-corporate headline-corporate-dark mb-6">
              Central Asia · Global Orientation
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              Modern Gold is headquartered in Namangan, Uzbekistan — at the heart of Central Asia's gold industry.
              Our operations connect regional gold supply with international business partners worldwide.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white border border-gold/15">
                <MapPin size={20} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark mb-1">Headquarters & Factory</p>
                  <p className="text-sm text-muted">{brand.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-white border border-gold/15">
                <MapPin size={20} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark mb-1">Regional Presence</p>
                  <p className="text-sm text-muted">Central Asia — {brand.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-dark/5 border border-gold/10">
                <MapPin size={20} className="text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark mb-1">Export Markets</p>
                  <p className="text-sm text-muted">Coming soon — [Client to provide export market details]</p>
                </div>
              </div>
            </div>

            <Link to="/markets" className="btn-gold-outline inline-flex mt-8">
              View Markets
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative aspect-[4/3] bg-dark-surface border border-gold/15 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-4 h-4 bg-gold rounded-full mx-auto mb-4 animate-pulse" />
                  <p className="font-display text-xl font-semibold text-off-white mb-2">{brand.location}</p>
                  <p className="text-sm text-muted-light">Central Asia</p>
                  <p className="text-xs text-gold/60 mt-6 uppercase tracking-wider">
                    Interactive map — coming soon
                  </p>
                </div>
              </div>
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 60% 45%, #C9A962 0%, transparent 50%)',
                }}
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
