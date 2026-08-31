import { Link } from 'react-router-dom';
import { MessageCircle, Video, Home } from 'lucide-react';
import { productServiceActions, getContactServiceUrl } from '../utils/brandConfig';

const iconMap = {
  MessageCircle,
  Video,
  Home,
};

export default function ProductServiceActions({ productName, layout = 'row', className = '', onNavigate }) {
  const actions = Object.values(productServiceActions);
  const isRow = layout === 'row';

  return (
    <div
      className={`flex ${isRow ? 'flex-wrap gap-x-3 gap-y-1.5' : 'flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3'} ${className}`}
    >
      {actions.map((action, index) => {
        const Icon = iconMap[action.icon];
        return (
          <span key={action.type} className="inline-flex items-center">
            {index > 0 && isRow && (
              <span className="hidden sm:inline text-gold/30 mr-3" aria-hidden="true">|</span>
            )}
            <Link
              to={getContactServiceUrl(action.type, productName)}
              onClick={onNavigate}
              className={`inline-flex items-center gap-1 text-gold-dark hover:text-gold font-medium transition-colors ${
                isRow ? 'text-xs' : 'text-sm px-3 py-2 rounded-lg border border-gold/20 hover:border-gold/40 hover:bg-gold/5'
              }`}
            >
              {Icon && <Icon size={isRow ? 12 : 14} />}
              {action.label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
