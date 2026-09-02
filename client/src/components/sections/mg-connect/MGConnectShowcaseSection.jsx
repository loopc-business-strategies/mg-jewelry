import PhoneMockup from '../../mg-connect/PhoneMockup';
import { mgConnectShowcaseOrder } from '../../../utils/imageConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function MGConnectShowcaseSection() {
  const { t } = useTranslation();
  const screenLabels = t('mgConnect.showcase.screens');

  return (
    <section className="section-white py-16 md:py-20 px-4 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12 max-w-[700px] mx-auto">
          <p className="section-eyebrow">{t('mgConnect.showcase.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('mgConnect.showcase.title')}</h2>
        </div>

        <div className="mg-connect-showcase-scroll">
          {mgConnectShowcaseOrder.map((screen, i) => (
            <div key={screen} className="mg-connect-showcase-item">
              {i > 0 && (
                <span className="mg-connect-showcase-arrow hidden md:block" aria-hidden="true">
                  →
                </span>
              )}
              <PhoneMockup
                screen={screen}
                label={screenLabels[screen]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
