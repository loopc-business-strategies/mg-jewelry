import ScrollReveal from '../ScrollReveal';
import SafeImage from '../SafeImage';
import { IMAGE_PLACEHOLDER_LABEL } from '../../utils/brandConfig';

const proofItems = [
  { label: 'Factory', category: 'gold-jewelry', src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80&auto=format&fit=crop' },
  { label: 'Showroom', category: 'gold-jewelry', src: 'https://images.unsplash.com/photo-1617038220319-276d3aab2915?w=600&q=80&auto=format&fit=crop' },
  { label: 'Production', category: 'gold-jewelry', src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80&auto=format&fit=crop' },
  { label: 'Team', category: 'gold-jewelry', src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop' },
  { label: 'Quality Control', category: 'gold-jewelry', src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80&auto=format&fit=crop' },
  { label: 'Packaging', category: 'gold-jewelry', src: 'https://images.unsplash.com/photo-1610375461246-207c099ac6cc?w=600&q=80&auto=format&fit=crop' },
];

export default function TrustProofSection() {
  return (
    <section className="section-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <p className="section-eyebrow mb-3">Company Proof</p>
          <h2 className="headline-corporate headline-corporate-light mb-4">
            Real Company. Real Operations.
          </h2>
          <p className="text-off-white/60 max-w-xl mx-auto text-sm">
            Certifications, hallmarks and business registrations will be displayed here once provided by the client.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proofItems.map((item) => (
            <ScrollReveal key={item.label}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <SafeImage
                  src={item.src}
                  alt={`Modern Gold ${item.label}`}
                  category={item.category}
                  className="w-full h-full object-cover opacity-70"
                />
                <span className="image-placeholder-label">
                  Modern Gold {item.label} — {IMAGE_PLACEHOLDER_LABEL}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
          {['Certifications', 'Business Registrations', 'Hallmarks'].map((item) => (
            <div key={item} className="p-6 border border-gold/15 bg-dark-surface">
              <p className="text-sm font-semibold text-off-white mb-1">{item}</p>
              <p className="text-xs text-muted-light">[Client to provide]</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
