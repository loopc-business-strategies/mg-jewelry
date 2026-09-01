import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { goldBuyingSteps, buyerJourneySteps } from '../../utils/brandConfig';

export default function DualPathSection() {
  return (
    <section className="section-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <p className="section-eyebrow mb-3">Two Business Paths</p>
          <h2 className="headline-corporate headline-corporate-light">
            How Can We Work Together?
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6">
          <ScrollReveal>
            <div className="dual-path-panel dual-path-panel-dark h-full">
              <p className="section-eyebrow text-gold mb-3">Local Sellers</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-off-white mb-4">
                Sell Your Gold
              </h3>
              <p className="text-off-white/70 mb-8 max-w-md">
                Bring your gold to Modern Gold. We welcome local individuals and businesses who want to sell gold.
              </p>
              <ol className="space-y-3 mb-10">
                {goldBuyingSteps.slice(0, 6).map((step, i) => (
                  <li key={step} className="process-step">
                    <span className="process-step-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-off-white/80 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <Link to="/gold-buying" className="btn-gold-solid">
                Start Selling <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="dual-path-panel dual-path-panel-dark h-full border-gold/25">
              <p className="section-eyebrow text-gold mb-3">International Buyers</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-off-white mb-4">
                Buy From Modern Gold
              </h3>
              <p className="text-off-white/70 mb-8 max-w-md">
                Source gold jewellery products for your business. Chains and bangles in 14K, 18K and 22K.
              </p>
              <ol className="space-y-3 mb-10">
                {buyerJourneySteps.map((step, i) => (
                  <li key={step} className="process-step">
                    <span className="process-step-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-off-white/80 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <Link to="/buyers/register" className="btn-gold-outline btn-gold-outline-light">
                Become a Buyer <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
