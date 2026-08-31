import { Link } from 'react-router-dom';
import { categoryShowcase } from '../../utils/brandConfig';
import { categoryImages } from '../../utils/imageConfig';
import SectionHeader from '../ui/SectionHeader';

export default function CategoryShowcaseSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-pearl">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Collections"
          title="Shop by Category"
          subtitle="Discover curated jewelry for every occasion."
          linkTo="/shop"
          linkLabel="View all"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {categoryShowcase.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className="group card-elegant image-zoom-hover"
            >
              <div className="aspect-[3/4] overflow-hidden bg-linen">
                <img
                  src={categoryImages[cat.slug]}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-xs tracking-[0.15em] uppercase text-charcoal mb-1">{cat.name}</p>
                <span className="text-[11px] text-muted group-hover:text-gold transition-colors">
                  Explore Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
