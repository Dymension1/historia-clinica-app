import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useHistoriaClinica } from './hooks/useHistoriaClinica';
import './styles/form.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DatosPersonales from './components/DatosPersonales';
import AntecedentesMedicos from './components/AntecedentesMedicos';
import HistoriaOdontologica from './components/HistoriaOdontologica';
import Diagnostico from './components/Diagnostico';
import SeguimientoTratamiento from './components/SeguimientoTratamiento';

function App() {
  const { usuario, userId, cargando, cerrarSesion } = useAuth();
  // vista: 'dashboard' | 'nueva' | 'editar'
  const [vista, setVista] = useState('dashboard');

  const {
    datos,
    editandoId,
    guardando,
    estadoGuardado,
    manejarCambio,
    abrirNueva,
    abrirEditar,
    guardarHistoria,
  } = useHistoriaClinica({ onGuardadoOk: () => setVista('dashboard') });

  const manejarImpresion = () => window.print();

  const handleAbrirNueva = () => {
    abrirNueva();
    setVista('nueva');
  };

  const handleAbrirEditar = async (id) => {
    await abrirEditar(id);
    setVista('editar');
  };

  // ── Verificando sesión inicial (evita flash de login) ──
  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1b2e 0%, #0a2744 60%, #0d3866 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', Arial, sans-serif",
      }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🦷</div>
          <div style={{ fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Verificando sesión...</div>
        </div>
      </div>
    );
  }

  // ── Sin sesión → Login ──
  if (!usuario) {
    return (
      <Login
        onLogin={() => {
          // La sesión es manejada por onAuthStateChange en el useEffect
        }}
      />
    );
  }

  // ── Vista: Dashboard ──
  if (vista === 'dashboard') {
    return (
      <Dashboard
        usuario={usuario}
        onNueva={handleAbrirNueva}
        onEditar={handleAbrirEditar}
        onCerrarSesion={cerrarSesion}
      />
    );
  }

  // ── Vista: Formulario (nueva o edición) ──
  return (
    <div className="form-page-wrapper">

      {/* ── Topbar ── */}
      <div className="form-topbar no-print">
        <div className="form-topbar-brand">🦷 Historia<span>Clínica</span></div>
        <div className="form-topbar-right">
          <div className="form-user-badge">👤 {usuario}</div>
          <button className="btn-back" onClick={() => setVista('dashboard')}>← Dashboard</button>
          <button className="btn-logout-form" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="form-body">
        <h1 className="form-page-title">
          {editandoId ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
        </h1>
        <div className="form-card">

          {/* Secciones — key fuerza re-montaje al cambiar de registro */}
          <div className="form-inner" key={editandoId || 'nuevo'}>
            <DatosPersonales onChange={manejarCambio} valores={datos} />
            <AntecedentesMedicos onChange={manejarCambio} valores={datos} />
            <HistoriaOdontologica onChange={manejarCambio} valores={datos} />
            <Diagnostico onChange={manejarCambio} valores={datos} />
            <SeguimientoTratamiento onChange={manejarCambio} valores={datos} />
          </div>

          {/* Acciones */}
          <div className="form-actions no-print">
            <button className="btn-save" onClick={() => guardarHistoria(userId)} disabled={guardando}>
              {guardando ? '⏳ Guardando...' : editandoId ? '💾 Guardar cambios' : '💾 Guardar Historia'}
            </button>
            <button className="btn-print" onClick={manejarImpresion}>🖨️ Imprimir / PDF</button>
            <button className="btn-cancel-form" onClick={() => setVista('dashboard')}>✕ Cancelar</button>
          </div>

          {/* Toast */}
          {estadoGuardado === 'ok' && <div className="toast toast-ok">✅ Guardado correctamente — volviendo al panel...</div>}
          {estadoGuardado === 'error' && <div className="toast toast-error">❌ Error al guardar. Verificá tu conexión.</div>}

        </div>
      </div>
    </div>
  );
}

export default App;
