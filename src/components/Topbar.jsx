import '../styles/Topbar.css';

function Topbar({ usuario, children }) {
  return (
    <div className="app-topbar no-print">
      <div className="app-topbar-brand">
        🦷 Historia<span>Clínica</span>
      </div>
      <div className="app-topbar-right">
        <div className="app-user-badge">
          <i className="pi pi-user"></i> {usuario}
        </div>
        {children}
      </div>
    </div>
  );
}

export default Topbar;
