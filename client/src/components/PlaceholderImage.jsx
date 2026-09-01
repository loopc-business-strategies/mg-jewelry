import SafeImage from './SafeImage';
import { IMAGE_PLACEHOLDER_LABEL } from '../utils/brandConfig';

export default function PlaceholderImage({
  src,
  alt,
  label,
  category = 'gold-jewelry',
  className = 'w-full h-full object-cover',
  aspect = 'aspect-[4/3]',
}) {
  return (
    <div className={`relative overflow-hidden rounded-sm border border-gold/15 image-zoom-hover ${aspect}`}>
      <SafeImage src={src} alt={alt} category={category} className={className} />
      <span className="image-placeholder-label">
        {label} — {IMAGE_PLACEHOLDER_LABEL}
      </span>
    </div>
  );
}
