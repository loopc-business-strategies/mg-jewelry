import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [pincode, setPincode] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [tab, setTab] = useState('details');
  const [loading, setLoading] = useState(true);

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
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));

    api.get(`/products/${id}/reviews`).then(({ data }) => setReviews(data)).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (product) {
      api.get(`/products?category=${product.category}&limit=4`)
        .then(({ data }) => setSimilar(data.products.filter((p) => p._id !== product._id).slice(0, 4)))
        .catch(() => {});
    }
  }, [product]);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDelivery({ date: '3-5 business days', available: true });
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity, size);
  };

  const handleBuyNow = () => {
    addToCart(product._id, quantity, size);
    navigate('/checkout');
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

  return (
    <>
      <SEOHead title={product.name} description={product.shortDescription} path={`/product/${id}`} schema={schema} type="product" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Shop', path: '/shop' },
          { label: product.category, path: `/shop/${product.category}` },
          { label: product.name },
        ]} />

        <div className="grid lg:grid-cols-2 gap-12">
          <ProductGallery product={product} />

          <div>
            <h1 className="type-card-title text-xl md:text-2xl mb-2">{product.name}</h1>
            <div className="mb-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <p className="type-micro normal-case text-muted mb-4">Product Code: {product.sku}</p>

            <PriceDisplay price={product.price} mrp={product.mrp} size="lg" showEmi />
            <p className="type-body-sm mt-2">EMI from {formatPrice(calcEmi(product.price))}/month · No Cost EMI available</p>

            <div className="grid grid-cols-2 gap-4 my-6 p-5 card-elegant type-body-sm">
              <div><span className="text-muted">Metal:</span> <strong className="text-charcoal font-medium">{product.metal}</strong></div>
              <div><span className="text-muted">Purity:</span> <strong className="text-gold font-semibold">{product.purity}</strong></div>
              {product.weight && <div><span className="text-muted">Weight:</span> <strong>{product.weight}</strong></div>}
              {product.diamondDetails?.hasDiamond && (
                <>
                  <div><span className="text-muted">Carat:</span> <strong>{product.diamondDetails.carat}</strong></div>
                  <div><span className="text-muted">Clarity:</span> <strong>{product.diamondDetails.clarity}</strong></div>
                  <div><span className="text-muted">Color:</span> <strong>{product.diamondDetails.color}</strong></div>
                  <div><span className="text-muted">Cut:</span> <strong>{product.diamondDetails.cut}</strong></div>
                </>
              )}
            </div>

            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <label className="type-form-label">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 border rounded-lg text-sm ${size === s ? 'border-border bg-gold/10' : 'hover:border-border'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="type-form-label">Quantity</label>
              <div className="flex items-center border rounded-lg w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-cream">−</button>
                <span className="px-4">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-cream">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="flex-1 btn-primary-ink justify-center text-xs">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 btn-outline-elegant justify-center text-xs">
                Buy Now
              </button>
              <WishlistButton productId={product._id} className="!static" />
            </div>

            <div className="border rounded-xl p-4 mb-6">
              <label className="type-form-label">Check Delivery Date</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 input-elegant"
                />
                <button onClick={checkDelivery} className="bg-gold text-white px-4 py-2 rounded-lg text-sm">Check</button>
              </div>
              {delivery && <p className="text-sm text-green-600 mt-2">✓ Delivery in {delivery.date}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: Truck, text: 'Free shipping above ₹5,000' },
                { icon: RotateCcw, text: '15-day easy returns' },
                { icon: Shield, text: 'Secure payments' },
                { icon: Award, text: 'Certified jewellery' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-muted">
                  <Icon size={16} className="text-gold shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b gap-8">
            {['details', 'specs', 'care', 'faq'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`pb-3 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-border text-gold' : 'text-muted'}`}>
                {t === 'faq' ? 'FAQ' : t === 'specs' ? 'Specifications' : t === 'care' ? 'Jewellery Care' : 'Product Details'}
              </button>
            ))}
          </div>
          <div className="py-6 text-sm text-muted leading-relaxed">
            {tab === 'details' && <p>{product.description}</p>}
            {tab === 'specs' && (
              <dl className="grid grid-cols-2 gap-4">
                <div><dt className="font-medium text-charcoal">SKU</dt><dd>{product.sku}</dd></div>
                <div><dt className="font-medium text-charcoal">Metal</dt><dd>{product.metal}</dd></div>
                <div><dt className="font-medium text-charcoal">Purity</dt><dd>{product.purity}</dd></div>
                <div><dt className="font-medium text-charcoal">Weight</dt><dd>{product.weight || 'N/A'}</dd></div>
              </dl>
            )}
            {tab === 'care' && <p>Store in a dry place. Clean with a soft cloth. Avoid contact with perfumes and chemicals. Professional cleaning recommended annually.</p>}
            {tab === 'faq' && (
              <div className="space-y-4">
                <div><strong>Is this BIS hallmarked?</strong><p>Yes, all our gold jewellery is BIS hallmarked.</p></div>
                <div><strong>Can I resize this?</strong><p>Complimentary resizing within 15 days of purchase.</p></div>
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="type-section-title text-xl md:text-2xl mb-6">You May Also Like</h2>
            <ProductGrid products={similar} />
          </section>
        )}

        <RecentlyViewed excludeId={product._id} />
      </div>
    </>
  );
}
