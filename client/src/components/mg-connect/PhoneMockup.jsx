import { useState } from 'react';
import { mgConnectScreens } from '../../utils/imageConfig';
import AppScreenshotPlaceholder from './AppScreenshotPlaceholder';

export default function PhoneMockup({
  screen = 'login',
  label,
  placeholderNumber = '01',
  placeholderName,
  className = '',
  style,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = mgConnectScreens[screen];
  const showPlaceholder = !src || imgFailed;
  const screenLabel = placeholderName || label || screen;

  return (
    <div className={`phone-mockup ${className}`} style={style}>
      <div className="phone-mockup-frame">
        <div className="phone-mockup-status" aria-hidden="true">
          <span className="phone-mockup-notch" />
        </div>
        <div className="phone-mockup-screen">
          {showPlaceholder ? (
            <AppScreenshotPlaceholder number={placeholderNumber} screenName={screenLabel} />
          ) : (
            <img
              src={src}
              alt={label || screenLabel}
              className="w-full h-full object-contain object-top bg-white"
              onError={() => setImgFailed(true)}
            />
          )}
        </div>
      </div>
      {label && (
        <p className="phone-mockup-label type-micro text-center mt-3 text-muted">{label}</p>
      )}
    </div>
  );
}
