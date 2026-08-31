import { useState, useCallback, useMemo } from 'react';
import { getCategoryFallback, getProductAlt, getProductImages } from '../utils/imageConfig';

const DEFAULT_FALLBACK = getCategoryFallback();

export default function ProductImage({
  product,
  index = 0,
  className = '',
  containerClassName = 'aspect-square overflow-hidden bg-cream',
  loading = 'lazy',
  sizes,
}) {
  const categoryFallback = getCategoryFallback(product?.category, product?.subcategory);
  const catalogImages = getProductImages(product?.category, product?.subcategory);

  const candidates = useMemo(() => {
    const urls = [];
    const add = (url) => {
      if (url && typeof url === 'string' && url.trim() && !urls.includes(url.trim())) {
        urls.push(url.trim());
      }
    };

    if (product?.images?.length) {
      product.images.forEach(add);
    } else {
      add(catalogImages[index]);
      add(catalogImages[0]);
    }

    if (index > 0) add(product?.images?.[index]);
    catalogImages.forEach(add);
    add(categoryFallback);
    add(DEFAULT_FALLBACK);

    return urls;
  }, [product, index, catalogImages, categoryFallback]);

  const startIndex = Math.min(index, Math.max(candidates.length - 1, 0));
  const [candidateIndex, setCandidateIndex] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);
  const src = candidates[candidateIndex] || DEFAULT_FALLBACK;

  const handleError = useCallback(() => {
    setLoaded(false);
    setCandidateIndex((prev) => (prev < candidates.length - 1 ? prev + 1 : prev));
  }, [candidates.length]);

  return (
    <div className={`relative ${containerClassName}`}>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden="true" />}
      <img
        key={src}
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
