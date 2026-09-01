import { Link } from 'react-router-dom';

export default function SectionHeader({ eyebrow, title, subtitle, linkTo, linkLabel, className = '', centered = false }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12 ${centered ? 'text-center sm:text-left' : ''} ${className}`}>
      <div className={centered ? 'mx-auto sm:mx-0' : ''}>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="type-section-title">{title}</h2>
        <div className="section-title-line" />
        {subtitle && <p className="type-section-desc prose-section mt-3">{subtitle}</p>}
      </div>
      {linkTo && linkLabel && (
        <Link to={linkTo} className="type-body-sm font-medium text-gold hover:text-gold-dark transition-colors shrink-0">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
