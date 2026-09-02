import SafeImage from '../SafeImage';
import { presenceImages } from '../../utils/imageConfig';
import { useTranslation } from '../../hooks/useTranslation';

function PresenceCard({ item, featured }) {
  return (
    <article
      className={`presence-card group relative overflow-hidden rounded-[10px] border border-border bg-white shadow-[var(--shadow-soft)] ${
        featured ? 'presence-card-featured' : 'presence-card-standard'
      }`}
    >
      <div className="relative h-full min-h-[240px] md:min-h-0">
        <SafeImage
          src={item.image}
          alt={item.alt}
          disableFallback
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="presence-card-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
          <h3 className="presence-card-title type-card-title text-white mb-1.5">
            {item.title}
          </h3>
          <p className="type-body-sm text-white/90 leading-relaxed max-w-md">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function LocationVisual() {
  return (
    <div className="presence-location-visual" aria-hidden="true">
      <svg viewBox="0 0 120 80" className="w-full max-w-[140px] h-auto opacity-90" fill="none">
        <defs>
          <linearGradient id="presenceMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE783" />
            <stop offset="50%" stopColor="#FFB13D" />
            <stop offset="100%" stopColor="#FF7A00" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="42" rx="48" ry="28" stroke="url(#presenceMapGrad)" strokeWidth="1.5" fill="#FFF7E6" fillOpacity="0.6" />
        <path d="M60 18 C48 18 38 28 38 40 C38 52 60 68 60 68 C60 68 82 52 82 40 C82 28 72 18 60 18 Z" fill="url(#presenceMapGrad)" fillOpacity="0.35" stroke="#FF7A00" strokeWidth="1.2" />
        <circle cx="60" cy="40" r="4" fill="#FF7A00" />
      </svg>
    </div>
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

        <div className="section-cream rounded-xl border border-border p-8 md:p-10 mb-10">
          <div className="presence-gradient-accent w-12 h-1 rounded-full mb-5" />
          <h3 className="type-card-title mb-3">{t('presence.trustTitle')}</h3>
          <p className="type-section-desc max-w-3xl">{t('presence.trustDesc')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center sm:text-left">
          <LocationVisual />
          <div>
            <p className="section-eyebrow mb-1">{t('presence.locationEyebrow')}</p>
            <p className="type-card-title">{t('presence.location')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
