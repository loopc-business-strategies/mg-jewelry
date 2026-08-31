import { trustIndicators } from '../../utils/brandConfig';

const icons = ['⚙️', '✦', '💎', '🌍', '✨', '🤝'];

export default function TrustSection() {
  return (
    <section className="py-20 px-4 section-gradient-warm">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center text-charcoal mb-12">Why Partners Choose Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
          {trustIndicators.map((item, i) => (
            <div key={item.title} className="bg-white/80 rounded-2xl p-6 border border-gold/10 text-center animate-reveal">
              <span className="text-3xl mb-3 block">{icons[i]}</span>
              <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
