import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import ProductImage from './ProductImage';
import { formatPrice } from '../utils/formatPrice';

export default function CartItem({ item, onUpdate, onRemove }) {
  const product = item.productId;
  if (!product) return null;

  return (
    <div className="flex gap-4 py-6 border-b border-gold/10">
      <Link to={`/product/${product._id}`} className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
        <ProductImage product={product} containerClassName="w-full h-full" />
      </Link>
      <div className="flex-1">
        <Link to={`/product/${product._id}`} className="font-display text-lg hover:text-gold transition-colors">{product.name}</Link>
        <p className="text-sm text-muted">{product.sku} {item.size && `· Size ${item.size}`}</p>
        <p className="font-semibold mt-1">{formatPrice(product.price)}</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border rounded-lg">
            <button onClick={() => onUpdate(item._id, item.quantity - 1)} className="p-2 hover:bg-cream"><Minus size={14} /></button>
            <span className="px-3 text-sm">{item.quantity}</span>
            <button onClick={() => onUpdate(item._id, item.quantity + 1)} className="p-2 hover:bg-cream"><Plus size={14} /></button>
          </div>
          <button onClick={() => onRemove(item._id)} className="text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
        </div>
      </div>
      <p className="font-semibold">{formatPrice(product.price * item.quantity)}</p>
    </div>
  );
}
