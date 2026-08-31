import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import HeroBanner from '../components/HeroBanner';
import WholesaleInquiryForm from '../components/WholesaleInquiryForm';
import WholesaleProductCard from '../components/WholesaleProductCard';
import { brand, categoryIcons } from '../utils/brandConfig';
import { wholesaleHero } from '../utils/imageConfig';
import { CheckCircle, Phone, Mail, MessageCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const benefits = [
  'Competitive wholesale pricing', 'Bulk order discounts', 'Wide product selection',
  'Reliable supply', 'Fast dispatch', 'Dedicated business support',
  'Custom orders', 'Retailer-friendly margins',
];

const bulkTiers = [
  { range: '10–24 pieces', label: 'Level 1', discount: '5% off' },
  { range: '25–49 pieces', label: 'Level 2', discount: '10% off' },
  { range: '50–99 pieces', label: 'Level 3', discount: '15% off' },
  { range: '100+ pieces', label: 'Special Pricing', discount: '20% off' },
];

const faqs = [
  { q: 'How do I become a wholesale partner?', a: 'Fill out the registration form and our team will review your application within 2-3 business days.' },
  { q: 'What is the minimum order quantity?', a: 'MOQ varies by product, typically starting at 10 pieces per design.' },
  { q: 'Do you offer custom designs?', a: 'Yes, we accept custom orders for approved wholesale partners.' },
];

export default function WholesalePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/wholesale/products?limit=8').then(({ data }) => setProducts(data.products?.slice(0, 8) || [])).catch(() => {});
  }, []);

  const requestCatalogue = () => {
    toast.success('Catalogue request submitted! We will email you shortly.');
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
      <SEOHead title="Wholesale Jewellery" description="Premium wholesale jewellery for retailers and jewellery businesses." path="/wholesale" schema={faqSchema} />

      <HeroBanner
        title="Wholesale Jewellery for Growing Businesses"
        subtitle="Premium jewellery collections, competitive wholesale pricing and reliable supply for retailers and jewellery businesses."
        image={wholesaleHero}
        primaryLink="/wholesale/register"
        secondaryLink="/wholesale/shop"
        compact
      />

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/wholesale/register" className="bg-gold text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider text-center hover:bg-gold-dark transition-colors">
          BECOME A WHOLESALE PARTNER
        </Link>
        <Link to="/wholesale/shop" className="bg-white border-2 border-charcoal px-8 py-3 rounded-full text-sm font-medium tracking-wider text-center hover:bg-charcoal hover:text-white transition-colors">
          VIEW WHOLESALE COLLECTION
        </Link>
      </div>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl text-center mb-10">Why Wholesale With Us</h2>
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
          <h2 className="font-display text-3xl text-center mb-10">Wholesale Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categoryIcons.map((cat) => (
              <Link key={cat.slug} to={`/wholesale/shop?category=${cat.slug}`} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-10">Wholesale Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <WholesaleProductCard key={p._id} product={p} showPrices={false} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/wholesale/shop" className="text-gold-dark font-medium hover:underline">View Full Wholesale Catalogue →</Link>
          </div>
        </section>
      )}

      <section id="bulk-pricing" className="py-16 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-10">Bulk Pricing</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {bulkTiers.map((tier) => (
              <div key={tier.label} className="border border-gray-700 rounded-xl p-6 text-center">
                <p className="text-gold font-display text-xl mb-2">{tier.label}</p>
                <p className="text-sm text-gray-400 mb-2">{tier.range}</p>
                <p className="font-semibold">{tier.discount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <Download size={32} className="text-gold mx-auto mb-4" />
        <h2 className="font-display text-3xl mb-4">Download Wholesale Catalogue</h2>
        <p className="text-muted mb-6">Request our complete wholesale catalogue with pricing, MOQ details, and product specifications.</p>
        <button onClick={requestCatalogue} className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider hover:bg-gold transition-colors">
          REQUEST CATALOGUE
        </button>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl text-center mb-8">Request Wholesale Pricing</h2>
        <WholesaleInquiryForm />
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl mb-6">Dedicated Wholesale Support</h2>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <span className="flex items-center gap-2"><Phone size={16} className="text-gold" /> {brand.phone}</span>
            <span className="flex items-center gap-2"><Mail size={16} className="text-gold" /> wholesale@aurumgrove.com</span>
            <span className="flex items-center gap-2"><MessageCircle size={16} className="text-gold" /> WhatsApp</span>
          </div>
          <p className="text-muted mt-4">{brand.businessHours}</p>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl text-center mb-8">Wholesale FAQ</h2>
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
