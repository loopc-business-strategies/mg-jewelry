import PlaceholderImage from '../PlaceholderImage';
import { factoryGallery } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function ManufacturingGallerySection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="section-eyebrow mb-2">{t('manufacturing.eyebrow')}</p>
        <h2 className="font-display text-2xl md:text-3xl text-charcoal">{t('manufacturing.title')}</h2>
        <p className="text-muted text-sm mt-2 max-w-2xl">{t('manufacturing.desc')}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {factoryGallery.map((item) => (
          <PlaceholderImage
            key={item.label}
            src={item.src}
            alt={`Modern Gold ${item.label}`}
            label={`Modern Gold ${item.label}`}
          />
        ))}
      </div>
    </section>
  );
}
