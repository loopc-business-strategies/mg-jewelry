import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import HeroBanner from '../components/HeroBanner';
import WholesaleInquiryForm from '../components/WholesaleInquiryForm';
import WholesaleProductCard from '../components/WholesaleProductCard';
import { brand, categoryIcons, oppositeModelCopy } from '../utils/brandConfig';
import { wholesaleHero } from '../utils/imageConfig';
import { CheckCircle, Mail, MessageCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';
import { tierLabelText } from '../utils/displayText';

const bulkTiers = [
  { minQty: 10, maxQty: 24, discountPercent: 5 },
  { minQty: 25, maxQty: 49, discountPercent: 10 },
  { minQty: 50, maxQty: 99, discountPercent: 15 },
  { minQty: 100, discountPercent: 20 },
];

const asArray = (value) => (Array.isArray(value) ? value : []);

export default function WholesalePage() {
  const { t, tf } = useTranslation();
  const [products, setProducts] = useState([]);
  const [tiers, setTiers] = useState(bulkTiers);

  useEffect(() => {
    api.get('/wholesale/products?limit=8').then(({ data }) => setProducts(data.products?.slice(0, 8) || [])).catch(() => {});
    api.get('/wholesale/bulk-pricing').then(({ data }) => {
      if (Array.isArray(data) && data.length) setTiers(data);
    }).catch(() => {});
  }, []);

  const benefits = asArray(t('wholesalePage.benefits'));
  const faqs = asArray(t('wholesalePage.faqs'));
  const formatTier = (tier, i) => ({
    range: tier.maxQty
      ? tf('wholesalePage.tierRange', { min: tier.minQty, max: tier.maxQty })
      : tf('wholesalePage.tierRangePlus', { min: tier.minQty }),
    label: tierLabelText(t, tier.label, i),
    discount: tf('wholesalePage.tierOff', { n: tier.discountPercent }),
  });

  const requestCatalogue = () => {
    toast.success(t('wholesalePage.catalogueToast'));
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SEOHead title={t('wholesalePage.seoTitle')} description={t('wholesalePage.seoDesc')} path="/wholesale" schema={faqSchema} />

      <HeroBanner
        title={t('wholesalePage.heroTitle')}
        subtitle={t('wholesale.intlSubtitle')}
        image={wholesaleHero}
        primaryLink="/wholesale/register"
        secondaryLink="/wholesale/shop"
        compact
      />

      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-muted leading-relaxed border-s-2 border-border ps-4 text-start">
          {t('wholesale.oppositeModel') || oppositeModelCopy}
        </p>
      </div>

      <section className="py-8 px-4 max-w-4xl mx-auto">
        <div className="bg-white border border-border rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-charcoal mb-1">{brand.legalName}</p>
          <address className="text-sm text-muted not-italic">
            {brand.addressLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </address>
          <p className="text-xs text-gold-dark mt-2 uppercase tracking-wider">{t('wholesalePage.hq')}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/wholesale/register" className="btn-primary-gold text-xs">
          {t('wholesalePage.becomePartner')}
        </Link>
        <Link to="/wholesale/shop" className="btn-outline-gold text-xs">
          {t('wholesalePage.viewCollection')}
        </Link>
      </div>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="type-section-title text-center mb-10">{t('wholesalePage.whyTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3 p-4 bg-cream rounded-xl">
              <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="type-section-title text-center mb-10">{t('wholesalePage.categoriesTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categoryIcons.map((cat) => (
              <Link key={cat.slug} to={`/wholesale/shop?category=${cat.slug}`} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <span className="text-sm font-medium">{t(`categories.${cat.slug}`, cat.name)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="type-section-title text-center mb-10">{t('wholesalePage.collectionsTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <WholesaleProductCard key={p._id} product={p} showPrices={false} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/wholesale/shop" className="text-gold-dark font-medium hover:underline">{t('wholesalePage.viewCatalogue')}</Link>
          </div>
        </section>
      )}

      <section id="bulk-pricing" className="py-16 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="type-section-title text-center mb-10">{t('wholesalePage.bulkTitle')}</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {tiers.map(formatTier).map((tier, i) => (
              <div key={i} className="card-elegant p-6 text-center hover:border-border transition-colors">
                <p className="text-gold-dark font-semibold text-charcoal text-xl mb-2">{tier.label}</p>
                <p className="text-sm text-muted mb-2">{tier.range}</p>
                <p className="font-semibold text-charcoal">{tier.discount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <Download size={32} className="text-gold mx-auto mb-4" />
        <h2 className="type-section-title mb-4">{t('wholesalePage.catalogueTitle')}</h2>
        <p className="text-muted mb-6">{t('wholesalePage.catalogueDesc')}</p>
        <button onClick={requestCatalogue} className="btn-primary-gold text-xs">
          {t('wholesalePage.catalogueCta')}
        </button>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="type-section-title text-center mb-8">{t('wholesalePage.pricingTitle')}</h2>
        <WholesaleInquiryForm />
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="type-section-title mb-6">{t('wholesalePage.supportTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <Link to="/contact?type=quote" className="flex items-center gap-2 text-gold-dark hover:underline"><Mail size={16} className="text-gold" /> {t('wholesalePage.supportQuote')}</Link>
            <Link to="/contact?type=business" className="flex items-center gap-2 text-gold hover:underline"><MessageCircle size={16} className="text-gold" /> {t('wholesalePage.supportBusiness')}</Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="type-section-title text-center mb-8">{t('wholesalePage.faqTitle')}</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="border rounded-xl p-4">
              <h3 className="font-medium mb-2">{faq.q}</h3>
              <p className="text-sm text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
