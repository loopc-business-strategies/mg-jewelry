import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryImages } from '../utils/imageConfig';
import SafeImage from './SafeImage';

function CategoryCard({ name, slug }) {
  return (
    <Link
      to={`/shop/${slug}`}
      className="category-carousel-card group/card flex-shrink-0 snap-start card-elegant overflow-hidden bg-white border border-border"
    >
      <div className="category-carousel-image editorial-image-card relative bg-white">
        <SafeImage
          src={categoryImages[slug] || categoryImages.chains}
          alt={`${name} — luxury gold jewelry editorial by Modern Gold Jewelry`}
          category={slug}
          className="w-full h-full object-cover"
        />
        <div className="editorial-image-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-[350ms] pointer-events-none" />
      </div>
      <div className="p-4 text-center bg-white border-t border-border">
        <p className="text-xs tracking-wide uppercase text-charcoal mb-1 font-semibold">{name}</p>
        <span className="text-[11px] text-gold group-hover/card:font-medium transition-all duration-200 inline-flex items-center gap-1">
          Explore Now →
        </span>
      </div>
    </Link>
  );
}

export default function CategoryCarousel({ categories }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  const scrollByCard = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.category-carousel-card');
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : track.clientWidth * 0.75;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateArrows();
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      track.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, categories.length]);

  useEffect(() => {
    if (isPaused) return undefined;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard(1);
      }
    }, 4500);
    return () => clearInterval(id);
  }, [isPaused, scrollByCard]);

  const onPointerDown = (e) => {
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { active: true, startX: e.pageX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(e.pointerId);
    setIsPaused(true);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.pageX - dragRef.current.startX;
    track.scrollLeft = dragRef.current.scrollLeft - dx;
  };

  const onPointerUp = (e) => {
    dragRef.current.active = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        type="button"
        onClick={() => { scrollByCard(-1); setIsPaused(true); setTimeout(() => setIsPaused(false), 3000); }}
        disabled={!canPrev}
        className="carousel-nav-btn absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 hidden sm:flex"
        aria-label="Previous categories"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={trackRef}
        className="category-carousel-track scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} name={cat.name} slug={cat.slug} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => { scrollByCard(1); setIsPaused(true); setTimeout(() => setIsPaused(false), 3000); }}
        disabled={!canNext}
        className="carousel-nav-btn absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2 hidden sm:flex"
        aria-label="Next categories"
      >
        <ChevronRight size={18} />
      </button>

      <div className="flex sm:hidden justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          className="carousel-nav-btn flex"
          aria-label="Previous categories"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          className="carousel-nav-btn flex"
          aria-label="Next categories"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
