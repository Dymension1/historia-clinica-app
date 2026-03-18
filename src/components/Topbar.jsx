import '../styles/Topbar.css';

/**
 * Barra superior de navegación unificada en todo el sistema.
 * 
 * @param {Object} props
 * @param {string} props.usuario - Email o nombre visible del usuario activo en la sesión.
 * @param {React.ReactNode} props.children - Botones de control situados a la derecha (Ej. Cerrar sesión).
 * @returns {JSX.Element} Elemento del DOM `<div className="app-topbar">`.
 */
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
