import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import SafeImage from '../SafeImage';
import { manufacturingCapabilities, IMAGE_PLACEHOLDER_LABEL } from '../../utils/brandConfig';

const FACTORY_IMAGES = [
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1610375461246-207c099ac6cc?w=800&q=80&auto=format&fit=crop',
];

export default function ManufacturingPreviewSection() {
  return (
    <section className="section-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="section-eyebrow mb-3">Manufacturing</p>
            <h2 className="headline-corporate headline-corporate-light">
              Professional Gold Production
            </h2>
          </div>
          <Link to="/manufacturing" className="btn-gold-outline btn-gold-outline-light shrink-0">
            View Manufacturing <ArrowRight size={16} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {FACTORY_IMAGES.map((src, i) => (
            <ScrollReveal key={i}>
              <div className="relative aspect-[4/3] overflow-hidden image-zoom-hover">
                <SafeImage
                  src={src}
                  alt={`Modern Gold ${manufacturingCapabilities[i] || 'Facility'}`}
                  className="w-full h-full object-cover opacity-80"
                  category="gold-jewelry"
                />
                <span className="image-placeholder-label">
                  Modern Gold {manufacturingCapabilities[i]} — {IMAGE_PLACEHOLDER_LABEL}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {manufacturingCapabilities.map((cap) => (
            <span
              key={cap}
              className="px-4 py-2 text-xs tracking-wider uppercase border border-gold/20 text-gold/80"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
