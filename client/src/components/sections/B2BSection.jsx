import { Link } from 'react-router-dom';
import { oppositeModelCopy, b2bAudience } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function B2BSection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-20 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="section-eyebrow">Wholesale</p>
          <h2 className="type-section-title mb-4">Built for Global Jewelry Businesses</h2>
          <p className="type-body mb-4 prose-section">
            We partner with international jewellers, gold traders, wholesalers and distributors who need reliable manufacturing and consistent quality.
          </p>
          <p className="type-body-sm mb-6 prose-section">
            {t('wholesale.oppositeModel') || oppositeModelCopy}
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 mb-8">
            {b2bAudience.map((item) => (
              <li key={item} className="flex items-center gap-2 type-body-sm text-charcoal">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact?type=quote" className="btn-primary-gold">Request a Quote</Link>
            <Link to="/wholesale/register" className="btn-outline-gold">{t('cta.becomePartner')}</Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
          <h3 className="type-section-title text-xl md:text-2xl mb-4">Discuss Your Collection</h3>
          <p className="type-card-desc mb-6">
            Whether you need wholesale collections, private-label jewelry or ongoing manufacturing partnerships — our team in Namangan is ready to support your business.
          </p>
          <Link to="/wholesale" className="type-body-sm font-medium text-gold hover:underline">Explore wholesale options →</Link>
        </div>
      </div>
    </section>
  );
}
