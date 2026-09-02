import { useState } from 'react';
import { mgConnectScreens } from '../../utils/imageConfig';
import AppScreenWireframe from './AppScreenWireframe';

export default function PhoneMockup({ screen = 'login', label, className = '', style }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = mgConnectScreens[screen];
  const showWireframe = !src || imgFailed;

  return (
    <div className={`phone-mockup ${className}`} style={style}>
      <div className="phone-mockup-frame">
        <div className="phone-mockup-status" aria-hidden="true">
          <span className="phone-mockup-notch" />
        </div>
        <div className="phone-mockup-screen">
          {showWireframe ? (
            <AppScreenWireframe screen={screen} />
          ) : (
            <img
              src={src}
              alt={label || screen}
              className="w-full h-full object-cover object-top"
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
