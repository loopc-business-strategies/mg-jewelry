import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import SafeImage from './SafeImage';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
      api.get(`/search?q=${encodeURIComponent(query)}&limit=5`)
        .then(({ data }) => setSuggestions(data.suggestions || []))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose?.();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <form onSubmit={handleSubmit} className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jewellery, categories, metals..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-gold text-sm"
          autoFocus
        />
      </form>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
          {suggestions.map((s) => (
            <button
              key={s._id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors text-left"
              onClick={() => { navigate(`/product/${s._id}`); onClose?.(); }}
            >
              {s.image && <SafeImage src={s.image} alt="" category={s.category} className="w-10 h-10 rounded object-cover" />}
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted">{s.category} · {formatPrice(s.price)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
