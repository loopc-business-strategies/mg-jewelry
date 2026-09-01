import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ScrollReveal from '../components/ScrollReveal';
import { buyerJourneySteps, seoKeywords, b2bAudience } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';

export default function BuyersPage() {
  const { t } = useTranslation();
  const audience = t('audience');
  const steps = t('steps.buyerJourney');

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
            <p className="section-eyebrow text-gold mb-3">{t('buyers.eyebrow')}</p>
            <h1 className="headline-corporate headline-corporate-light mb-6">
              {t('buyers.title')}
            </h1>
            <p className="text-off-white/70 max-w-2xl text-lg mb-6">
              {t('buyers.intro')}
            </p>
            <p className="text-off-white/50 max-w-2xl text-sm mb-10 leading-relaxed border-l-2 border-gold/40 pl-4">
              {t('buyers.oppositeModel')}
            </p>
            <Link to="/buyers/register" className="btn-gold-solid">
              {t('cta.becomeBuyer')} <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-12">
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-4">{t('buyers.weWorkWith')}</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {(Array.isArray(audience) ? audience : b2bAudience).map((item) => (
              <ScrollReveal key={item}>
                <div className="flex items-center gap-3 p-5 bg-white border border-gold/10">
                  <CheckCircle size={18} className="text-gold shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-8">{t('buyers.buyerJourney')}</h2>
            <div className="grid sm:grid-cols-5 gap-4">
              {(Array.isArray(steps) ? steps : buyerJourneySteps).map((step, i) => (
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
          <h2 className="headline-corporate headline-corporate-light text-2xl mb-6">{t('buyers.ready')}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/buyers/register" className="btn-gold-solid">{t('cta.registerBusiness')}</Link>
            <Link to="/products" className="btn-gold-outline btn-gold-outline-light">{t('cta.viewProducts')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
