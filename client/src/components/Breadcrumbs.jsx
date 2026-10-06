import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Breadcrumbs({ items }) {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center gap-1 text-sm text-muted mb-6" aria-label={t('ui.breadcrumb')}>
      <Link to="/" className="hover:text-gold transition-colors">{t('ui.home')}</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={14} />
          {item.path ? (
            <Link to={item.path} className="hover:text-gold transition-colors">{item.label}</Link>
          ) : (
            <span className="text-charcoal">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
