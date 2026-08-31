import { Link } from 'react-router-dom';
import { brand } from '../../utils/brandConfig';
import { heroImage } from '../../utils/imageConfig';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden section-gradient-warm">
      <div className="absolute inset-0 opacity-30">
        <img src={heroImage} alt="Premium gold jewelry collection by Modern Gold Jewelry" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-pearl/95 via-cream/85 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-reveal">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">Namangan, Uzbekistan</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal leading-tight mb-4">
            <span className="text-gradient-gold">{brand.name}</span>
          </h1>
          <p className="font-display text-2xl md:text-3xl text-charcoal/80 mb-6">{brand.tagline}</p>
          <p className="text-muted text-lg leading-relaxed mb-8 max-w-xl">{brand.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="bg-gold hover:bg-gold-dark text-white px-8 py-3.5 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-gold/20">
              Explore Our Jewelry
            </Link>
            <Link to="/wholesale" className="border-2 border-gold text-gold-dark hover:bg-gold hover:text-white px-8 py-3.5 rounded-full font-medium transition-all">
              Partner With Us
            </Link>
          </div>
        </div>
        <div className="hidden lg:block animate-float">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gold/10 border border-gold/20">
            <img src={heroImage} alt="Modern Gold Jewelry manufacturing showcase" className="w-full aspect-[4/5] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
