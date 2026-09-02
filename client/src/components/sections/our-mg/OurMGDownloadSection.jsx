import { Link } from 'react-router-dom';
import { ourMgApp } from '../../../utils/brandConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGDownloadSection() {
  const { t } = useTranslation();
  const { playStoreUrl, appStoreUrl, webUrl, published } = ourMgApp;
  const hasPlayStore = published && playStoreUrl;
  const hasAppStore = published && appStoreUrl;
  const downloadUrl = playStoreUrl || appStoreUrl;
  const showQr = published && downloadUrl;

  return (
    <section id="download" className="our-mg-download-band py-16 md:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="section-eyebrow">{t('ourMg.download.eyebrow')}</p>
        <h2 className="type-section-title mb-4">{t('ourMg.download.title')}</h2>
        <p className="type-section-desc prose-section mx-auto mb-8">{t('ourMg.download.description')}</p>

        <div className="flex flex-col items-center gap-6">
          {!published && (
            <span className="type-micro text-gold font-semibold tracking-wider px-4 py-2 border border-gold/30 rounded-full bg-white">
              {t('ourMg.download.comingSoon')}
            </span>
          )}

          {(hasPlayStore || hasAppStore) && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {hasPlayStore && (
                <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/badges/google-play.svg"
                    alt="Get it on Google Play"
                    className="h-12"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </a>
              )}
              {hasAppStore && (
                <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/badges/app-store.svg"
                    alt="Download on the App Store"
                    className="h-12"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </a>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#download" className="btn-primary-gold">
              {t('ourMg.download.primaryCta')}
            </a>
            <Link to={webUrl} className="btn-outline-gold">
              {t('ourMg.download.secondaryCta')}
            </Link>
          </div>

          {showQr && (
            <div className="mt-4 p-6 bg-white rounded-2xl border border-border shadow-[var(--shadow-soft)] inline-flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(downloadUrl)}`}
                alt=""
                width={140}
                height={140}
                className="rounded-lg"
              />
              <p className="type-micro text-gold font-semibold tracking-wider mt-3">
                {t('ourMg.download.scanToDownload')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
