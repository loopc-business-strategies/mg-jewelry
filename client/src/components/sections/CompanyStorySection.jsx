import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { companyStory } from '../../utils/brandConfig';

export default function CompanyStorySection() {
  return (
    <section className="section-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <p className="section-eyebrow mb-3">About Modern Gold</p>
            <h2 className="headline-corporate headline-corporate-dark mb-6">
              From Jewellery Production to Gold Industry Leadership
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              Modern Gold began with professional gold jewellery manufacturing — producing chains and bangles
              for business and international buyers. Today, the company is expanding across the broader gold
              industry, connecting regional gold supply with global markets.
            </p>
            <Link to="/about" className="btn-gold-outline inline-flex">
              Our Story <ArrowRight size={16} />
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-0 border-l border-gold/30 pl-8">
              {companyStory.phases.map((phase, i) => (
                <div key={phase.title} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[2.05rem] top-1 w-3 h-3 rounded-full bg-gold border-2 border-off-white" />
                  <p className="text-xs tracking-widest uppercase text-gold mb-1">
                    Phase {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display font-semibold text-dark mb-2">{phase.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
