export default function AppScreenshotPlaceholder({ number = '01', screenName = 'Screen' }) {
  return (
    <div className="app-screenshot-placeholder">
      <p className="app-screenshot-placeholder__label">APP SCREENSHOT {number}</p>
      <p className="app-screenshot-placeholder__name">{screenName}</p>
    </div>
  );
}
