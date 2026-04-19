import type { ReactNode } from 'react';
import '../styles/Topbar.css';

interface TopbarProps {
  usuario: string;
  children?: ReactNode;
}

function Topbar({ usuario, children }: TopbarProps) {
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
