import { Link } from 'react-router-dom';
import { brand } from '../../utils/brandConfig';
import { aboutHero } from '../../utils/imageConfig';
import SafeImage from '../SafeImage';

export default function AboutPreviewSection() {
  return (
    <section className="py-20 px-4 bg-ivory">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="section-eyebrow mb-3">About Us</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Crafted in Uzbekistan. Connected to the World.</h2>
          <p className="text-muted leading-relaxed mb-4">
            {brand.legalName} is a jewelry manufacturing company based in Namangan, Uzbekistan, focused on creating quality jewelry products for international markets.
          </p>
          <p className="text-muted leading-relaxed mb-6">
            We combine skilled craftsmanship, modern production capabilities and a commitment to quality — supporting wholesalers, retailers and brands worldwide.
          </p>
          <Link to="/about" className="text-sm tracking-wide text-charcoal hover:text-gold transition-colors">Read our full story →</Link>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gold/10">
          <SafeImage src={aboutHero} alt="Woman wearing ornate gold jewelry — Modern Gold Jewelry editorial" className="w-full aspect-[4/3] object-cover" />
        </div>
      </div>
    </section>
  );
}
