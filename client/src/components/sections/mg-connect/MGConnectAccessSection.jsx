import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectAccessSection({ id = 'app-access' }) {
  const { t } = useTranslation();

  return (
    <section id={id} className="section-cream py-16 md:py-20 px-4 border-b border-border scroll-mt-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="type-section-title mb-4">{t('mgConnect.access.title')}</h2>
        <p className="type-section-desc prose-section mx-auto mb-8">{t('mgConnect.access.description')}</p>
        <p className="type-body-sm text-muted mb-8">{t('mgConnect.access.note')}</p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              disabled
              className="btn-primary-gold opacity-90 cursor-default"
              aria-describedby="mg-connect-coming-soon"
            >
              {t('mgConnect.access.downloadCta')}
            </button>
            <span id="mg-connect-coming-soon" className="type-micro text-gold font-semibold tracking-wider">
              {t('mgConnect.access.comingSoon')}
            </span>
          </div>
          <Link to="/login" className="btn-outline-gold">
            {t('mgConnect.access.portalCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
