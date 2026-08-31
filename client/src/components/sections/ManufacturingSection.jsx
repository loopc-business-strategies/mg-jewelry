import { Link } from 'react-router-dom';
import { manufacturingSteps } from '../../utils/brandConfig';

const stepColors = ['text-coral', 'text-sapphire', 'text-gold', 'text-emerald', 'text-ruby', 'text-turquoise'];

export default function ManufacturingSection({ compact = false }) {
  return (
    <section className={`${compact ? 'py-12' : 'py-20'} px-4 section-gradient-cool`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Our Manufacturing Journey</h2>
          <p className="text-muted max-w-2xl mx-auto">From design concept to international delivery — precision at every stage.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
          {manufacturingSteps.map((step, i) => (
            <div key={step.step} className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all animate-reveal">
              <span className={`font-display text-3xl ${stepColors[i]} opacity-80`}>{step.step}</span>
              <h3 className="font-display text-xl text-charcoal mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        {!compact && (
          <div className="text-center mt-10">
            <Link to="/manufacturing" className="inline-flex bg-gold text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors">
              Learn About Our Process
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
