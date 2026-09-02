import { Link } from 'react-router-dom';
import SafeImage from '../../SafeImage';
import OurMGStepRow from '../../our-mg/OurMGStepRow';
import { ourMgEditorial } from '../../../utils/imageConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGSellGoldSection() {
  const { t } = useTranslation();
  const steps = t('ourMg.sellGold.steps');

  return (
    <section id="sell-gold" className="section-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="order-2 lg:order-1 rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
          <SafeImage
            src={ourMgEditorial.sellGold}
            alt="Sell gold through Modern Gold"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="section-eyebrow">{t('ourMg.sellGold.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.sellGold.title')}</h2>
          <p className="type-section-desc prose-section mb-8">{t('ourMg.sellGold.description')}</p>
          <OurMGStepRow steps={steps} />
          <Link to="/gold-buying" className="btn-primary-gold inline-flex mt-8">
            {t('ourMg.sellGold.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
