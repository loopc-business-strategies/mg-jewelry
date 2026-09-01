import { Link } from 'react-router-dom';
import { brand } from '../utils/brandConfig';

function LogoMark({ className = 'h-10 w-auto' }) {
  if (!brand.logo) return null;
  return (
    <img
      src={brand.logo}
      alt={brand.logoAlt}
      className={`${className} object-contain shrink-0`}
      loading="eager"
      decoding="async"
    />
  );
}

export default function BrandLogo({ variant = 'header', className = '', linkTo = '/' }) {
  if (variant === 'auth') {
    const authContent = (
      <div className={`flex flex-col items-center mb-6 ${className}`}>
        <span className="font-display text-2xl text-charcoal tracking-wide">{brand.name}</span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted mt-1">Fine Jewelry</span>
      </div>
    );
    return authContent;
  }

  const content = {
    header: (
      <div className={`shrink-0 group ${className}`}>
        <LogoMark className="h-10 w-auto" />
      </div>
    ),
    footer: (
      <div className={`inline-block mb-4 ${className}`}>
        <LogoMark className="h-10 w-auto" />
      </div>
    ),
    admin: (
      <div className={className}>
        <p className="font-display text-xl text-gradient-gold">{brand.name}</p>
        <p className="text-xs text-muted mt-1">Admin Panel</p>
      </div>
    ),
    iconOnly: (
      <span className={`font-display text-xl text-charcoal tracking-wide shrink-0 ${className}`}>
        {brand.name}
      </span>
    ),
  }[variant];

  if (variant === 'header' || variant === 'footer') {
    if (!brand.logo) return null;
  }

  if (linkTo && variant !== 'admin') {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
