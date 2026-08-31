import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import ProductImage from './ProductImage';

export default function ProductGallery({ product }) {
  const count = Math.max(product?.images?.length || 1, 1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  return (
    <div>
      <div className={`relative mb-4 group ${zoom ? 'overflow-visible z-10' : 'overflow-hidden rounded-xl'}`}>
        <div className={zoom ? 'scale-150 origin-center cursor-zoom-out' : 'cursor-zoom-in'} onClick={() => setZoom(!zoom)}>
          <ProductImage product={product} index={active} containerClassName="aspect-square overflow-hidden bg-cream rounded-xl" />
        </div>
        <button
          onClick={() => setZoom(!zoom)}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn size={18} />
        </button>
        {count > 1 && (
          <>
            <button onClick={() => setActive((active - 1 + count) % count)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setActive((active + 1) % count)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${active === i ? 'border-gold' : 'border-transparent'}`}
          >
            <ProductImage product={product} index={i} containerClassName="w-full h-full" loading="eager" />
          </button>
        ))}
      </div>
    </div>
  );
}
