import { Link } from 'react-router-dom';
import PhoneMockup from '../../our-mg/PhoneMockup';
import { ourMgAppExperienceScreens } from '../../../utils/imageConfig';
import { useTranslation } from '../../../hooks/useTranslation';

export default function OurMGAppExperienceSection() {
  const { t } = useTranslation();

  return (
    <section className="section-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <p className="section-eyebrow">{t('ourMg.appExperience.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.appExperience.title')}</h2>
          <p className="type-section-desc prose-section">{t('ourMg.appExperience.description')}</p>
        </div>
        <div className="our-mg-app-phones">
          {ourMgAppExperienceScreens.map((screen) => (
            <PhoneMockup
              key={screen.id}
              screen={screen.id}
              placeholderNumber={screen.number}
              placeholderName={screen.name}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/" className="btn-outline-gold">
            {t('ourMg.appExperience.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
