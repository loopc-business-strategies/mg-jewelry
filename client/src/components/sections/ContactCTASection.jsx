import { Link } from 'react-router-dom';
import { brand } from '../../utils/brandConfig';

export default function ContactCTASection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gold/10 via-champagne/30 to-coral/10 rounded-3xl p-12 border border-gold/20">
        <h2 className="font-display text-3xl text-charcoal mb-4">Ready to Partner With Us?</h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          Contact {brand.legalName} to discuss wholesale orders, custom manufacturing or international partnerships.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact?type=quote" className="bg-gold text-white px-8 py-3 rounded-full font-medium hover:bg-gold-dark transition-colors">Request a Quote</Link>
          <Link to="/contact" className="border border-gold text-gold-dark px-8 py-3 rounded-full font-medium hover:bg-gold hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
