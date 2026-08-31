import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MegaMenu({ onClose }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.slice(0, 11))).catch(() => {});
  }, []);

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl bg-white shadow-xl border border-gray-100 rounded-xl p-6 mt-2 z-50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.slug}>
            <Link
              to={`/shop/${cat.slug}`}
              className="font-display text-lg text-charcoal hover:text-gold transition-colors mb-2 block"
              onClick={onClose}
            >
              {cat.name}
            </Link>
            <ul className="space-y-1">
              {cat.subcategories?.slice(0, 6).map((sub) => (
                <li key={sub.slug}>
                  <Link
                    to={`/shop/${cat.slug}?subcategory=${sub.slug}`}
                    className="text-xs text-muted hover:text-gold transition-colors"
                    onClick={onClose}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t flex justify-center">
        <Link to="/shop" className="text-sm text-gold-dark font-medium hover:underline" onClick={onClose}>
          View All Jewellery →
        </Link>
      </div>
    </div>
  );
}
