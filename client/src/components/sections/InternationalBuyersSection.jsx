import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { b2bAudience } from '../../utils/brandConfig';

const buyerFeatures = [
  'Business registration & verification',
  'Product catalogue with specifications',
  'MOQ, weight and purity options',
  'Request for Quotation (RFQ)',
  'Negotiated quotations',
  'International order process',
];

export default function InternationalBuyersSection() {
  return (
    <section className="section-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <p className="section-eyebrow mb-3">International Buyers</p>
            <h2 className="headline-corporate headline-corporate-light mb-6">
              Looking to Source Gold Jewellery for Your Business?
            </h2>
            <p className="text-off-white/70 leading-relaxed mb-8">
              Modern Gold works with international jewellers, gold traders, wholesalers, manufacturers and distributors.
              Register your business to access our catalogue and request quotations.
            </p>
            <ul className="space-y-3 mb-10">
              {buyerFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-off-white/80">
                  <CheckCircle size={16} className="text-gold shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link to="/buyers/register" className="btn-gold-solid">
              Become an International Buyer <ArrowRight size={16} />
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border border-gold/20 p-8 bg-dark-surface">
              <h3 className="font-display font-semibold text-off-white mb-6">We Work With</h3>
              <div className="grid grid-cols-2 gap-4">
                {b2bAudience.map((audience) => (
                  <div key={audience} className="flex items-center gap-2 text-sm text-off-white/70">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                    {audience}
                  </div>
                ))}
              </div>
              <Link to="/buyers" className="mt-8 inline-flex text-sm text-gold hover:text-gold-light transition-colors">
                Learn more about buyer partnerships →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
