import { Link } from 'react-router-dom';
import { b2bAudience } from '../../utils/brandConfig';

export default function B2BSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-champagne/40 via-cream to-ivory">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Built for Jewelry Businesses</h2>
          <p className="text-muted leading-relaxed mb-6">
            We partner with wholesalers, retailers, brands and international buyers who need reliable manufacturing, consistent quality and flexible production capabilities.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 mb-8">
            {b2bAudience.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link to="/wholesale/register" className="bg-gold text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors">Become a Partner</Link>
            <Link to="/contact?type=quote" className="border border-gold text-gold-dark px-6 py-3 rounded-full text-sm font-medium hover:bg-gold hover:text-white transition-colors">Request a Quote</Link>
          </div>
        </div>
        <div className="bg-white/70 rounded-2xl p-8 border border-gold/20 shadow-lg shadow-gold/5">
          <h3 className="font-display text-2xl text-charcoal mb-4">Discuss Your Collection</h3>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Whether you need wholesale collections, private-label jewelry or ongoing manufacturing partnerships — our team is ready to support your business goals.
          </p>
          <Link to="/wholesale" className="text-gold-dark font-medium hover:underline">Explore wholesale options →</Link>
        </div>
      </div>
    </section>
  );
}
