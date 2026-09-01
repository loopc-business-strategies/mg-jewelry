import ScrollReveal from '../ScrollReveal';
import { credibilityPoints } from '../../utils/brandConfig';

export default function CredibilitySection() {
  return (
    <section className="section-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <p className="section-eyebrow mb-3">Why Modern Gold</p>
          <h2 className="headline-corporate headline-corporate-dark">
            A Serious Gold Industry Company
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {credibilityPoints.map((point, i) => (
            <ScrollReveal key={point.title} className={`delay-[${i * 50}ms]`}>
              <div className="p-6 border border-gold/15 bg-white h-full">
                <div className="w-8 h-px bg-gold mb-4" />
                <h3 className="font-display font-semibold text-dark mb-2">{point.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{point.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
