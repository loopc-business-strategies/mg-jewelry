import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { premiumBanner } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';

export default function CollectionPromoSection() {
  return (
    <section className="section-cream overflow-hidden border-y border-border">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 min-h-[420px]">
        <div className="relative hidden md:block">
          <SafeImage src={premiumBanner} alt="Woman wearing premium gold jewelry — Modern Glamour Collection editorial" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-20">
          <p className="section-eyebrow">New Collection</p>
          <h2 className="type-section-title mb-4">
            Modern Glamour Collection
          </h2>
          <p className="type-section-desc prose-card mb-8">
            Refined gold and diamond pieces designed for discerning customers who appreciate colorful, understated luxury.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 self-start btn-primary-gold"
          >
            Discover Collection <ArrowRight size={14} />
          </Link>
        </div>
        <div className="relative md:hidden aspect-video">
          <SafeImage src={premiumBanner} alt="Woman wearing premium gold jewelry — Modern Glamour Collection editorial" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
