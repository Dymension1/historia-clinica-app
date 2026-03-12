import { useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DatosPersonales from './components/DatosPersonales';
import AntecedentesMedicos from './components/AntecedentesMedicos';
import HistoriaOdontologica from './components/HistoriaOdontologica';
import Diagnostico from './components/Diagnostico';
import SeguimientoTratamiento from './components/SeguimientoTratamiento';

// ── Convierte una fila de Supabase → estado del formulario ──
function rowToForm(r) {
  return {
    fecha: r.fecha || '',
    nombre: r.nombre || '',
    dni: r.dni || '',
    sexo: r.sexo || '',
    fechaNacimiento: r.fecha_nacimiento || '',
    edad: r.edad ?? '',
    telefono: r.telefono || '',
    direccion: r.direccion || '',
    email: r.email_paciente || '',
    obraSocial: r.obra_social || '',
    afiliado: r.afiliado || '',
    motivoConsulta: r.motivo_consulta || '',
    'cond_Cardiopatías': r.cond_cardiopatias || false,
    'cond_Hipertensión / Hipotensión': r.cond_hipertension || false,
    'cond_Diabetes': r.cond_diabetes || false,
    'cond_Asma': r.cond_asma || false,
    'cond_Anemia': r.cond_anemia || false,
    'cond_Trastornos tiroideos': r.cond_tiroides || false,
    'cond_Epilepsia': r.cond_epilepsia || false,
    'cond_Trastornos de coagulación': r.cond_coagulacion || false,
    'cond_Embarazo': r.cond_embarazo || false,
    cond_autoinmunes: r.cond_autoinmunes || false,
    autoinmunes_detalle: r.cond_autoinmunes_detalle || '',
    cond_otras: r.cond_otras || false,
    otras_detalle: r.cond_otras_detalle || '',
    fuma: r.fuma || false,
    fuma_detalle: r.fuma_detalle || '',
    alcohol_rta: r.alcohol_rta || '',
    hilo_frec: r.hilo_frec || '',
    enjuague_rta: r.enjuague_rta || '',
    encias_rta: r.encias_rta || '',
    sensibilidad_rta: r.sensibilidad_rta || '',
    bruxismo_rta: r.bruxismo_rta || '',
    reacciones: r.reacciones || false,
    reacciones_detalle: r.reacciones_detalle || '',
    cepilla: r.cepilla || '',
    hiloDental2: r.hilo_dental2 || '',
    enjuague2: r.enjuague2 || '',
    encias2: r.encias2 || '',
    tejidos: r.tejidos || '',
    diagnostico: r.diagnostico || '',
    seguimiento: r.seguimiento || [],
  };
}

// ── Convierte estado del formulario → fila de Supabase ──
function formToRow(datos, userId) {
  return {
    user_id: userId,
    fecha: datos.fecha || null,
    nombre: datos.nombre || null,
    dni: datos.dni || null,
    sexo: datos.sexo || null,
    fecha_nacimiento: datos.fechaNacimiento || null,
    edad: datos.edad ? parseInt(datos.edad) : null,
    telefono: datos.telefono || null,
    direccion: datos.direccion || null,
    email_paciente: datos.email || null,
    obra_social: datos.obraSocial || null,
    afiliado: datos.afiliado || null,
    motivo_consulta: datos.motivoConsulta || null,
    cond_cardiopatias: !!datos['cond_Cardiopatías'],
    cond_hipertension: !!datos['cond_Hipertensión / Hipotensión'],
    cond_diabetes: !!datos['cond_Diabetes'],
    cond_asma: !!datos['cond_Asma'],
    cond_anemia: !!datos['cond_Anemia'],
    cond_tiroides: !!datos['cond_Trastornos tiroideos'],
    cond_epilepsia: !!datos['cond_Epilepsia'],
    cond_coagulacion: !!datos['cond_Trastornos de coagulación'],
    cond_embarazo: !!datos['cond_Embarazo'],
    cond_autoinmunes: !!datos.cond_autoinmunes,
    cond_autoinmunes_detalle: datos.autoinmunes_detalle || null,
    cond_otras: !!datos.cond_otras,
    cond_otras_detalle: datos.otras_detalle || null,
    fuma: !!datos.fuma,
    fuma_detalle: datos.fuma_detalle || null,
    alcohol_rta: datos.alcohol_rta || null,
    hilo_frec: datos.hilo_frec || null,
    enjuague_rta: datos.enjuague_rta || null,
    encias_rta: datos.encias_rta || null,
    sensibilidad_rta: datos.sensibilidad_rta || null,
    bruxismo_rta: datos.bruxismo_rta || null,
    reacciones: !!datos.reacciones,
    reacciones_detalle: datos.reacciones_detalle || null,
    cepilla: datos.cepilla || null,
    hilo_dental2: datos.hiloDental2 || null,
    enjuague2: datos.enjuague2 || null,
    encias2: datos.encias2 || null,
    tejidos: datos.tejidos || null,
    diagnostico: datos.diagnostico || null,
    seguimiento: datos.seguimiento || [],
  };
}

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  // vista: 'dashboard' | 'nueva' | 'editar'
  const [vista, setVista] = useState('dashboard');
  const [editandoId, setEditandoId] = useState(null);
  const [datos, setDatos] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState(null); // 'ok' | 'error' | null

  const manejarCambio = (e) => {
    const { name, type, checked, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const manejarImpresion = () => window.print();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUsuarioActivo(null);
    setSessionId(null);
    setDatos({});
    setVista('dashboard');
  };

  // ── Abrir formulario para nueva historia ──
  const abrirNueva = () => {
    setDatos({});
    setEditandoId(null);
    setEstadoGuardado(null);
    setVista('nueva');
  };

  // ── Abrir formulario en modo edición ──
  const abrirEditar = async (id) => {
    const { data, error } = await supabase
      .from('historias_clinicas')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setDatos(rowToForm(data));
      setEditandoId(id);
      setEstadoGuardado(null);
      setVista('editar');
    }
  };

  // ── Guardar (INSERT o UPDATE según el modo) ──
  const guardarHistoria = async () => {
    setGuardando(true);
    setEstadoGuardado(null);

    const registro = formToRow(datos, sessionId);

    let error;
    if (editandoId) {
      // Modo edición → UPDATE
      ({ error } = await supabase
        .from('historias_clinicas')
        .update(registro)
        .eq('id', editandoId));
    } else {
      // Modo nuevo → INSERT
      ({ error } = await supabase
        .from('historias_clinicas')
        .insert(registro));
    }

    setGuardando(false);
    if (!error) {
      setEstadoGuardado('ok');
      setTimeout(() => {
        setEstadoGuardado(null);
        setVista('dashboard'); // volver al dashboard tras guardar
      }, 1800);
    } else {
      setEstadoGuardado('error');
    }
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
        onNueva={abrirNueva}
        onEditar={abrirEditar}
        onCerrarSesion={cerrarSesion}
      />
    );
  }

  // ── Vista: Formulario (nueva o edición) ──
  return (
    <div
      className="form-page-wrapper"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1b2e 0%, #0a2744 60%, #0d3866 100%)',
        fontFamily: "'Inter', Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @page { size: A4 landscape; margin: 10mm; }
        @media print {
          /* ── Fondo de página completamente blanco ── */
          body, html {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* ── Ocultar UI no imprimible ── */
          .no-print { display: none !important; }
          .form-topbar { display: none !important; }
          .form-actions { display: none !important; }
          .toast { display: none !important; }

          /* ── Wrapper externo: quitar fondo oscuro ── */
          .form-page-wrapper {
            background: white !important;
            min-height: unset !important;
          }
          /* ── Contenedor del cuerpo ── */
          .form-body {
            background: white !important;
            padding: 8px 12px !important;
            max-width: none !important;
            margin: 0 !important;
          }
          /* ── Card sin sombra ni borde oscuro ── */
          .form-card {
            background: white !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          /* ── Encabezado ── */
          .form-header {
            background: #e0f4fb !important;
            border-bottom: 2px solid #00aae4 !important;
            padding: 10px 24px !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .form-title {
            color: #000 !important;
            text-decoration-color: #00aae4 !important;
          }
          .form-inner {
            padding: 8px 16px 12px !important;
            background: white !important;
          }

          /* ── Forzar todo el texto a negro (overrides inline styles) ── */
          .form-inner * { color: #000 !important; }

          /* ── Celdas de datos personales ── */
          .celda {
            background-color: #e8f4fc !important;
            border-right-color: white !important;
            border-bottom-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .lbl { color: #003d6b !important; }
          .inp {
            color: #000 !important;
            border-bottom: 1px solid #7ab3d9 !important;
            background: transparent !important;
          }

          /* ── Títulos de secciones (SECTION_TITLE) ── */
          .form-inner > div > div:first-child {
            background: rgba(0,170,228,0.15) !important;
            border-left: 3px solid #00aae4 !important;
            color: #003d6b !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* ── Fondos de cuerpo de secciones ── */
          .form-inner > div > div:not(:first-child) {
            background: #f5faff !important;
            border: 1px solid #c7dff0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* ── Inputs, selects, textareas ── */
          input, select, textarea {
            color: #000 !important;
            background: transparent !important;
          }

          /* ── Ocultar placeholders en impresión (todos los navegadores) ── */
          ::-webkit-input-placeholder { color: transparent !important; -webkit-text-fill-color: transparent !important; opacity: 0 !important; }
          ::-moz-placeholder           { color: transparent !important; opacity: 0 !important; }
          :-ms-input-placeholder       { color: transparent !important; opacity: 0 !important; }
          ::placeholder                { color: transparent !important; opacity: 0 !important; }
        }

        /* ── Topbar del formulario ── */
        .form-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }
        .form-topbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 17px;
          font-weight: 700;
        }
        .form-topbar-brand span { color: #00aae4; }
        .form-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .form-user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 6px 14px;
          color: rgba(255,255,255,0.85);
          font-size: 13px;
        }
        .btn-back {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 8px;
          color: rgba(255,255,255,0.75);
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-back:hover { background: rgba(255,255,255,0.13); color: white; }
        .btn-logout-form {
          padding: 7px 16px;
          background: transparent;
          border: 1px solid rgba(204,34,0,0.5);
          border-radius: 8px;
          color: #ff6b55;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-logout-form:hover { background: #cc2200; color: white; border-color: #cc2200; }

        /* ── Cuerpo del formulario ── */
        .form-body {
          flex: 1;
          padding: 28px 32px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* ── Card contenedora ── */
        .form-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          overflow: hidden;
        }

        /* ── Encabezado dentro del card ── */
        .form-header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 32px;
          border-bottom: 2px solid rgba(0,170,228,0.3);
          background: rgba(0,170,228,0.06);
        }
        .form-title {
          color: white;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: rgba(0,170,228,0.5);
          margin: 0;
        }
        .form-inner {
          padding: 24px 32px 28px;
        }

        /* ── Clases reutilizadas en DatosPersonales ── */
        .lbl {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 4px;
          font-family: 'Inter', Arial, sans-serif;
        }
        .inp {
          border: none;
          border-bottom: 1px solid rgba(0,170,228,0.35);
          background: transparent;
          outline: none;
          font-family: 'Inter', Arial, sans-serif;
          color: rgba(255,255,255,0.9);
          padding: 4px 0;
          font-size: 13px;
          transition: border-color 0.2s;
        }
        .inp:focus { border-bottom-color: #00aae4; }
        .inp::placeholder { color: rgba(255,255,255,0.2); }
        .inp option { background: #0d2444; color: white; }

        .celda {
          background-color: rgba(255,255,255,0.04);
          border-bottom: 2px solid rgba(255,255,255,0.06);
          border-right: 2px solid rgba(255,255,255,0.06);
          vertical-align: top;
          padding: 10px 14px;
        }

        /* ── Botones de acción ── */
        .form-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          padding: 24px 32px;
          flex-wrap: wrap;
        }
        .btn-save {
          padding: 12px 44px;
          background: linear-gradient(135deg, #00a651, #007a3d);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Inter', Arial, sans-serif;
          box-shadow: 0 2px 12px rgba(0,166,81,0.4);
          transition: opacity 0.2s, transform 0.1s;
        }
        .btn-save:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-print {
          padding: 12px 44px;
          background: linear-gradient(135deg, #00aae4, #0056b3);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Inter', Arial, sans-serif;
          box-shadow: 0 2px 12px rgba(0,170,228,0.35);
          transition: opacity 0.2s, transform 0.1s;
        }
        .btn-print:hover { opacity: 0.9; transform: translateY(-1px); }

        .btn-cancel-form {
          padding: 12px 28px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          transition: background 0.2s, color 0.2s;
        }
        .btn-cancel-form:hover { background: rgba(255,255,255,0.12); color: white; }

        /* ── Toast ── */
        .toast {
          margin: 0 32px 24px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          animation: fadeIn 0.3s ease;
        }
        .toast-ok    { background: rgba(0,166,81,0.15); color: #4ade80; border: 1px solid rgba(0,166,81,0.3); }
        .toast-error { background: rgba(204,34,0,0.15); color: #ff8a95; border: 1px solid rgba(204,34,0,0.3); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

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
            {/*<SeguimientoTratamiento onChange={manejarCambio} valores={datos} />*/}
          </div>

          {/* Acciones */}
          <div className="form-actions no-print">
            <button className="btn-save" onClick={guardarHistoria} disabled={guardando}>
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
