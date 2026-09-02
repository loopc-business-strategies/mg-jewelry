import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const filterGroups = [
  { key: 'gender', labelKey: 'filters.gender', options: ['women', 'men', 'unisex', 'kids'] },
  { key: 'metal', labelKey: 'filters.metal', options: ['Gold', 'Silver', 'Platinum'] },
  { key: 'purity', labelKey: 'filters.purity', options: ['18K', '22K', '925', '950'] },
  { key: 'occasion', labelKey: 'filters.occasion', options: ['wedding', 'daily wear', 'festive', 'engagement'] },
];

export default function ProductFilter({ filters, onChange, mobile = false, onClose }) {
  const { t } = useTranslation();

  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: filters[key] === value ? '' : value });
  };

  const optLabel = (opt) => t(`filters.options.${opt}`) || opt;

  const content = (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-sm mb-3 uppercase tracking-wider">{t('filters.price')}</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={t('filters.min')}
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="input-elegant"
          />
          <input
            type="number"
            placeholder={t('filters.max')}
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="input-elegant"
          />
        </div>
      </div>

      {filterGroups.map((group) => (
        <div key={group.key}>
          <h4 className="font-medium text-sm mb-3 uppercase tracking-wider">{t(group.labelKey)}</h4>
          <div className="space-y-2">
            {group.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters[group.key] === opt}
                  onChange={() => updateFilter(group.key, opt)}
                  className="accent-gold"
                />
                <span className="capitalize">{optLabel(opt)}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filters.discount === 'true'}
          onChange={(e) => onChange({ ...filters, discount: e.target.checked ? 'true' : '' })}
          className="accent-gold"
        />
        {t('filters.onDiscount')}
      </label>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStock === 'true'}
          onChange={(e) => onChange({ ...filters, inStock: e.target.checked ? 'true' : '' })}
          className="accent-gold"
        />
        {t('filters.inStock')}
      </label>

      <button
        onClick={() => onChange({})}
        className="w-full text-sm text-gold-dark hover:underline"
      >
        {t('filters.clearAll')}
      </button>
    </div>
  );

  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 modal-backdrop" onClick={onClose}>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-charcoal text-xl flex items-center gap-2"><SlidersHorizontal size={18} /> {t('filters.title')}</h3>
            <button onClick={onClose} className="text-sm text-muted">{t('filters.close')}</button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <h3 className="font-semibold text-charcoal text-xl mb-6 flex items-center gap-2">
        <SlidersHorizontal size={18} /> {t('filters.title')}
      </h3>
      {content}
    </aside>
  );
}
