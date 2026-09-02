import { Link } from 'react-router-dom';
import { oppositeModelCopy } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function B2BSection() {
  const { t } = useTranslation();
  const audience = t('home.b2b.audience') || [];

  return (
    <section className="section-white py-20 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="section-eyebrow">{t('home.b2b.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('home.b2b.title')}</h2>
          <p className="type-body mb-4 prose-section">
            {t('home.b2b.p1')}
          </p>
          <p className="type-body-sm mb-6 prose-section">
            {t('wholesale.oppositeModel') || oppositeModelCopy}
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 mb-8">
            {Array.isArray(audience) && audience.map((item) => (
              <li key={item} className="flex items-center gap-2 type-body-sm text-charcoal">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact?type=quote" className="btn-primary-gold">{t('home.b2b.quote')}</Link>
            <Link to="/wholesale/register" className="btn-outline-gold">{t('cta.becomePartner')}</Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
          <h3 className="type-card-title mb-4">{t('home.b2b.cardTitle')}</h3>
          <p className="type-card-desc mb-6">
            {t('home.b2b.cardDesc')}
          </p>
          <Link to="/wholesale" className="type-body-sm font-medium text-gold hover:underline">{t('home.b2b.cardLink')}</Link>
        </div>
      </div>
    </section>
  );
}
