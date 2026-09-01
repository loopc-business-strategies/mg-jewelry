import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import PlaceholderImage from '../PlaceholderImage';
import { factoryGallery } from '../../utils/imageConfig';
import { manufacturingCapabilities } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function ManufacturingPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="section-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="section-eyebrow mb-3">{t('manufacturing.eyebrow')}</p>
            <h2 className="headline-corporate headline-corporate-light">
              {t('manufacturing.title')}
            </h2>
          </div>
          <Link to="/manufacturing" className="btn-gold-outline btn-gold-outline-light shrink-0">
            {t('manufacturing.viewManufacturing')} <ArrowRight size={16} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {factoryGallery.slice(0, 4).map((item, i) => (
            <ScrollReveal key={item.label}>
              <PlaceholderImage
                src={item.src}
                alt={`Modern Gold ${item.label}`}
                label={`Modern Gold ${manufacturingCapabilities[i] || item.label}`}
              />
            </ScrollReveal>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {manufacturingCapabilities.map((cap) => (
            <span
              key={cap}
              className="px-4 py-2 text-xs tracking-wider uppercase border border-gold/20 text-gold/80"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
