import { AE, GB, HK, MY, RU, SG, US, UZ } from 'country-flag-icons/react/3x2';
import { Globe } from 'lucide-react';

const FLAGS = { AE, GB, HK, MY, RU, SG, US, UZ };

export default function MarketFlag({ country, small = false }) {
  const Flag = country ? FLAGS[country] : null;
  if (!Flag) {
    return <Globe size={small ? 14 : 18} className="text-gold shrink-0" aria-hidden="true" />;
  }
  return (
    <Flag
      aria-hidden="true"
      focusable="false"
      className={`${small ? 'w-4' : 'w-5'} h-auto aspect-[3/2] shrink-0 rounded-[2px] ring-1 ring-black/10`}
    />
  );
}
