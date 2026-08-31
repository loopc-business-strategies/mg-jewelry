import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { brand } from '../utils/brandConfig';
import { aboutHero } from '../utils/imageConfig';
import { Award, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    description: brand.tagline,
    url: 'https://aurumgrove.com',
  };

  return (
    <>
      <SEOHead title="About Us" description={`Learn about ${brand.name} — our story, craftsmanship, and commitment to quality.`} path="/about" schema={schema} />

      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={aboutHero} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="font-display text-4xl md:text-5xl text-white">Our Story</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        <section id="story">
          <h2 className="font-display text-3xl mb-4">Brand Story</h2>
          <p className="text-muted leading-relaxed">
            {brand.name} was born from a passion for timeless Indian craftsmanship. We believe every piece of jewellery tells a story — of love, celebration, and heritage. Our artisans blend traditional techniques with contemporary design to create pieces that transcend generations.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl mb-4">Mission & Vision</h2>
          <p className="text-muted leading-relaxed mb-4">
            <strong>Mission:</strong> To make premium, certified jewellery accessible to every Indian household while preserving the art of fine craftsmanship.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Vision:</strong> To become India's most trusted premium jewellery brand, known for authenticity, elegance, and exceptional customer experience.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl mb-6">Why Customers Trust Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Craftsmanship', desc: 'Handcrafted by master artisans with decades of experience.' },
              { icon: Shield, title: 'Certification', desc: 'BIS hallmarked gold and IGI/GIA certified diamonds.' },
              { icon: Heart, title: 'Quality', desc: 'Rigorous quality checks at every stage of production.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-cream rounded-xl">
                <Icon size={32} className="text-gold mx-auto mb-3" />
                <h3 className="font-display text-xl mb-2">{title}</h3>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
