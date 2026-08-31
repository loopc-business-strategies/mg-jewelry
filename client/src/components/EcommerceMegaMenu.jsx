import { Link } from 'react-router-dom';
import { ecommerceMenu } from '../utils/brandConfig';

export default function EcommerceMegaMenu({ onClose }) {
  const { retail, wholesale } = ecommerceMenu;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-3xl bg-pearl border border-gold/15 rounded-2xl shadow-xl shadow-gold/5 p-6 mt-2 z-50 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-gradient-to-br from-ivory to-cream rounded-xl p-5 border border-gold/10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-medium mb-1">{retail.title}</p>
          <p className="text-xs text-muted mb-4 leading-relaxed">{retail.subtitle}</p>
          <ul className="space-y-2 mb-5">
            {retail.links.map((link) => (
              <li key={link.label + link.path}>
                <Link
                  to={link.path}
                  className="text-sm text-charcoal hover:text-gold transition-colors"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={retail.cta.path}
            className="inline-flex bg-gold text-white text-xs font-medium px-5 py-2.5 rounded-full hover:bg-gold-dark transition-colors"
            onClick={onClose}
          >
            {retail.cta.label}
          </Link>
        </div>

        <div className="bg-gradient-to-br from-champagne/30 to-ivory rounded-xl p-5 border border-gold/10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-burgundy font-medium mb-1">{wholesale.title}</p>
          <p className="text-xs text-muted mb-4 leading-relaxed">{wholesale.subtitle}</p>
          <ul className="space-y-2 mb-5">
            {wholesale.links.map((link) => (
              <li key={link.label + link.path}>
                <Link
                  to={link.path}
                  className="text-sm text-charcoal hover:text-gold transition-colors"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Link
              to={wholesale.cta.path}
              className="inline-flex bg-burgundy text-white text-xs font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              {wholesale.cta.label}
            </Link>
            <Link
              to={wholesale.secondaryCta.path}
              className="inline-flex border border-gold/40 text-gold-dark text-xs font-medium px-5 py-2.5 rounded-full hover:bg-gold/10 transition-colors"
              onClick={onClose}
            >
              {wholesale.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
