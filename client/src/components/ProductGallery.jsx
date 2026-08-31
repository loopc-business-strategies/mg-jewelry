import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { getProductImage } from '../utils/imageConfig';

export default function ProductGallery({ product }) {
  const images = product?.images?.length ? product.images : [getProductImage(product)];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  return (
    <div>
      <div className="relative aspect-square bg-cream rounded-xl overflow-hidden mb-4 group">
        <img
          src={images[active]}
          alt={product?.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${zoom ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={() => setZoom(!zoom)}
        />
        <button
          onClick={() => setZoom(!zoom)}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn size={18} />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={() => setActive((active - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setActive((active + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${active === i ? 'border-gold' : 'border-transparent'}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
