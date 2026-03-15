import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Dashboard.css';

function Dashboard({ usuario, onNueva, onEditar, onCerrarSesion }) {
  const [registros, setRegistros] = useState([]);
  const [totales, setTotales] = useState({ total: 0, esteMes: 0 });
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [eliminando, setEliminando] = useState(null);
  const [cargandoEdicion, setCargandoEdicion] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const inicializado = useRef(false);

  // ── Conteos independientes para los KPIs ──
  const cargarTotales = useCallback(async () => {
    const now = new Date();
    const primerDiaMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const [{ count: total }, { count: esteMes }] = await Promise.all([
      supabase.from('historias_clinicas').select('id', { count: 'exact', head: true }),
      supabase.from('historias_clinicas').select('id', { count: 'exact', head: true }).gte('created_at', primerDiaMes),
    ]);
    setTotales({ total: total || 0, esteMes: esteMes || 0 });
  }, []);

  // ── Carga/filtra registros en Supabase (server-side) ──
  const cargarRegistros = useCallback(async (query = '') => {
    setCargando(true);
    setErrorCarga(null);

    let req = supabase
      .from('historias_clinicas')
      .select('id, created_at, fecha, nombre, dni, motivo_consulta, diagnostico')
      .order('created_at', { ascending: false });

    if (query.trim()) {
      req = req.or(
        `nombre.ilike.%${query.trim()}%,dni.ilike.%${query.trim()}%,motivo_consulta.ilike.%${query.trim()}%`
      );
    }

    const { data, error } = await req;
    if (error) {
      setErrorCarga('No se pudieron cargar los registros. Verificá tu conexión e intentá de nuevo.');
      setRegistros([]);
    } else {
      setRegistros(data || []);
    }
    setCargando(false);
  }, []);

  // Carga inicial
  useEffect(() => {
    cargarTotales();
    cargarRegistros();
  }, [cargarTotales, cargarRegistros]);

  // Búsqueda server-side con debounce 350 ms (omite el primer render)
  useEffect(() => {
    if (!inicializado.current) {
      inicializado.current = true;
      return;
    }
    const timer = setTimeout(() => cargarRegistros(busqueda), 350);
    return () => clearTimeout(timer);
  }, [busqueda, cargarRegistros]);

  const eliminar = async (id) => {
    const { error } = await supabase.from('historias_clinicas').delete().eq('id', id);
    if (!error) {
      setRegistros((prev) => prev.filter((r) => r.id !== id));
      cargarTotales();
    }
    setEliminando(null);
  };

  const fmtFecha = (str) => {
    if (!str) return '—';
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      {/* ── Modal confirmación de eliminación ── */}
      {eliminando && (
        <div className="db-overlay">
          <div className="db-modal">
            <div className="db-modal-icon">🗑️</div>
            <div className="db-modal-title">¿Eliminar registro?</div>
            <div className="db-modal-msg">Esta acción no se puede deshacer. El registro será eliminado permanentemente.</div>
            <div className="db-modal-actions">
              <button className="btn-cancel" onClick={() => setEliminando(null)}>Cancelar</button>
              <button className="btn-confirmar-del" onClick={() => eliminar(eliminando)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="db-wrapper">

        {/* ── Topbar ── */}
        <div className="db-topbar">
          <div className="db-topbar-brand">
            🦷 Historia<span>Clínica</span>
          </div>
          <div className="db-topbar-right">
            <div className="db-user-badge">👤 {usuario}</div>
            <button className="btn-primary" onClick={onNueva}>+ Nueva historia</button>
            <button className="btn-ghost-red" onClick={onCerrarSesion}>Cerrar sesión</button>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div className="db-content">

          {/* KPIs */}
          <div className="db-kpis">
            <div className="db-kpi">
              <div className="db-kpi-label">Total de registros</div>
              <div className="db-kpi-value">{totales.total}</div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-label">Este mes</div>
              <div className="db-kpi-value">{totales.esteMes}</div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-label">{busqueda ? 'Resultados encontrados' : 'Mostrando'}</div>
              <div className="db-kpi-value">{registros.length}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="db-toolbar">
            <input
              type="text"
              className="db-search"
              placeholder="🔍  Buscar por nombre, DNI o motivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn-primary" onClick={() => { cargarTotales(); cargarRegistros(busqueda); }}>↺ Actualizar</button>
          </div>

          {/* Banner de error */}
          {errorCarga && (
            <div style={{
              background: 'rgba(204,34,0,0.12)',
              border: '1px solid rgba(204,34,0,0.35)',
              borderRadius: '10px',
              padding: '14px 20px',
              marginBottom: '16px',
              color: '#ff8a95',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              ❌ {errorCarga}
              <button
                onClick={() => { cargarTotales(); cargarRegistros(busqueda); }}
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', padding: '4px 12px', cursor: 'pointer', fontSize: '12px' }}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Tabla */}
          <div className="db-table-wrap">
            {cargando ? (
              <div className="db-empty">
                <div className="db-empty-icon">⏳</div>
                <div className="db-empty-msg">Cargando registros...</div>
              </div>
            ) : registros.length === 0 && !errorCarga ? (
              <div className="db-empty">
                <div className="db-empty-icon">{busqueda ? '🔍' : '📋'}</div>
                <div className="db-empty-msg">
                  {busqueda ? 'No se encontraron resultados para tu búsqueda' : 'No hay historias clínicas registradas aún'}
                </div>
              </div>
            ) : (
              <DataTable
                value={registros}
                className="db-primetable"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey="id"
                emptyMessage="No se encontraron registros."
              >
                <Column field="fecha" header="Fecha" body={(r) => fmtFecha(r.fecha)} sortable />
                <Column field="nombre" header="Paciente" body={(r) => <span className="db-badge-nombre">{r.nombre || '—'}</span>} sortable />
                <Column field="dni" header="DNI" body={(r) => r.dni ? <span className="db-badge-dni">{r.dni}</span> : '—'} sortable />
                <Column field="motivo_consulta" header="Motivo de consulta" body={(r) => <span className="db-motivo" title={r.motivo_consulta}>{r.motivo_consulta || '—'}</span>} sortable />
                <Column field="diagnostico" header="Diagnóstico" body={(r) => <span className="db-diagnostico">{r.diagnostico || '—'}</span>} sortable />
                <Column field="created_at" header="Registrado" body={(r) => <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{new Date(r.created_at).toLocaleDateString('es-AR')}</span>} sortable />
                <Column header="Acciones" body={(r) => (
                  <div className="db-actions">
                    <button
                      className="btn-edit"
                      disabled={cargandoEdicion === r.id}
                      onClick={async () => {
                        setCargandoEdicion(r.id);
                        await onEditar(r.id);
                        setCargandoEdicion(null);
                      }}
                      title="Editar"
                    >
                      {cargandoEdicion === r.id ? '⏳' : '✏️'}
                    </button>
                    <button className="btn-del" onClick={() => setEliminando(r.id)} title="Eliminar">🗑️</button>
                  </div>
                )} />
              </DataTable>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
