import { Link } from 'react-router-dom';
import { brand } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';

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
  const { t } = useTranslation();
  if (variant === 'auth') {
    const authContent = (
      <div className={`flex flex-col items-center mb-6 ${className}`}>
        <span className="font-display text-lg text-charcoal tracking-wide">{brand.name}</span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted mt-1">{t('ui.fineJewelry')}</span>
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
    iconOnly: (
      <span className={`font-display text-xl text-charcoal tracking-wide shrink-0 ${className}`}>
        {brand.name}
      </span>
    ),
  }[variant];

  if (variant === 'header' || variant === 'footer') {
    if (!brand.logo) return null;
  }

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
