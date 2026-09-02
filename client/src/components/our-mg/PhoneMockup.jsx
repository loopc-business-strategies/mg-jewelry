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

  if (!showPlaceholder) {
    return (
      <div className={`phone-mockup phone-mockup--device ${large ? 'our-mg-phone-large' : ''} ${className}`.trim()}>
        <img
          src={src}
          alt={placeholderName || screen}
          className="phone-mockup-device-img"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={`phone-mockup ${large ? 'our-mg-phone-large' : ''} ${className}`.trim()}>
      <div className="phone-mockup-frame">
        <div className="phone-mockup-status">
          <div className="phone-mockup-notch" />
        </div>
        <div className="phone-mockup-screen">
          <AppScreenshotPlaceholder
            label={placeholderNumber ? `APP SCREENSHOT ${placeholderNumber}` : 'APP SCREENSHOT'}
            name={placeholderName}
          />
        </div>
      </div>
    </div>
  );
}
