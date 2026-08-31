import { SlidersHorizontal } from 'lucide-react';

const filterGroups = [
  { key: 'gender', label: 'Gender', options: ['women', 'men', 'unisex', 'kids'] },
  { key: 'metal', label: 'Metal', options: ['Gold', 'Silver', 'Platinum'] },
  { key: 'purity', label: 'Gold Karat', options: ['18K', '22K', '925', '950'] },
  { key: 'occasion', label: 'Occasion', options: ['wedding', 'daily wear', 'festive', 'engagement'] },
];

export default function ProductFilter({ filters, onChange, mobile = false, onClose }) {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: filters[key] === value ? '' : value });
  };

  const content = (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-sm mb-3 uppercase tracking-wider">Price</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full border border-gold/20 rounded-lg px-3 py-2 text-sm bg-pearl focus:outline-none focus:border-gold"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full border border-gold/20 rounded-lg px-3 py-2 text-sm bg-pearl focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {filterGroups.map((group) => (
        <div key={group.key}>
          <h4 className="font-medium text-sm mb-3 uppercase tracking-wider">{group.label}</h4>
          <div className="space-y-2">
            {group.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters[group.key] === opt}
                  onChange={() => updateFilter(group.key, opt)}
                  className="accent-gold"
                />
                <span className="capitalize">{opt}</span>
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
        On Discount
      </label>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStock === 'true'}
          onChange={(e) => onChange({ ...filters, inStock: e.target.checked ? 'true' : '' })}
          className="accent-gold"
        />
        In Stock
      </label>

      <button
        onClick={() => onChange({})}
        className="w-full text-sm text-gold-dark hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  );

  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl flex items-center gap-2"><SlidersHorizontal size={18} /> Filters</h3>
            <button onClick={onClose} className="text-sm text-muted">Close</button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <h3 className="font-display text-xl mb-6 flex items-center gap-2">
        <SlidersHorizontal size={18} /> Filters
      </h3>
      {content}
    </aside>
  );
}
