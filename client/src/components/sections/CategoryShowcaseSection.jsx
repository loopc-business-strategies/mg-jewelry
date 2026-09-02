import { categoryShowcase } from '../../utils/brandConfig';
import CategoryCarousel from '../CategoryCarousel';
import SectionHeader from '../ui/SectionHeader';
import { useTranslation } from '../../hooks/useTranslation';

export default function CategoryShowcaseSection() {
  const { t } = useTranslation();

  return (
    <section className="section-cream py-16 md:py-24 lg:py-28 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow={t('home.categoryShowcase.eyebrow')}
          title={t('home.categoryShowcase.title')}
          subtitle={t('home.categoryShowcase.subtitle')}
          linkTo="/shop"
          linkLabel={t('home.categoryShowcase.viewAll')}
        />
        <CategoryCarousel categories={categoryShowcase} />
      </div>
    </section>
  );
}
