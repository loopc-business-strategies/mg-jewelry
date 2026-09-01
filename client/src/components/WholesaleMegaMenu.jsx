import { Link } from 'react-router-dom';
import { wholesaleMenu } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';

export default function WholesaleMegaMenu({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-sm bg-white border border-gold/12 shadow-lg p-6 mt-1 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-champagne/30 to-ivory rounded-xl p-5 border border-gold/10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-burgundy font-medium mb-1">
          {t('wholesaleMenu.title')}
        </p>
        <p className="text-xs text-muted mb-4 leading-relaxed">{t('wholesaleMenu.subtitle')}</p>
        <ul className="space-y-2 mb-5">
          {wholesaleMenu.links.map((link) => (
            <li key={link.path + (link.key || link.label)}>
              <Link
                to={link.path}
                className="text-sm text-charcoal hover:text-gold transition-colors"
                onClick={onClose}
              >
                {link.key ? t(link.key) : link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Link
            to={wholesaleMenu.cta.path}
            className="inline-flex bg-burgundy text-white text-xs font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            onClick={onClose}
          >
            {t(wholesaleMenu.cta.key)}
          </Link>
          <Link
            to={wholesaleMenu.secondaryCta.path}
            className="inline-flex border border-gold/40 text-gold-dark text-xs font-medium px-5 py-2.5 rounded-full hover:bg-gold/10 transition-colors"
            onClick={onClose}
          >
            {t(wholesaleMenu.secondaryCta.key)}
          </Link>
        </div>
      </div>
    </div>
  );
}
