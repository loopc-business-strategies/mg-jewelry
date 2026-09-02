export default function AppScreenshotPlaceholder({ label, name }) {
  return (
    <div className="app-screenshot-placeholder">
      <span className="app-screenshot-placeholder__label">{label}</span>
      {name && <span className="app-screenshot-placeholder__name">{name}</span>}
    </div>
  );
}
