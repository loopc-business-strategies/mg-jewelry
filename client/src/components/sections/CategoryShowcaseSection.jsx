import { categoryShowcase } from '../../utils/brandConfig';
import CategoryCarousel from '../CategoryCarousel';
import SectionHeader from '../ui/SectionHeader';

export default function CategoryShowcaseSection() {
  return (
    <section className="section-cream py-16 md:py-24 lg:py-28 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Collections"
          title="Shop by Category"
          subtitle="Gold chains and bangles crafted in Namangan."
          linkTo="/shop"
          linkLabel="View all"
        />
        <CategoryCarousel categories={categoryShowcase} />
      </div>
    </section>
  );
}
