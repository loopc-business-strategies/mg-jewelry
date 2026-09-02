import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductGallery from '../components/ProductGallery';
import PriceDisplay from '../components/PriceDisplay';
import ProductGrid from '../components/ProductGrid';
import RecentlyViewed from '../components/RecentlyViewed';
import WishlistButton from '../components/WishlistButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, calcEmi } from '../utils/formatPrice';
import StarRating from '../components/ui/StarRating';
import { Truck, Shield, RotateCcw, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

const TAB_KEYS = {
  details: 'product.tabDetails',
  specs: 'product.tabSpecs',
  care: 'product.tabCare',
  reviews: 'product.tabReviews',
  faq: 'product.tabFaq',
};

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, tf, lang } = useTranslation();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [pincode, setPincode] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [tab, setTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setSize(data.sizes?.[0] || 'Standard');
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const updated = [data._id, ...viewed.filter((v) => v !== data._id)].slice(0, 8);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      })
      .catch(() => toast.error(t('product.notFound')))
      .finally(() => setLoading(false));

    api.get(`/products/${id}/reviews`).then(({ data }) => setReviews(Array.isArray(data) ? data : [])).catch(() => {});
  }, [id, lang, t]);

  useEffect(() => {
    if (product) {
      api.get(`/products?category=${product.category}&limit=4`)
        .then(({ data }) => setSimilar(data.products.filter((p) => p._id !== product._id).slice(0, 4)))
        .catch(() => {});
    }
  }, [product, lang]);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDelivery({ date: '3-5 business days', available: true });
    } else {
      toast.error(t('product.invalidPincode'));
    }
  };

  const handleAddToCart = () => addToCart(product._id, quantity, size);
  const handleBuyNow = () => { addToCart(product._id, quantity, size); navigate('/checkout'); };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('product.loginToReview'));
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success(t('product.reviewSubmitted'));
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('product.reviewFailed'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const tabLabel = (tabId) => {
    if (tabId === 'reviews') return `${t('product.tabReviews')} (${reviews.length})`;
    return t(TAB_KEYS[tabId]);
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16"><div className="skeleton h-96 rounded-xl" /></div>;
  if (!product) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'INR', availability: product.stock > 0 ? 'InStock' : 'OutOfStock' },
  };

  const perks = [
    { icon: Truck, text: t('product.freeShipping') },
    { icon: RotateCcw, text: t('product.easyReturns') },
    { icon: Shield, text: t('product.securePayments') },
    { icon: Award, text: t('product.certified') },
  ];

  return (
    <>
      <SEOHead title={product.name} description={product.shortDescription} path={`/product/${id}`} schema={schema} type="product" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: t('common.shop'), path: '/shop' },
          { label: t(`categories.${product.category}`) || product.category, path: `/shop/${product.category}` },
          { label: product.name },
        ]} />

        <div className="grid lg:grid-cols-2 gap-12">
          <ProductGallery product={product} />

          <div>
            <h1 className="type-card-title mb-2">{product.name}</h1>
            <div className="mb-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <p className="type-micro normal-case text-muted mb-4">{t('product.productCode')}: {product.sku}</p>

            <PriceDisplay price={product.price} mrp={product.mrp} size="lg" showEmi />
            <p className="type-body-sm mt-2">{tf('product.emiFrom', { amount: formatPrice(calcEmi(product.price)) })}</p>

            <div className="grid grid-cols-2 gap-4 my-6 p-5 card-elegant type-body-sm">
              <div><span className="text-muted">{t('product.metal')}:</span> <strong className="text-charcoal font-medium">{product.metal}</strong></div>
              <div><span className="text-muted">{t('product.purity')}:</span> <strong className="text-gold font-semibold">{product.purity}</strong></div>
              {product.weight && <div><span className="text-muted">{t('product.weight')}:</span> <strong>{product.weight}</strong></div>}
              {product.diamondDetails?.hasDiamond && (
                <>
                  <div><span className="text-muted">{t('product.carat')}:</span> <strong>{product.diamondDetails.carat}</strong></div>
                  <div><span className="text-muted">{t('product.clarity')}:</span> <strong>{product.diamondDetails.clarity}</strong></div>
                  <div><span className="text-muted">{t('product.color')}:</span> <strong>{product.diamondDetails.color}</strong></div>
                  <div><span className="text-muted">{t('product.cut')}:</span> <strong>{product.diamondDetails.cut}</strong></div>
                </>
              )}
            </div>

            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <label className="type-form-label">{t('product.size')}</label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 border rounded-lg text-sm ${size === s ? 'border-border bg-gold/10' : 'hover:border-border'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="type-form-label">{t('product.quantity')}</label>
              <div className="flex items-center border rounded-lg w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-cream">−</button>
                <span className="px-4">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-cream">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="flex-1 btn-primary-ink justify-center text-xs">{t('product.addToCart')}</button>
              <button onClick={handleBuyNow} className="flex-1 btn-outline-elegant justify-center text-xs">{t('product.buyNow')}</button>
              <WishlistButton productId={product._id} className="!static" />
            </div>

            <div className="border rounded-xl p-4 mb-6">
              <label className="type-form-label">{t('product.checkDelivery')}</label>
              <div className="flex gap-2">
                <input type="text" placeholder={t('product.enterPincode')} maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} className="flex-1 input-elegant" />
                <button onClick={checkDelivery} className="bg-gold text-white px-4 py-2 rounded-lg text-sm">{t('product.check')}</button>
              </div>
              {delivery && <p className="text-sm text-green-600 mt-2">✓ {tf('product.deliveryIn', { date: delivery.date })}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-muted">
                  <Icon size={16} className="text-gold shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex border-b gap-8">
            {Object.keys(TAB_KEYS).map((tabId) => (
              <button key={tabId} onClick={() => setTab(tabId)} className={`pb-3 text-sm font-medium capitalize ${tab === tabId ? 'border-b-2 border-border text-gold' : 'text-muted'}`}>
                {tabLabel(tabId)}
              </button>
            ))}
          </div>
          <div className="py-6 text-sm text-muted leading-relaxed">
            {tab === 'details' && <p>{product.description}</p>}
            {tab === 'specs' && (
              <dl className="grid grid-cols-2 gap-4">
                <div><dt className="font-medium text-charcoal">SKU</dt><dd>{product.sku}</dd></div>
                <div><dt className="font-medium text-charcoal">{t('product.metal')}</dt><dd>{product.metal}</dd></div>
                <div><dt className="font-medium text-charcoal">{t('product.purity')}</dt><dd>{product.purity}</dd></div>
                <div><dt className="font-medium text-charcoal">{t('product.weight')}</dt><dd>{product.weight || t('product.na')}</dd></div>
              </dl>
            )}
            {tab === 'care' && <p>{t('product.careText')}</p>}
            {tab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p>{t('product.noReviews')}</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={r.rating} />
                        <span className="font-medium text-charcoal">{r.userId?.name || t('product.customer')}</span>
                        {r.verifiedPurchase && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{t('product.verified')}</span>}
                      </div>
                      <p>{r.comment}</p>
                      <p className="text-xs text-muted mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
                {user && (
                  <form onSubmit={submitReview} className="mt-6 space-y-3 border-t pt-6">
                    <h3 className="font-medium text-charcoal">{t('product.writeReview')}</h3>
                    <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="input-elegant">
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{tf('product.stars', { n })}</option>)}
                    </select>
                    <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder={t('product.shareExperience')} className="input-elegant w-full min-h-[80px]" required />
                    <button type="submit" disabled={submittingReview} className="btn-primary-gold text-xs">{submittingReview ? t('common.submitting') : t('product.submitReview')}</button>
                  </form>
                )}
              </div>
            )}
            {tab === 'faq' && (
              <div className="space-y-4">
                <div><strong>{t('product.faqHallmark')}</strong><p>{t('product.faqHallmarkA')}</p></div>
                <div><strong>{t('product.faqResize')}</strong><p>{t('product.faqResizeA')}</p></div>
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="type-section-title mb-6">{t('product.similar')}</h2>
            <ProductGrid products={similar} />
          </section>
        )}

        <RecentlyViewed excludeId={product._id} />
      </div>
    </>
  );
}
