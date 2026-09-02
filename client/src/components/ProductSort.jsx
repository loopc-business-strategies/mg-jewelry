import { sortOptions } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';

export default function ProductSort({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold bg-white"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>{t(`sort.${opt.value}`) || opt.label}</option>
      ))}
    </select>
  );
}
