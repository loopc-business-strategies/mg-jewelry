import { useState } from 'react';

const LOGO_PNG = '/images/logo-modern-gold.png';
const LOGO_SVG = '/images/logo-modern-gold.svg';

export default function BrandLogo({ className = 'h-10 w-10 object-contain', alt = 'Modern Gold' }) {
  const [src, setSrc] = useState(LOGO_PNG);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => { if (src !== LOGO_SVG) setSrc(LOGO_SVG); }}
    />
  );
}
