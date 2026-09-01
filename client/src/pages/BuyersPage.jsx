import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ScrollReveal from '../components/ScrollReveal';
import { b2bAudience, buyerJourneySteps, seoKeywords } from '../utils/brandConfig';

export default function BuyersPage() {
  return (
    <>
      <SEOHead
        title="Source Gold Jewellery From Modern Gold"
        description="Become an international buyer partner with Modern Gold. Gold chains and bangles for jewellers, traders and wholesalers."
        path="/buyers"
        keywords={seoKeywords}
      />

      <section className="section-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <p className="section-eyebrow text-gold mb-3">International Buyers</p>
            <h1 className="headline-corporate headline-corporate-light mb-6">
              Source Gold Jewellery From Modern Gold
            </h1>
            <p className="text-off-white/70 max-w-2xl text-lg mb-10">
              Modern Gold manufactures gold chains and bangles for international business partners.
              Register your business to access our catalogue and request quotations.
            </p>
            <Link to="/buyers/register" className="btn-gold-solid">
              Become a Buyer <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-12">
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-4">We Work With</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {b2bAudience.map((audience) => (
              <ScrollReveal key={audience}>
                <div className="flex items-center gap-3 p-5 bg-white border border-gold/10">
                  <CheckCircle size={18} className="text-gold shrink-0" />
                  <span className="text-sm font-medium">{audience}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-8">Buyer Journey</h2>
            <div className="grid sm:grid-cols-5 gap-4">
              {buyerJourneySteps.map((step, i) => (
                <div key={step} className="text-center p-4 border border-gold/15 bg-white">
                  <p className="text-gold font-semibold text-sm mb-2">{String(i + 1).padStart(2, '0')}</p>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-dark py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="headline-corporate headline-corporate-light text-2xl mb-6">Ready to Partner?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/buyers/register" className="btn-gold-solid">Register Business</Link>
            <Link to="/products" className="btn-gold-outline btn-gold-outline-light">View Products</Link>
          </div>
        </div>
      </section>
    </>
  );
}
