import SafeImage from '../SafeImage';
import { presenceImages } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

function PresenceCard({ item, featured }) {
  const { t } = useTranslation();
  return (
    <article
      className={`presence-card group relative overflow-hidden rounded-[10px] border border-border bg-white shadow-[var(--shadow-soft)] ${
        featured ? 'presence-card-featured' : 'presence-card-standard'
      }`}
    >
      <div className="relative h-full min-h-[240px] md:min-h-0">
        <SafeImage
          src={item.image}
          alt={t(`presenceCards.${item.id}.alt`, item.alt)}
          disableFallback
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="presence-card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
          <h3 className="presence-card-title type-card-title text-white mb-1.5">
            {t(`presenceCards.${item.id}.title`, item.title)}
          </h3>
          <p className="type-body-sm presence-card-desc leading-relaxed max-w-md">
            {t(`presenceCards.${item.id}.description`, item.description)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function OurPresenceSection() {
  const { t } = useTranslation();

  return (
    <section className="section-white py-16 md:py-24 px-4 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 md:mb-12 max-w-3xl">
          <p className="section-eyebrow">{t('presence.eyebrow')}</p>
          <h2 className="type-section-title mb-3">{t('presence.title')}</h2>
          <p className="type-section-desc prose-section mb-3">{t('presence.desc')}</p>
          <p className="type-body-sm">{t('presence.demoNote')}</p>
        </header>

        <div className="presence-grid mb-12 md:mb-16">
          {presenceImages.map((item) => (
            <PresenceCard
              key={item.id}
              item={item}
              featured={item.featured}
            />
          ))}
        </div>

        <div className="section-cream rounded-xl border border-border p-8 md:p-10">
          <div className="presence-gradient-accent w-12 h-1 rounded-full mb-5" />
          <h3 className="type-card-title mb-3">{t('presence.trustTitle')}</h3>
          <p className="type-section-desc max-w-3xl">{t('presence.trustDesc')}</p>
        </div>
      </div>
    </section>
  );
}
