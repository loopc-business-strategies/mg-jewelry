import { useState, useCallback } from 'react';
import {
  getCategoryFallback,
  getCategorySvgFallback,
  isLegacyImagePath,
  CATEGORY_FALLBACKS,
} from '../utils/imageConfig';

export default function SafeImage({
  src,
  alt = '',
  className = '',
  category,
  subcategory,
  loading = 'lazy',
}) {
  const lifestyleFallback = getCategoryFallback(category, subcategory);
  const svgFallback = getCategorySvgFallback(category, subcategory);
  const defaultJewelry = CATEGORY_FALLBACKS.default;

  const chain = [src, lifestyleFallback, defaultJewelry, svgFallback].filter(
    (url, i, arr) => url && !isLegacyImagePath(url) && arr.indexOf(url) === i
  );

  const [index, setIndex] = useState(0);
  const current = chain[index] || svgFallback;

  const handleError = useCallback(() => {
    setIndex((prev) => (prev < chain.length - 1 ? prev + 1 : prev));
  }, [chain.length]);

  return (
    <img
      key={current}
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
