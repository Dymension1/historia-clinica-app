import { useState } from 'react';
import { supabase } from './supabaseClient';
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
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [sessionId, setSessionId] = useState(null);
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

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUsuarioActivo(null);
    setSessionId(null);
    setVista('dashboard');
  };

  const handleAbrirNueva = () => {
    abrirNueva();
    setVista('nueva');
  };

  const handleAbrirEditar = async (id) => {
    await abrirEditar(id);
    setVista('editar');
  };

  // ── Sin sesión → Login ──
  if (!usuarioActivo) {
    return (
      <Login
        onLogin={(email, userId) => {
          setUsuarioActivo(email);
          setSessionId(userId);
        }}
      />
    );
  }

  // ── Vista: Dashboard ──
  if (vista === 'dashboard') {
    return (
      <Dashboard
        usuario={usuarioActivo}
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
          <button className="btn-back" onClick={() => setVista('dashboard')}>← Panel</button>
          <div className="form-user-badge">👤 {usuarioActivo}</div>
          <button className="btn-logout-form" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="form-body">
        <div className="form-card">

          {/* Encabezado */}
          <div className="form-header">
            <h2 className="form-title">
              {editandoId ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
            </h2>
          </div>

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
            <button className="btn-save" onClick={() => guardarHistoria(sessionId)} disabled={guardando}>
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
