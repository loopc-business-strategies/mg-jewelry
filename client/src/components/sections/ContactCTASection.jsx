import { Link } from 'react-router-dom';
import { brand } from '../../utils/brandConfig';

export default function ContactCTASection() {
  return (
    <section className="py-16 px-4 bg-linen">
      <div className="max-w-4xl mx-auto text-center card-elegant p-12 md:p-16">
        <p className="section-eyebrow mb-3">Get in Touch</p>
        <h2 className="font-display text-3xl text-charcoal mb-4">Ready to Partner With Us?</h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          Contact {brand.legalName} to discuss wholesale orders, custom manufacturing or international partnerships.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact?type=quote" className="btn-primary-ink text-xs">Request a Quote</Link>
          <Link to="/contact" className="btn-outline-elegant text-xs">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
