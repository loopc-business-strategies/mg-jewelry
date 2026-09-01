import { Link } from 'react-router-dom';
import { brand } from '../../utils/brandConfig';

export default function ContactCTASection() {
  return (
    <section className="cta-gradient-band py-16 px-4">
      <div className="max-w-4xl mx-auto text-center p-12 md:p-16">
        <p className="text-[0.6875rem] uppercase tracking-[0.15em] font-semibold text-white/80 mb-3">Get in Touch</p>
        <h2 className="text-3xl font-semibold text-white mb-4">Ready to Partner With Us?</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          Contact {brand.legalName} to discuss wholesale orders, custom manufacturing or international partnerships.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact?type=quote" className="btn-primary-gold text-xs bg-white text-charcoal hover:brightness-100">Request a Quote</Link>
          <Link to="/contact" className="inline-flex items-center gap-2 border border-white/40 text-white px-5 py-3 text-xs font-semibold rounded-md hover:bg-white/10 transition-colors">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
