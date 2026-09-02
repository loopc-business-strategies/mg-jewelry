import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectFinalCTASection() {
  const { t } = useTranslation();

  return (
    <section className="cta-gradient-band py-16 px-4">
      <div className="max-w-4xl mx-auto text-center p-10 md:p-16">
        <h2 className="type-section-title text-white mb-4">{t('mgConnect.final.title')}</h2>
        <p className="type-body text-white/80 mb-8 max-w-xl mx-auto">{t('mgConnect.final.description')}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/gold-buying"
            className="btn-primary-gold bg-white text-charcoal hover:brightness-100"
          >
            {t('mgConnect.final.sellCta')}
          </Link>
          <Link
            to="/wholesale/register"
            className="inline-flex items-center gap-2 border border-white/40 text-white px-5 py-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.02em] rounded-md hover:bg-white/10 transition-colors"
          >
            {t('mgConnect.final.buyerCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
