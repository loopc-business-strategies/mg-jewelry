import { Link } from 'react-router-dom';
import { Globe2, Users } from 'lucide-react';
import SafeImage from '../SafeImage';
import { dualPathImages } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

function DualPathCard({
  image,
  imageAlt,
  variant,
  icon: Icon,
  title,
  description,
  ctaTo,
  ctaLabel,
  ctaClass,
}) {
  return (
    <div
      className={`dual-path-card dual-path-card--${variant} relative overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] min-h-[420px] md:min-h-[440px] flex flex-col`}
    >
      <SafeImage
        src={image}
        alt={imageAlt}
        disableFallback
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className={`dual-path-card-overlay dual-path-card-overlay--${variant}`} aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center text-center px-8 pt-24 md:pt-28 pb-10 flex-1 justify-end">
        <div className="dual-path-icon-badge">
          <Icon
            className={variant === 'sell' ? 'text-gold' : 'text-charcoal'}
            size={22}
            strokeWidth={1.5}
          />
        </div>
        <h3 className="type-card-title mb-3">
          {title}
        </h3>
        <p className="type-card-desc prose-card mx-auto mb-8">{description}</p>
        <Link to={ctaTo} className={ctaClass}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

export default function DualPathSection() {
  const { t } = useTranslation();

  return (
    <section className="dual-path-section py-20 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14 max-w-[700px] mx-auto">
          <p className="section-eyebrow">{t('dualPath.eyebrow')}</p>
          <h2 className="type-section-title mb-4">
            {t('dualPath.title')}
          </h2>
          <p className="type-section-desc prose-section mx-auto">
            {t('dualPath.oppositeModel')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <DualPathCard
            variant="sell"
            icon={Users}
            image={dualPathImages.sellGold}
            imageAlt="Hands holding polished gold chains — sell your gold at Modern Gold"
            title={t('dualPath.localTitle')}
            description={t('dualPath.localDesc')}
            ctaTo="/gold-buying"
            ctaLabel={t('cta.startSelling')}
            ctaClass="btn-primary-gold"
          />
          <DualPathCard
            variant="buy"
            icon={Globe2}
            image={dualPathImages.buyGold}
            imageAlt="Business handshake — become a wholesale buyer with Modern Gold"
            title={t('dualPath.intlTitle')}
            description={t('dualPath.intlDesc')}
            ctaTo="/wholesale/register"
            ctaLabel={t('cta.becomeBuyer')}
            ctaClass="btn-outline-gold"
          />
        </div>
      </div>
    </section>
  );
}
