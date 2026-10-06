import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import ProductImage from './ProductImage';
import { useTranslation } from '../hooks/useTranslation';

export default function WholesaleProductCard({ product, showPrices, onAdd }) {
  const { t, tf } = useTranslation();
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <Link to={`/product/${product._id}`}>
        <ProductImage product={product} />
      </Link>
      <div className="p-4">
        <h3 className="type-card-title line-clamp-1 mb-1">{product.name}</h3>
        <p className="type-micro text-muted normal-case mb-2">{tf('wholesaleCard.sku', { sku: product.sku })}</p>
        <div className="space-y-1 type-body-sm">
          <p>{t('wholesaleCard.retail')} <span className="line-through">{formatPrice(product.price)}</span></p>
          {showPrices ? (
            <p className="font-semibold text-gold">{t('wholesaleCard.wholesale')} {formatPrice(product.wholesalePrice)}</p>
          ) : (
            <p className="italic">{t('wholesaleCard.loginForPricing')}</p>
          )}
          <p className="type-form-help">{tf('wholesaleCard.moqStock', { moq: product.moq, stock: product.stock })}</p>
        </div>
        {showPrices && onAdd && (
          <button
            onClick={() => onAdd(product._id, product.moq)}
            className="w-full mt-3 btn-primary-gold justify-center text-xs py-2.5"
          >
            {t('wholesaleCard.addToBulk')}
          </button>
        )}
      </div>
    </div>
  );
}
