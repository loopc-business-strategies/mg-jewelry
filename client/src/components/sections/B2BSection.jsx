import { Link } from 'react-router-dom';
import { oppositeModelCopy, b2bAudience } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function B2BSection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-20 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="section-eyebrow mb-3">Wholesale</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-charcoal mb-4">Built for Global Jewelry Businesses</h2>
          <p className="text-muted leading-relaxed mb-4">
            We partner with international jewellers, gold traders, wholesalers and distributors who need reliable manufacturing and consistent quality.
          </p>
          <p className="text-sm text-muted leading-relaxed mb-6">
            {t('wholesale.oppositeModel') || oppositeModelCopy}
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 mb-8">
            {b2bAudience.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact?type=quote" className="btn-primary-gold text-xs">Request a Quote</Link>
            <Link to="/wholesale/register" className="btn-outline-gold text-xs">{t('cta.becomePartner')}</Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
          <h3 className="text-2xl font-semibold text-charcoal mb-4">Discuss Your Collection</h3>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Whether you need wholesale collections, private-label jewelry or ongoing manufacturing partnerships — our team in Namangan is ready to support your business.
          </p>
          <Link to="/wholesale" className="text-gold font-medium hover:underline">Explore wholesale options →</Link>
        </div>
      </div>
    </section>
  );
}
