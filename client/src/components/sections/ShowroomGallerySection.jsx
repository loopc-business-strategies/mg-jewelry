import ScrollReveal from '../ScrollReveal';
import PlaceholderImage from '../PlaceholderImage';
import { showroomGallery } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function ShowroomGallerySection() {
  const { t } = useTranslation();

  return (
    <section className="section-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="mb-12">
          <p className="section-eyebrow mb-3">{t('showroom.eyebrow')}</p>
          <h2 className="headline-corporate headline-corporate-dark text-2xl md:text-3xl mb-4">
            {t('showroom.title')}
          </h2>
          <p className="text-muted max-w-2xl leading-relaxed">{t('showroom.desc')}</p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {showroomGallery.map((item) => (
            <ScrollReveal key={item.label}>
              <PlaceholderImage
                src={item.src}
                alt={`Modern Gold ${item.label}`}
                label={`Modern Gold ${item.label}`}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
