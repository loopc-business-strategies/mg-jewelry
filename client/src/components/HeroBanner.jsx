import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ProductImage from './ProductImage';
import { formatPrice } from '../utils/formatPrice';

export default function HeroBanner({ title, subtitle, image, primaryLink = '/shop', secondaryLink = '/wholesale', compact = false }) {
  return (
    <section className={`relative overflow-hidden ${compact ? 'h-[40vh]' : 'h-[70vh] min-h-[500px]'}`}>
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-pearl/90 via-cream/75 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-xl text-charcoal animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl leading-tight mb-4">{title}</h1>
          <p className="text-lg text-muted mb-8">{subtitle}</p>
          <div className="flex gap-4 flex-wrap">
            <Link to={primaryLink} className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider transition-colors">
              Explore Collections
            </Link>
            <Link to={secondaryLink} className="border-2 border-gold text-gold-dark hover:bg-gold hover:text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider transition-colors">
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductCarousel({ products, title }) {
  const [start, setStart] = useState(0);
  const visible = 4;

  if (!products?.length) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl text-charcoal">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => setStart(Math.max(0, start - 1))} className="p-2 border border-gold/20 rounded-full hover:border-gold transition-colors" disabled={start === 0}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setStart(Math.min(products.length - visible, start + 1))} className="p-2 border border-gold/20 rounded-full hover:border-gold transition-colors" disabled={start >= products.length - visible}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden">
        {products.slice(start, start + visible).map((p) => (
          <Link key={p._id} to={`/product/${p._id}`} className="group">
            <div className="rounded-xl overflow-hidden mb-3 border border-gold/10">
              <ProductImage product={p} />
            </div>
            <h3 className="font-display text-lg line-clamp-1">{p.name}</h3>
            <p className="text-sm text-gold-dark">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CategoryCard({ name, slug, image }) {
  return (
    <Link to={`/shop/${slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/10">
      <img src={image} alt={`${name} collection by Modern Gold Jewelry`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="font-display text-2xl mb-2">{name}</h3>
        <span className="text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
          View Collection <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
