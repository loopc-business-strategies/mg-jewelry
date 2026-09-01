import { categoryShowcase } from '../../utils/brandConfig';
import CategoryCarousel from '../CategoryCarousel';
import SectionHeader from '../ui/SectionHeader';

export default function CategoryShowcaseSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-pearl overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Collections"
          title="Shop by Category"
          subtitle="Discover curated jewelry for every occasion."
          linkTo="/shop"
          linkLabel="View all"
        />
        <CategoryCarousel categories={categoryShowcase} />
      </div>
    </section>
  );
}
