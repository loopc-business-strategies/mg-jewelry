import { useState, useCallback, useMemo } from 'react';
import {
  getCategoryFallback,
  getCategorySvgFallback,
  getProductAlt,
  getProductImages,
  isLegacyImagePath,
  isCatalogProductImagePath,
  CATEGORY_FALLBACKS,
} from '../utils/imageConfig';

const DEFAULT_JEWELRY = CATEGORY_FALLBACKS.default;
const DEFAULT_SVG = getCategorySvgFallback();

export default function ProductImage({
  product,
  index = 0,
  className = '',
  containerClassName = 'aspect-square overflow-hidden bg-cream',
  loading = 'lazy',
  sizes,
}) {
  const categoryFallback = getCategoryFallback(product?.category, product?.subcategory);
  const svgFallback = getCategorySvgFallback(product?.category, product?.subcategory);
  const catalogImages = getProductImages(product?.category, product?.subcategory, product?.sku);

  const candidates = useMemo(() => {
    const urls = [];
    const add = (url) => {
      if (url && typeof url === 'string' && url.trim() && !isLegacyImagePath(url) && !urls.includes(url.trim())) {
        urls.push(url.trim());
      }
    };

    if (product?.images?.length) {
      if (index > 0 && product.images[index]) add(product.images[index]);
      product.images.forEach(add);
    }

    add(catalogImages[index]);
    add(catalogImages[0]);
    add(categoryFallback);
    add(DEFAULT_JEWELRY);
    add(svgFallback);
    add(DEFAULT_SVG);

    return urls;
  }, [product, index, catalogImages, categoryFallback, svgFallback]);

  const startIndex = Math.min(index, Math.max(candidates.length - 1, 0));
  const [candidateIndex, setCandidateIndex] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);
  const src = candidates[candidateIndex] || DEFAULT_SVG;
  const isCatalogue = isCatalogProductImagePath(src);
  const fitClass = isCatalogue ? 'object-contain' : 'object-cover';

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
        className={`w-full h-full ${fitClass} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading={loading}
        decoding="async"
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}
