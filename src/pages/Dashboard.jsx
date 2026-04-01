import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import Topbar from '../components/Topbar';
import '../styles/Dashboard.css';

/**
 * Componente principal interactivo del Dashboard. 
 * Responsable de la visualización tabular perezosa (Server-Side Pagination), los KPIS (Key Performance Indicators),
 * ruteo hacia acciones de creación/edición, y el control de sesiones junto con la barra superior de la app.
 * Utiliza `@tanstack/react-query` para la gestión remota e invalidación caché.
 *
 * @param {Object} props - Las propiedades que recibe el Dashboard.
 * @param {string} props.usuario - Email del dentista/usuario activo (inyectado desde `App.jsx`).
 * @param {Function} props.onNueva - Función de ruteo para redirigir al contexto vacío (Nueva Historia).
 * @param {Function} props.onEditar - Función de ruteo que acepta una ID de historia para abrir su contexto de edición.
 * @param {Function} props.onCerrarSesion - Función para cerrar la sesión abierta de Supabase.
 * @returns {JSX.Element} El esqueleto del dashboard de administración general.
 */
function Dashboard({ usuario, onNueva, onEditar, onCerrarSesion }) {
  const [busqueda, setBusqueda] = useState('');
  const [busquedaDebounced, setBusquedaDebounced] = useState('');
  const [cargandoEdicion, setCargandoEdicion] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState(-1); // -1 = DESC, 1 = ASC
  const toast = useRef(null);
  const queryClient = useQueryClient();

  // ── 1. Carga Inteligente (Server-Side Pagination) con React Query ──
  const {
    data: paginatedData = { data: [], count: 0 },
    isLoading: cargandoRegistros,
    error: errorRegistros,
    refetch: refetchRegistros
  } = useQuery({
    queryKey: ['historias', busquedaDebounced, first, rows, sortField, sortOrder],
    queryFn: async () => {
      let req = supabase
        .from('historias_clinicas')
        .select('id, created_at, fecha, nombre, dni, motivo_consulta, diagnostico', { count: 'exact' })
        .order(sortField || 'created_at', { ascending: sortOrder === 1 })
        .range(first, first + rows - 1);

      if (busquedaDebounced.trim()) {
        req = req.or(`nombre.ilike.%${busquedaDebounced.trim()}%,dni.ilike.%${busquedaDebounced.trim()}%,motivo_consulta.ilike.%${busquedaDebounced.trim()}%`);
      }

      const { data, count, error } = await req;
      if (error) throw new Error('No se pudieron cargar los registros.');
      return { data: data || [], count: count || 0 };
    }
  });

  // ── 2. Carga Inteligente de KPIs/Totales con React Query ──
  const { data: totales = { total: 0, esteMes: 0 }, refetch: refetchTotales } = useQuery({
    queryKey: ['totalesHistorias'],
    queryFn: async () => {
      const now = new Date();
      const primerDiaMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const [{ count: total }, { count: esteMes }] = await Promise.all([
        supabase.from('historias_clinicas').select('id', { count: 'exact', head: true }),
        supabase.from('historias_clinicas').select('id', { count: 'exact', head: true }).gte('created_at', primerDiaMes),
      ]);
      return { total: total || 0, esteMes: esteMes || 0 };
    }
  });

  // Debounce simple para la barra de búsqueda (sin disparar miles de reqs a la BD)
  const timerBusqueda = useRef();
  /**
   * Genera el debounce de la barra de búsqueda general del Dashboard para mitigar disparos
   * absurdos hacia la Base de Datos. Establece un bloque de 400ms después de la última techa pulsada 
   * antes de emitir definitivamente el estado a `busquedaDebounced`, provocando un recálculo a React Query.
   * Por seguridad, cada búsqueda reinicia silenciosamente la matriz de la página a la `0`.
   * 
   * @param {string} valor - Valor en plano del InputText que el usuario está escribiendo.
   */
  const manejarBusqueda = (valor) => {
    setBusqueda(valor);
    clearTimeout(timerBusqueda.current);
    timerBusqueda.current = setTimeout(() => {
      setBusquedaDebounced(valor);
      setFirst(0); // Volver a la primera página al buscar
    }, 400); // 400ms de gracia al tipear
  };

  /**
   * Muestra el modal o diálogo de emergencia para confirmar un intento destructivo de base de datos.
   * Tras la aceptación, emite una operación `.delete` a Supabase y obliga a React Query a ensuciar 
   * las variables y datos actuales `invalidateQueries()`, provocando así la recarga de KPIs y tabla remota.
   * 
   * @param {string|number} id - Identificador de base de datos del paciente a eliminar irrevocablemente.
   */
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
          // Invalida la caché de React Query para que recargue automáticamente
          queryClient.invalidateQueries({ queryKey: ['historias'] });
          queryClient.invalidateQueries({ queryKey: ['totalesHistorias'] });
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
              <div className="db-kpi-label">{busquedaDebounced ? 'Resultados encontrados' : 'Total filtrado'}</div>
              <div className="db-kpi-value">{paginatedData.count}</div>
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
            onChange={(e) => manejarBusqueda(e.target.value)}
          />
          <button className="btn-primary" onClick={() => { refetchTotales(); refetchRegistros(); }}>↺ Actualizar</button>
        </div>
        {/* Banner de error */}
        {errorRegistros && (
          <div className="db-error">
            <span>✕</span> Verificá tu conexión a internet o reintenta.
            <button
              className="btn-retry"
              onClick={() => { refetchTotales(); refetchRegistros(); }}
            >
              Reintentar
            </button>
          </div>
        )}
        {/* Tabla */}
        <div className="db-table-wrap">
          {cargandoRegistros ? (
            <DataTable value={[1, 2, 3, 4, 5]} className="db-primetable">
              <Column header="Fecha" body={<Skeleton width="80%" />} />
              <Column header="Paciente" body={<Skeleton width="90%" />} />
              <Column header="DNI" body={<Skeleton width="70%" />} />
              <Column header="Motivo de consulta" body={<Skeleton width="95%" />} />
              <Column header="Diagnóstico" body={<Skeleton width="100%" />} />
              <Column header="Registrado" body={<Skeleton width="85%" />} />
              <Column header="Acciones" body={<Skeleton width="60px" shape="circle" />} />
            </DataTable>
          ) : paginatedData.data.length === 0 && !errorRegistros ? (
            <div className="db-empty">
              <div className="db-empty-icon">{busquedaDebounced ? '🔍' : '📋'}</div>
              <div className="db-empty-msg">
                {busquedaDebounced ? 'No se encontraron resultados para tu búsqueda' : 'No hay historias clínicas registradas aún'}
              </div>
            </div>
          ) : (
            <DataTable
              value={paginatedData.data}
              className="db-primetable"
              lazy
              paginator
              first={first}
              rows={rows}
              totalRecords={paginatedData.count}
              onPage={(e) => {
                setFirst(e.first);
                setRows(e.rows);
              }}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={(e) => {
                setSortField(e.sortField);
                setSortOrder(e.sortOrder);
                setFirst(0); // volver a página 1 al ordenar
              }}
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
