import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { premiumBanner, heroImage } from '../../utils/imageConfig';

export default function CollectionPromoSection() {
  return (
    <section className="bg-ink text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 min-h-[420px]">
        <div className="relative hidden md:block">
          <img src={premiumBanner} alt="" className="w-full h-full object-cover opacity-90" />
        </div>
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-20">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-4">New Collection</p>
          <h2 className="font-display text-3xl md:text-4xl mb-4 leading-tight">
            Modern Glamour Collection
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md">
            Refined gold and diamond pieces designed for discerning customers who appreciate understated luxury.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 self-start border border-white/60 px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-ink transition-colors"
          >
            Discover Collection <ArrowRight size={14} />
          </Link>
        </div>
        <div className="relative md:hidden aspect-video">
          <img src={heroImage} alt="Modern Glamour Collection" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
