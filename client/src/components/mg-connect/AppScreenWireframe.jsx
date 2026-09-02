function Bar({ className = '' }) {
  return <div className={`app-wireframe-bar ${className}`} aria-hidden="true" />;
}

function Field({ wide }) {
  return <div className={`app-wireframe-field ${wide ? 'app-wireframe-field--wide' : ''}`} aria-hidden="true" />;
}

function Tile() {
  return (
    <div className="app-wireframe-tile" aria-hidden="true">
      <Bar className="app-wireframe-bar--sm" />
      <Bar className="app-wireframe-bar--xs mt-1.5" />
    </div>
  );
}

function ListRow({ accent }) {
  return (
    <div className="app-wireframe-row" aria-hidden="true">
      <div className={`app-wireframe-dot ${accent ? 'app-wireframe-dot--accent' : ''}`} />
      <div className="flex-1 space-y-1">
        <Bar className="app-wireframe-bar--sm" />
        <Bar className="app-wireframe-bar--xs w-2/3" />
      </div>
    </div>
  );
}

const screens = {
  login: () => (
    <div className="app-wireframe app-wireframe--login">
      <div className="app-wireframe-logo">MG</div>
      <Bar className="app-wireframe-bar--title mx-auto w-1/2 mt-4" />
      <div className="app-wireframe-form mt-6 space-y-3">
        <Field wide />
        <Field wide />
        <div className="app-wireframe-btn mt-4" />
      </div>
    </div>
  ),
  dashboard: () => (
    <div className="app-wireframe app-wireframe--dashboard">
      <div className="app-wireframe-header">
        <Bar className="app-wireframe-bar--title w-1/2" />
      </div>
      <div className="app-wireframe-grid-2 mt-4">
        <Tile />
        <Tile />
        <Tile />
        <Tile />
      </div>
      <div className="app-wireframe-section mt-4 space-y-2">
        <ListRow accent />
        <ListRow />
        <ListRow />
      </div>
    </div>
  ),
  goldBuying: () => (
    <div className="app-wireframe app-wireframe--gold-buying">
      <div className="app-wireframe-header">
        <Bar className="app-wireframe-bar--title w-2/3" />
      </div>
      <div className="app-wireframe-chip mt-3" />
      <div className="app-wireframe-form mt-4 space-y-2.5">
        <Field wide />
        <Field wide />
        <Field wide />
        <div className="app-wireframe-btn mt-3" />
      </div>
    </div>
  ),
  products: () => (
    <div className="app-wireframe app-wireframe--products">
      <Field wide />
      <div className="app-wireframe-grid-2 mt-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="app-wireframe-product" aria-hidden="true">
            <div className="app-wireframe-product-img" />
            <Bar className="app-wireframe-bar--xs mt-2" />
          </div>
        ))}
      </div>
    </div>
  ),
  quotation: () => (
    <div className="app-wireframe app-wireframe--quotation">
      <div className="app-wireframe-header">
        <Bar className="app-wireframe-bar--title w-1/2" />
      </div>
      <div className="app-wireframe-section mt-4 space-y-2">
        <ListRow />
        <ListRow />
        <ListRow />
      </div>
      <div className="app-wireframe-total mt-4">
        <Bar className="app-wireframe-bar--sm w-1/3" />
        <Bar className="app-wireframe-bar--title w-1/4 mt-1" />
      </div>
      <div className="app-wireframe-btn mt-4" />
    </div>
  ),
  orders: () => (
    <div className="app-wireframe app-wireframe--orders">
      <div className="app-wireframe-header">
        <Bar className="app-wireframe-bar--title w-1/2" />
      </div>
      <div className="app-wireframe-section mt-4 space-y-2.5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="app-wireframe-order" aria-hidden="true">
            <div className="flex justify-between items-start gap-2">
              <Bar className="app-wireframe-bar--sm w-1/2" />
              <div className="app-wireframe-badge" />
            </div>
            <Bar className="app-wireframe-bar--xs w-2/3 mt-2" />
          </div>
        ))}
      </div>
    </div>
  ),
};

export default function AppScreenWireframe({ screen = 'login' }) {
  const Screen = screens[screen] || screens.login;
  return <Screen />;
}
