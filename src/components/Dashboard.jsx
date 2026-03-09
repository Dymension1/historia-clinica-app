import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

function Dashboard({ usuario, onNueva, onEditar, onCerrarSesion }) {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [eliminando, setEliminando] = useState(null); // id del registro a confirmar eliminación

    const cargarRegistros = useCallback(async () => {
        setCargando(true);
        const { data, error } = await supabase
            .from('historias_clinicas')
            .select('id, created_at, fecha, nombre, dni, motivo_consulta, diagnostico')
            .order('created_at', { ascending: false });

        if (!error) setRegistros(data || []);
        setCargando(false);
    }, []);

    useEffect(() => {
        cargarRegistros();
    }, [cargarRegistros]);

    const eliminar = async (id) => {
        const { error } = await supabase.from('historias_clinicas').delete().eq('id', id);
        if (!error) {
            setRegistros((prev) => prev.filter((r) => r.id !== id));
        }
        setEliminando(null);
    };

    const registrosFiltrados = registros.filter((r) => {
        const q = busqueda.toLowerCase();
        return (
            (r.nombre || '').toLowerCase().includes(q) ||
            (r.dni || '').toLowerCase().includes(q) ||
            (r.motivo_consulta || '').toLowerCase().includes(q)
        );
    });

    const fmtFecha = (str) => {
        if (!str) return '—';
        const [y, m, d] = str.split('-');
        return `${d}/${m}/${y}`;
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .db-wrapper {
          min-height: 100vh;
          background: linear-gradient(160deg, #0d1b2e 0%, #0a2744 60%, #0d3866 100%);
          font-family: 'Inter', Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Topbar ── */
        .db-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }
        .db-topbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 18px;
          font-weight: 700;
        }
        .db-topbar-brand span { color: #00aae4; }
        .db-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .db-user-badge {
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

        /* ── Botones genéricos ── */
        .btn-primary {
          padding: 9px 20px;
          background: linear-gradient(135deg, #00aae4, #0056b3);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(0,170,228,0.4);
          white-space: nowrap;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .btn-ghost-red {
          padding: 6px 14px;
          background: transparent;
          border: 1px solid #cc2200;
          border-radius: 8px;
          color: #cc2200;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-ghost-red:hover { background: #cc2200; color: white; }

        /* ── Contenido principal ── */
        .db-content {
          flex: 1;
          padding: 32px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* ── KPI Cards ── */
        .db-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .db-kpi {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 20px 24px;
          color: white;
        }
        .db-kpi-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
        }
        .db-kpi-value {
          font-size: 32px;
          font-weight: 700;
          color: #00aae4;
          line-height: 1;
        }

        /* ── Barra de herramientas ── */
        .db-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .db-search {
          flex: 1;
          min-width: 200px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-family: 'Inter', Arial, sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .db-search::placeholder { color: rgba(255,255,255,0.3); }
        .db-search:focus {
          border-color: #00aae4;
          box-shadow: 0 0 0 3px rgba(0,170,228,0.15);
        }

        /* ── Tabla ── */
        .db-table-wrap {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          overflow: hidden;
        }
        .db-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .db-table th {
          background: rgba(0,170,228,0.12);
          color: rgba(255,255,255,0.6);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .db-table td {
          padding: 13px 16px;
          color: rgba(255,255,255,0.85);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          vertical-align: middle;
        }
        .db-table tr:last-child td { border-bottom: none; }
        .db-table tr:hover td { background: rgba(255,255,255,0.04); }

        .db-badge-nombre {
          font-weight: 600;
          color: white;
        }
        .db-badge-dni {
          display: inline-block;
          background: rgba(0,170,228,0.15);
          color: #00aae4;
          border-radius: 4px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .db-motivo {
          color: rgba(255,255,255,0.55);
          font-style: italic;
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-edit {
          padding: 5px 12px;
          background: rgba(0,170,228,0.15);
          border: 1px solid rgba(0,170,228,0.4);
          border-radius: 6px;
          color: #00aae4;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          margin-right: 6px;
        }
        .btn-edit:hover { background: #00aae4; color: white; }

        .btn-del {
          padding: 5px 12px;
          background: rgba(204,34,0,0.1);
          border: 1px solid rgba(204,34,0,0.35);
          border-radius: 6px;
          color: #ff6b55;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-del:hover { background: #cc2200; color: white; border-color: #cc2200; }

        /* ── Estado vacío / cargando ── */
        .db-empty {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.35);
        }
        .db-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .db-empty-msg { font-size: 14px; }

        /* ── Modal de confirmación ── */
        .db-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          animation: fadeOverlay 0.2s ease;
        }
        @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
        .db-modal {
          background: #0d2444;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 32px 36px;
          max-width: 380px;
          width: 90%;
          text-align: center;
          color: white;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
          animation: slideModal 0.25s ease;
        }
        @keyframes slideModal { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .db-modal-icon { font-size: 40px; margin-bottom: 12px; }
        .db-modal-title { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
        .db-modal-msg { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 24px; }
        .db-modal-actions { display: flex; gap: 12px; justify-content: center; }
        .btn-cancel {
          padding: 9px 22px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.14); }
        .btn-confirmar-del {
          padding: 9px 22px;
          background: linear-gradient(135deg, #cc2200, #990000);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', Arial, sans-serif;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(204,34,0,0.4);
          transition: opacity 0.2s;
        }
        .btn-confirmar-del:hover { opacity: 0.88; }
      `}</style>

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
                            <div className="db-kpi-value">{registros.length}</div>
                        </div>
                        <div className="db-kpi">
                            <div className="db-kpi-label">Este mes</div>
                            <div className="db-kpi-value">
                                {registros.filter(r => {
                                    const d = new Date(r.created_at);
                                    const now = new Date();
                                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                                }).length}
                            </div>
                        </div>
                        <div className="db-kpi">
                            <div className="db-kpi-label">Resultados filtrados</div>
                            <div className="db-kpi-value">{registrosFiltrados.length}</div>
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
                        <button className="btn-primary" onClick={cargarRegistros}>↺ Actualizar</button>
                    </div>

                    {/* Tabla */}
                    <div className="db-table-wrap">
                        {cargando ? (
                            <div className="db-empty">
                                <div className="db-empty-icon">⏳</div>
                                <div className="db-empty-msg">Cargando registros...</div>
                            </div>
                        ) : registrosFiltrados.length === 0 ? (
                            <div className="db-empty">
                                <div className="db-empty-icon">{busqueda ? '🔍' : '📋'}</div>
                                <div className="db-empty-msg">
                                    {busqueda ? 'No se encontraron resultados para tu búsqueda' : 'No hay historias clínicas registradas aún'}
                                </div>
                            </div>
                        ) : (
                            <table className="db-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Paciente</th>
                                        <th>DNI</th>
                                        <th>Motivo de consulta</th>
                                        <th>Diagnóstico</th>
                                        <th>Registrado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrosFiltrados.map((r) => (
                                        <tr key={r.id}>
                                            <td>{fmtFecha(r.fecha)}</td>
                                            <td><span className="db-badge-nombre">{r.nombre || '—'}</span></td>
                                            <td>
                                                {r.dni
                                                    ? <span className="db-badge-dni">{r.dni}</span>
                                                    : '—'}
                                            </td>
                                            <td><span className="db-motivo">{r.motivo_consulta || '—'}</span></td>
                                            <td><span className="db-motivo">{r.diagnostico || '—'}</span></td>
                                            <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                                                {new Date(r.created_at).toLocaleDateString('es-AR')}
                                            </td>
                                            <td>
                                                <button className="btn-edit" onClick={() => onEditar(r.id)}>✏️ Editar</button>
                                                <button className="btn-del" onClick={() => setEliminando(r.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;
