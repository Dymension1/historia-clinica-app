import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import Topbar from './Topbar';
import '../styles/Dashboard.css';

function Dashboard({ usuario, onNueva, onEditar, onCerrarSesion }) {
  const [registros, setRegistros] = useState([]);
  const [totales, setTotales] = useState({ total: 0, esteMes: 0 });
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [cargandoEdicion, setCargandoEdicion] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const inicializado = useRef(false);
  const toast = useRef(null);

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

  const confirmarEliminacion = (id) => {
    confirmDialog({
      message: 'Esta acción no se puede deshacer. El registro será eliminado permanentemente.',
      header: '¿Eliminar registro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-confirm-dialog-accept',
      rejectClassName: 'p-confirm-dialog-reject',
      accept: async () => {
        const { error } = await supabase.from('historias_clinicas').delete().eq('id', id);
        if (error) {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro', life: 3000 });
        } else {
          toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado correctamente', life: 3000 });
          // Actualizar la lista de registros y los totales
          setRegistros((prev) => prev.filter((r) => r.id !== id));
          cargarTotales();
          // Si la búsqueda está activa, recargar los registros con la búsqueda actual
          if (busqueda) {
            cargarRegistros(busqueda);
          }
        }
      },
    });
  };

  const fmtFecha = (str) => {
    if (!str) return '—';
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="db-wrapper">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Topbar usuario={usuario}>
        <button className="btn-primary" onClick={onNueva}>
          <i className="pi pi-plus"></i> Nueva historia
        </button>
        <button className="btn-ghost-red" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </Topbar>
        {/* ── Contenido ── */}
        <div className="db-content">
          {/* KPIs */}
          <div className="db-kpis">
            <div className="db-kpi">
              <div className="db-kpi-icon">📋</div>
              <div className="db-kpi-data">
                <div className="db-kpi-label">Total de registros</div>
                <div className="db-kpi-value">{totales.total}</div>
              </div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-icon">📅</div>
              <div className="db-kpi-data">
                <div className="db-kpi-label">Este mes</div>
                <div className="db-kpi-value">{totales.esteMes}</div>
              </div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-icon">🔍</div>
              <div className="db-kpi-data">
                <div className="db-kpi-label">{busqueda ? 'Resultados encontrados' : 'Historias visibles'}</div>
                <div className="db-kpi-value">{registros.length}</div>
              </div>
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
            <div className="db-error">
              <span>✕</span> {errorCarga}
              <button
                className="btn-retry"
                onClick={() => { cargarTotales(); cargarRegistros(busqueda); }}
              >
                Reintentar
              </button>
            </div>
          )}
          {/* Tabla */}
          <div className="db-table-wrap">
            {cargando ? (
              <DataTable value={[1, 2, 3, 4, 5]} className="db-primetable">
                <Column header="Fecha" body={<Skeleton width="80%" />} />
                <Column header="Paciente" body={<Skeleton width="90%" />} />
                <Column header="DNI" body={<Skeleton width="70%" />} />
                <Column header="Motivo de consulta" body={<Skeleton width="95%" />} />
                <Column header="Diagnóstico" body={<Skeleton width="100%" />} />
                <Column header="Registrado" body={<Skeleton width="85%" />} />
                <Column header="Acciones" body={<Skeleton width="60px" shape="circle" />} />
              </DataTable>
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
                    <button className="btn-del" onClick={() => confirmarEliminacion(r.id)} title="Eliminar">🗑️</button>
                  </div>
                )} />
              </DataTable>
            )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
