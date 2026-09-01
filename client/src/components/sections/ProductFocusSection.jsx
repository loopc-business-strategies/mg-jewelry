import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import SafeImage from '../SafeImage';
import { purityOptions, productCategories } from '../../utils/brandConfig';
import { resolveProductImage } from '../../utils/imageConfig';
import api from '../../services/api';

export default function ProductFocusSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products?limit=4&featured=true')
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => {
        api.get('/products?limit=4').then(({ data }) => setProducts(data.products || [])).catch(() => {});
      });
  }, []);

  return (
    <section className="section-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="text-center mb-6">
          <p className="section-eyebrow mb-3">Products</p>
          <h2 className="headline-corporate headline-corporate-dark mb-4">
            Chains & Bangles
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Gold chains and bangles manufactured for international business buyers. Available in multiple purities.
          </p>
        </ScrollReveal>

        <ScrollReveal className="flex flex-wrap justify-center gap-3 mb-12">
          {purityOptions.map((p) => (
            <span key={p} className="px-5 py-2 text-sm font-medium border border-gold/30 text-gold-dark bg-white">
              {p}
            </span>
          ))}
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.length > 0 ? products.map((product) => (
            <ScrollReveal key={product._id}>
              <Link to={`/product/${product._id}`} className="group block bg-white border border-gold/10 overflow-hidden">
                <div className="aspect-square overflow-hidden bg-ivory">
                  <SafeImage
                    src={resolveProductImage(product)}
                    alt={product.name}
                    category={product.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] tracking-wider uppercase text-muted mb-1">{product.sku}</p>
                  <h3 className="font-display font-semibold text-dark mb-1">{product.name}</h3>
                  <p className="text-xs text-gold-dark">{product.purity || 'Gold'} · Price on Request</p>
                </div>
              </Link>
            </ScrollReveal>
          )) : (
            productCategories.map((cat) => (
              <ScrollReveal key={cat.slug}>
                <Link to={`/products/${cat.slug}`} className="block bg-white border border-gold/10 p-8 text-center hover:border-gold/30 transition-colors">
                  <h3 className="font-display text-xl font-semibold text-dark mb-2">{cat.label}</h3>
                  <p className="text-sm text-muted mb-4">14K · 18K · 22K</p>
                  <span className="text-xs text-gold-dark uppercase tracking-wider">View Catalogue →</span>
                </Link>
              </ScrollReveal>
            ))
          )}
        </div>

        <ScrollReveal className="text-center">
          <Link to="/products" className="btn-gold-solid">
            View Full Catalogue <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
