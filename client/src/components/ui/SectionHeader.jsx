import { Link } from 'react-router-dom';

export default function SectionHeader({ eyebrow, title, subtitle, linkTo, linkLabel, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 ${className}`}>
      <div>
        {eyebrow && <p className="section-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="font-display text-3xl md:text-4xl text-charcoal">{title}</h2>
        {subtitle && <p className="text-muted mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {linkTo && linkLabel && (
        <Link to={linkTo} className="text-sm text-charcoal hover:text-gold transition-colors shrink-0 tracking-wide">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
