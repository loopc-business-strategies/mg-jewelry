import { mgConnectApp } from '../../../utils/brandConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectDownloadSection({ id = 'download' }) {
  const { t } = useTranslation();
  const showStoreBadges =
    mgConnectApp.published && (mgConnectApp.playStoreUrl || mgConnectApp.appStoreUrl);

  return (
    <section id={id} className="section-white py-16 md:py-20 px-4 border-b border-border scroll-mt-24">
      <div className="max-w-3xl mx-auto text-center">
        <p className="section-eyebrow">{t('mgConnect.download.eyebrow')}</p>
        <h2 className="type-section-title mb-4">{t('mgConnect.download.title')}</h2>
        <p className="type-section-desc prose-section mx-auto mb-10">{t('mgConnect.download.description')}</p>

        {showStoreBadges ? (
          <div className="flex flex-wrap justify-center items-center gap-4">
            {mgConnectApp.playStoreUrl && (
              <a
                href={mgConnectApp.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-12 md:h-14 w-auto"
                />
              </a>
            )}
            {mgConnectApp.appStoreUrl && (
              <a
                href={mgConnectApp.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                  alt="Download on the App Store"
                  className="h-12 md:h-14 w-auto"
                />
              </a>
            )}
          </div>
        ) : (
          <div className="inline-flex flex-col items-center gap-3">
            <span className="type-micro text-gold font-semibold tracking-wider px-4 py-2 rounded-full border border-gold/40 bg-cream">
              {t('mgConnect.download.comingSoon')}
            </span>
            <p className="type-body-sm text-muted max-w-md">{t('mgConnect.download.note')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
