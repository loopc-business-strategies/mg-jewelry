import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductGallery from '../components/ProductGallery';
import ProductGrid from '../components/ProductGrid';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gold/10 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-dark">{value}</span>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isWholesaleApproved } = useAuth();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      api.get(`/products?category=${product.category}&limit=4`)
        .then(({ data }) => setSimilar(data.products.filter((p) => p._id !== product._id).slice(0, 4)))
        .catch(() => {});
    }
  }, [product]);

  const handleRequestQuote = () => {
    if (!user) {
      toast.error('Please login to request a quote');
      navigate('/login');
      return;
    }
    navigate('/rfq', { state: { product, quantity, notes } });
  };

  const handleAddToRFQ = () => {
    const rfqItems = JSON.parse(localStorage.getItem('rfqDraft') || '[]');
    const existing = rfqItems.find((i) => i.productId === product._id);
    if (existing) {
      existing.quantity = quantity;
      existing.notes = notes;
    } else {
      rfqItems.push({
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        purity: product.purity,
        quantity,
        notes,
      });
    }
    localStorage.setItem('rfqDraft', JSON.stringify(rfqItems));
    toast.success('Added to RFQ');
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16"><div className="skeleton h-96" /></div>;
  if (!product) return null;

  const availabilityLabel = {
    in_stock: 'In Stock',
    made_to_order: 'Made to Order',
    out_of_stock: 'Out of Stock',
  }[product.availability] || 'Made to Order';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription,
    sku: product.sku,
    image: product.images,
    brand: { '@type': 'Brand', name: 'Modern Gold' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/PreOrder',
      description: 'Price on request',
    },
  };

  return (
    <>
      <SEOHead title={product.name} description={product.shortDescription || `${product.name} — ${product.purity} gold. Request a quote.`} path={`/product/${id}`} schema={schema} type="product" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumbs items={[
          { label: 'Products', path: '/products' },
          { label: product.category, path: `/products/${product.category}` },
          { label: product.name },
        ]} />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ProductGallery product={product} />

          <div>
            <p className="section-eyebrow mb-2">{product.category?.replace(/-/g, ' ')}</p>
            <h1 className="headline-corporate headline-corporate-dark text-3xl md:text-4xl mb-2">{product.name}</h1>
            <p className="text-sm text-muted mb-6">SKU: {product.sku}</p>

            <div className="p-6 bg-white border border-gold/15 mb-6">
              <p className="text-2xl font-display font-semibold text-gold-dark mb-1">Price on Request</p>
              <p className="text-xs text-muted">International pricing via negotiated quotation</p>
            </div>

            <div className="mb-6">
              <SpecRow label="Purity" value={product.purity} />
              <SpecRow label="Metal" value={product.metal} />
              <SpecRow label="Weight" value={product.weight} />
              <SpecRow label="Weight Range" value={product.weightRange} />
              <SpecRow label="Length" value={product.length} />
              <SpecRow label="Width" value={product.width} />
              <SpecRow label="Diameter" value={product.diameter} />
              <SpecRow label="Design" value={product.design} />
              <SpecRow label="Finish" value={product.finish} />
              <SpecRow label="Gold Colour" value={product.goldColour} />
              <SpecRow label="MOQ" value={product.moq ? `${product.moq} units` : null} />
              <SpecRow label="Lead Time" value={product.productionLeadTime} />
              <SpecRow label="Availability" value={availabilityLabel} />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center border border-gold/20 w-fit">
                <button type="button" onClick={() => setQuantity(Math.max(product.moq || 1, quantity - 1))} className="px-4 py-2 hover:bg-off-white">−</button>
                <span className="px-4 min-w-[3rem] text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-off-white">+</button>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Notes / Specifications</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Size, weight requirements, purity preferences..."
                className="input-elegant resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button type="button" onClick={handleRequestQuote} className="btn-gold-solid flex-1 justify-center">
                Request Quote <ArrowRight size={16} />
              </button>
              <button type="button" onClick={handleAddToRFQ} className="btn-gold-outline flex-1 justify-center">
                Add to RFQ
              </button>
            </div>

            {!isWholesaleApproved && user && (
              <p className="text-xs text-muted mb-4">
                Your buyer account is pending approval. You can still submit RFQs for review.
              </p>
            )}

            {product.description && (
              <div className="pt-6 border-t border-gold/10">
                <h2 className="font-display font-semibold text-lg mb-3">Product Description</h2>
                <p className="text-sm text-muted leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gold/10">
            <h2 className="headline-corporate headline-corporate-dark text-2xl mb-8">Related Products</h2>
            <ProductGrid products={similar} variant="b2b" />
          </section>
        )}
      </div>
    </>
  );
}
