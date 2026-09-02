import { Link } from 'react-router-dom';
import SafeImage from '../../SafeImage';
import OurMGStepRow from '../../our-mg/OurMGStepRow';
import { ourMgEditorial } from '../../../utils/imageConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGBuyGoldSection() {
  const { t } = useTranslation();
  const steps = t('ourMg.buyGold.steps');

  return (
    <section id="buy-gold" className="section-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="section-eyebrow">{t('ourMg.buyGold.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.buyGold.title')}</h2>
          <p className="type-section-desc prose-section mb-8">{t('ourMg.buyGold.description')}</p>
          <OurMGStepRow steps={steps} />
          <Link to="/shop" className="btn-primary-gold inline-flex mt-8">
            {t('ourMg.buyGold.cta')}
          </Link>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
          <SafeImage
            src={ourMgEditorial.buyGold}
            alt="Gold products available through Modern Gold"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
