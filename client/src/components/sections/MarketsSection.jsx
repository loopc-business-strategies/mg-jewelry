import { Link } from 'react-router-dom';
import { brand, internationalMarkets } from '../../utils/brandConfig';
import { marketAccentColors } from '../../utils/imageConfig';

export default function MarketsSection({ compact = false }) {
  return (
    <section className={`${compact ? 'py-12' : 'py-20'} px-4 bg-pearl`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-reveal">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Connected to Global Jewelry Markets</h2>
          <p className="text-muted max-w-3xl mx-auto leading-relaxed">
            From our manufacturing base in Namangan, Uzbekistan, {brand.name} is positioned to serve jewelry businesses and partners across major international markets.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 reveal-stagger">
          {internationalMarkets.map((market, i) => (
            <div
              key={market.name}
              className={`bg-gradient-to-br ${marketAccentColors[i % marketAccentColors.length]} rounded-2xl p-6 border border-gold/10 hover:shadow-lg hover:shadow-gold/10 transition-all animate-reveal`}
            >
              <span className="text-4xl mb-3 block">{market.flag}</span>
              <h3 className="font-display text-xl text-charcoal">{market.name}</h3>
              <p className="text-sm text-muted mt-1">{market.region}</p>
            </div>
          ))}
        </div>
        {!compact && (
          <div className="text-center mt-10">
            <Link to="/markets" className="text-gold-dark font-medium hover:underline">Explore our global reach →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
