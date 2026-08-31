import { useState, useCallback } from 'react';
import { resolveProductImage, getCategoryFallback, getProductAlt } from '../utils/imageConfig';

const DEFAULT_FALLBACK = getCategoryFallback();

export default function ProductImage({
  product,
  index = 0,
  className = '',
  containerClassName = 'aspect-square overflow-hidden bg-cream',
  loading = 'lazy',
  sizes,
}) {
  const primary = resolveProductImage(product, index);
  const categoryFallback = getCategoryFallback(product?.category, product?.subcategory);
  const [src, setSrc] = useState(primary);
  const [loaded, setLoaded] = useState(false);
  const [stage, setStage] = useState(0);

  const handleError = useCallback(() => {
    setStage((prev) => {
      if (prev === 0 && categoryFallback !== src) {
        setSrc(categoryFallback);
        return 1;
      }
      if (prev <= 1 && DEFAULT_FALLBACK !== src) {
        setSrc(DEFAULT_FALLBACK);
        return 2;
      }
      return prev;
    });
  }, [categoryFallback, src]);

  return (
    <div className={`relative ${containerClassName}`}>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={getProductAlt(product, index)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading={loading}
        decoding="async"
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}
