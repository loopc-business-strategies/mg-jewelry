import { Link } from 'react-router-dom';

export default function SectionHeader({ eyebrow, title, subtitle, linkTo, linkLabel, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12 ${className}`}>
      <div>
        {eyebrow && <p className="section-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-2xl md:text-3xl font-semibold text-charcoal">{title}</h2>
        <div className="section-title-line" />
        {subtitle && <p className="text-muted mt-3 max-w-xl text-sm md:text-base">{subtitle}</p>}
      </div>
      {linkTo && linkLabel && (
        <Link to={linkTo} className="text-sm font-medium text-gold hover:text-gold-dark transition-colors shrink-0">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
