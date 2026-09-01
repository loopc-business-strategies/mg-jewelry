import { Link } from 'react-router-dom';
import { brand } from '../utils/brandConfig';

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
      <div className={`flex flex-col items-center lg:items-start shrink-0 group ${className}`}>
        <span className="font-display text-xl md:text-2xl text-charcoal tracking-wide">{brand.name}</span>
        <span className="text-[9px] tracking-[0.25em] uppercase text-muted hidden md:block">
          Fine Jewelry
        </span>
      </div>
    ),
    footer: (
      <div className={`inline-block mb-4 ${className}`}>
        <p className="font-display text-2xl text-charcoal tracking-wide mb-1">{brand.name}</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold-dark">
          International Jewelry
        </p>
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

  if (linkTo && variant !== 'admin') {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
