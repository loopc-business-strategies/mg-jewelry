import { useState, useCallback } from 'react';
import { getCategoryFallback } from '../utils/imageConfig';

export default function SafeImage({
  src,
  alt = '',
  className = '',
  category,
  subcategory,
  loading = 'lazy',
}) {
  const fallback = getCategoryFallback(category, subcategory);
  const [current, setCurrent] = useState(src || fallback);
  const [stage, setStage] = useState(0);

  const handleError = useCallback(() => {
    setStage((prev) => {
      if (prev === 0 && fallback !== current) {
        setCurrent(fallback);
        return 1;
      }
      if (prev === 1) {
        setCurrent('/images/products/default-01.jpg');
        return 2;
      }
      return prev;
    });
  }, [fallback, current]);

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
