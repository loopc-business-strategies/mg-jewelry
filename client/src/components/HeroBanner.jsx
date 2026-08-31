import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function HeroBanner({ title, subtitle, image, primaryLink = '/shop', secondaryLink = '/shop?collection=premium', compact = false }) {
  return (
    <section className={`relative overflow-hidden ${compact ? 'h-[40vh]' : 'h-[70vh] min-h-[500px]'}`}>
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-xl text-white animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl leading-tight mb-4">{title}</h1>
          <p className="text-lg text-gray-200 mb-8">{subtitle}</p>
          <div className="flex gap-4">
            <Link to={primaryLink} className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider transition-colors">
              SHOP NOW
            </Link>
            <Link to={secondaryLink} className="border border-white text-white hover:bg-white hover:text-charcoal px-8 py-3 rounded-full text-sm font-medium tracking-wider transition-colors">
              EXPLORE COLLECTION
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
          <button onClick={() => setStart(Math.max(0, start - 1))} className="p-2 border rounded-full hover:border-gold transition-colors" disabled={start === 0}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setStart(Math.min(products.length - visible, start + 1))} className="p-2 border rounded-full hover:border-gold transition-colors" disabled={start >= products.length - visible}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden">
        {products.slice(start, start + visible).map((p) => (
          <Link key={p._id} to={`/product/${p._id}`} className="group">
            <div className="aspect-square rounded-xl overflow-hidden bg-cream mb-3">
              <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <h3 className="font-display text-lg line-clamp-1">{p.name}</h3>
            <p className="text-sm text-gold-dark">₹{p.price?.toLocaleString('en-IN')}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CategoryCard({ name, slug, image }) {
  return (
    <Link to={`/shop/${slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="font-display text-2xl mb-2">{name}</h3>
        <span className="text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
          Shop Now <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
