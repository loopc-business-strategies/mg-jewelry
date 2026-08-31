import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-gold transition-colors">Home</Link>
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
