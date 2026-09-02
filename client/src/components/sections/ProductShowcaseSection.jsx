import ProductGrid from '../ProductGrid';
import SectionHeader from '../ui/SectionHeader';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProductShowcaseSection({ products }) {
  const { t } = useTranslation();
  if (!products?.length) return null;
  return (
    <section className="section-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow={t('home.productShowcase.eyebrow')}
          title={t('home.productShowcase.title')}
          linkTo="/shop?sort=best_selling"
          linkLabel={t('home.productShowcase.viewAll')}
        />
        <ProductGrid products={products.slice(0, 4)} />
      </div>
    </section>
  );
}
