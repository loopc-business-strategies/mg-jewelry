import PlaceholderImage from '../PlaceholderImage';
import { showroomGallery } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function ShowroomGallerySection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-ivory border-y border-gold/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="section-eyebrow mb-2">{t('showroom.eyebrow')}</p>
          <h2 className="font-display text-2xl md:text-3xl text-charcoal">{t('showroom.title')}</h2>
          <p className="text-muted text-sm mt-2 max-w-2xl">{t('showroom.desc')}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {showroomGallery.map((item) => (
            <PlaceholderImage
              key={item.label}
              src={item.src}
              alt={`Modern Gold ${item.label}`}
              label={`Modern Gold ${item.label}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
