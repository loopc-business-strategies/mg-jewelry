import { Link } from 'react-router-dom';
import { manufacturingNavLinks } from '../utils/brandConfig';

export default function ManufacturingDropdown({ onClose }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-pearl border border-gold/15 rounded-xl shadow-xl shadow-gold/5 py-3 mt-2 z-50 animate-fade-in">
      <ul className="py-1">
        {manufacturingNavLinks.map((link) => (
          <li key={link.label}>
            <Link
              to={link.path}
              className="block px-5 py-2.5 text-sm text-charcoal hover:text-gold hover:bg-cream/80 transition-colors"
              onClick={onClose}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
