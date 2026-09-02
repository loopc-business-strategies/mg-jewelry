import { ourMgApp } from '../../utils/brandConfig';

export default function OurMGPlatformLink({ className, children }) {
  if (!ourMgApp.platformUrl) return null;

  return (
    <a
      href={ourMgApp.platformUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
