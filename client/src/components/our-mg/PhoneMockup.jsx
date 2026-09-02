import { useState } from 'react';
import { ourMgScreens } from '../../utils/imageConfig';
import AppScreenshotPlaceholder from './AppScreenshotPlaceholder';

export default function PhoneMockup({
  screen,
  placeholderNumber,
  placeholderName,
  className = '',
  large = false,
}) {
  const [failed, setFailed] = useState(false);
  const src = ourMgScreens[screen];
  const showPlaceholder = !src || failed;
  const showNotch = showPlaceholder;

  return (
    <div className={`phone-mockup ${large ? 'our-mg-phone-large' : ''} ${className}`.trim()}>
      <div className="phone-mockup-frame">
        {showNotch && (
          <div className="phone-mockup-status">
            <div className="phone-mockup-notch" />
          </div>
        )}
        <div className="phone-mockup-screen">
          {showPlaceholder ? (
            <AppScreenshotPlaceholder
              label={placeholderNumber ? `APP SCREENSHOT ${placeholderNumber}` : 'APP SCREENSHOT'}
              name={placeholderName}
            />
          ) : (
            <img
              src={src}
              alt={placeholderName || screen}
              className="w-full h-full object-cover object-top"
              onError={() => setFailed(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
