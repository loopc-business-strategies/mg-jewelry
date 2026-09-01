import { Link } from 'react-router-dom';
import { brand } from '../utils/brandConfig';

function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <img
      src={brand.logoIcon}
      alt={brand.logoAlt}
      className={`${className} object-contain shrink-0 rounded-md`}
      loading="eager"
      decoding="async"
    />
  );
}

export default function BrandLogo({ variant = 'header', className = '', linkTo = '/' }) {
  if (variant === 'iconOnly') {
    return <LogoMark className={className || 'h-10 w-10'} />;
  }

  if (variant === 'auth') {
    return (
      <div className={`flex justify-center mb-6 ${className}`}>
        <LogoMark className="h-14 w-14" />
      </div>
    );
  }

  const content = {
    header: (
      <div className={`flex flex-col items-center lg:items-start shrink-0 group ${className}`}>
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-10 w-10" />
          <span className="font-display text-xl md:text-2xl text-charcoal tracking-wide">{brand.name}</span>
        </div>
        <span className="text-[9px] tracking-[0.25em] uppercase text-muted hidden md:block lg:ml-[3.125rem]">
          Fine Jewelry
        </span>
      </div>
    ),
    footer: (
      <div className={`inline-block mb-4 ${className}`}>
        <div className="flex items-center gap-3 mb-1">
          <LogoMark className="h-10 w-10" />
          <p className="font-display text-2xl text-charcoal tracking-wide">{brand.name}</p>
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold-dark lg:ml-[3.25rem]">
          International Jewelry
        </p>
      </div>
    ),
    admin: (
      <div className={className}>
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <p className="font-display text-xl text-gradient-gold">{brand.name}</p>
        </div>
        <p className="text-xs text-muted mt-1 lg:ml-[2.875rem]">Admin Panel</p>
      </div>
    ),
  }[variant];

  if (linkTo && variant !== 'admin') {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
