import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function FinalCTASection() {
  return (
    <section className="section-light py-20 md:py-28 border-t border-gold/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="headline-corporate headline-corporate-dark mb-6">
            Ready to Work With Modern Gold?
          </h2>
          <p className="text-muted mb-10 max-w-xl mx-auto">
            Whether you want to sell gold or source gold jewellery for your business, Modern Gold is your trusted partner in the gold industry.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/gold-buying" className="btn-gold-solid">
              Sell Your Gold <ArrowRight size={16} />
            </Link>
            <Link to="/buyers/register" className="btn-gold-outline">
              Become an International Buyer <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
