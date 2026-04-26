import { Sidebar } from 'primereact/sidebar';
import { MegaMenu } from 'primereact/megamenu';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useMemo, type ReactNode, useEffect } from 'react';
import type { MenuItem, MenuItemOptions } from 'primereact/menuitem';
import '../styles/Topbar.css';

interface TopbarProps {
  usuario: string;
  onLogoClick?: () => void;
  onCerrarSesion?: () => void;
  children?: ReactNode;
}

function Topbar({ usuario, onLogoClick, onCerrarSesion, children }: TopbarProps) {
  const [visible, setVisible] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuActive) return; // Solo escucha cuando el menú está abierto

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuActive(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuActive(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuActive]);

  const items = useMemo<MenuItem[]>(() => [
    {
      label: 'Panel General',
      icon: 'pi pi-fw pi-compass',
      items: [
        [
          {
            label: 'Historias Clínicas',
            items: [
              { label: 'Dashboard', icon: 'pi pi-home', command: () => { navigate('/dashboard'); setVisible(false); } }
            ]
          }
        ]
      ]
    }
  ], [navigate]);

  const userMenuItems = useMemo<MenuItem[]>(() => [
    { label: 'Mi Perfil', icon: 'pi pi-user', disabled: true },
    { label: 'Ajustes', icon: 'pi pi-cog', disabled: true },
    { separator: true },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      template: (item: MenuItem, options: MenuItemOptions) => (
        <button
          onClick={(e) => { onCerrarSesion?.(); options.onClick(e); }}
          className={`${options.className} menu-item-danger`}
        >
          <i className={item.icon as string}></i>
          <span className={options.labelClassName}>{item.label}</span>
        </button>
      )
    }
  ], [onCerrarSesion]);

  return (
    <div className="app-topbar no-print">
      <div className="app-topbar-brand">
        <button className="btn-hamburger" onClick={() => setVisible(true)} title="Menú">
          <i className="pi pi-bars"></i>
        </button>
        <div
          className="app-logo"
          onClick={onLogoClick || (() => navigate('/dashboard'))}
          title="Ir al Dashboard"
        >
          🦷 Historia<span>Clínica</span>
        </div>
      </div>

      <Sidebar visible={visible} onHide={() => setVisible(false)} className="nav-sidebar">
        <div className="sidebar-header">
          <h2>🦷 Historia<span>Clínica</span></h2>
        </div>
        <MegaMenu model={items} orientation="vertical" breakpoint="960px" className="custom-megamenu" />
      </Sidebar>

      <div className="app-topbar-right">
        <div className="user-menu-wrapper" ref={menuRef}>
          <button
            className={`app-user-badge ${menuActive ? 'active' : ''}`}
            onClick={() => setMenuActive(prev => !prev)}
            aria-haspopup="true"
            aria-expanded={menuActive}
            aria-label="Menú de usuario"
          >
            <i className="pi pi-user"></i>
            <span>{usuario}</span>
            <i className={`pi pi-chevron-down badge-chevron ${menuActive ? 'rotated' : ''}`}></i>
          </button>

          {menuActive && (
            <Menu
              model={userMenuItems}
              id="user_menu"
              className="custom-user-menu"
            />
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export default Topbar;
