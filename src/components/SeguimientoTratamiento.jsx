import { useState, useEffect } from 'react';
import { SECTION_TITLE } from './theme';
import { format } from 'date-fns';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { addLocale } from 'primereact/api';
import './SeguimientoTratamiento.css';

addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});

const TRATAMIENTOS = [
    '',
    'Consulta',
    'Limpieza',
    'Extracción',
    'Endodoncia',
    'Operatoria simple',
    'Operatoria compleja',
    'Prótesis',
    'Ortodoncia',
    'Implante',
    'Otro',
];

const FILAS_INICIALES = 1;

function filaVacia() {
    return {
        fecha: '',
        tratamiento: '',
        diente: '',
        caras: '',
        observaciones: '',
        presupuesto: '',
        entrega: '',
    };
}

function calcularSaldo(presupuesto, entrega) {
    const p = parseFloat((presupuesto || '').replace(/\./g, '').replace(',', '.')) || 0;
    const e = parseFloat((entrega || '').replace(/\./g, '').replace(',', '.')) || 0;
    if (p === 0 && e === 0) return '';
    const s = p - e;
    return '$' + s.toLocaleString('es-AR', { minimumFractionDigits: 2 });
}

function getSaldoClass(saldo) {
    if (!saldo) return 'st-saldo st-saldo--vacio';
    if (saldo.startsWith('$0')) return 'st-saldo st-saldo--pagado';
    return 'st-saldo st-saldo--pendiente';
}

function SeguimientoTratamiento({ onChange, valores = {} }) {
    const [filas, setFilas] = useState(() => {
        if (valores.seguimiento && Array.isArray(valores.seguimiento) && valores.seguimiento.length > 0) {
            return [...valores.seguimiento];
        }
        return Array.from({ length: FILAS_INICIALES }, filaVacia);
    });

    useEffect(() => {
        onChange({ target: { name: 'seguimiento', value: filas } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filas]);

    const actualizarFila = (idx, campo, valor) => {
        setFilas(prev => {
            const copia = prev.map((f, i) => i === idx ? { ...f, [campo]: valor } : f);
            return copia;
        });
    };

    const agregarFila = () => setFilas(prev => [...prev, filaVacia()]);

    const eliminarFila = (idx) => {
        setFilas(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <>
            <div style={{ marginTop: '22px' }}>

                {/* Título */}
                <div style={{ ...SECTION_TITLE, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>📋 Seguimiento de Tratamientos</span>
                </div>

                {/* Tabla */}
                <div style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTop: 'none',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    overflowX: 'auto',
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        tableLayout: 'fixed',
                        minWidth: '820px',
                    }}>
                        <colgroup>
                            <col style={{ width: '13%' }} />  {/* Fecha */}
                            <col style={{ width: '16%' }} />  {/* Tratamiento */}
                            <col style={{ width: '7%' }} />   {/* Diente */}
                            <col style={{ width: '7%' }} />   {/* Caras */}
                            <col style={{ width: '19%' }} />  {/* Observaciones */}
                            <col style={{ width: '13%' }} />  {/* Presupuesto */}
                            <col style={{ width: '13%' }} />  {/* Entrega */}
                            <col style={{ width: '10%' }} />  {/* Saldo */}
                            <col style={{ width: '2%' }} />   {/* Eliminar */}
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="st-th">Fecha</th>
                                <th className="st-th">Tratamiento</th>
                                <th className="st-th st-th--center">Diente</th>
                                <th className="st-th st-th--center">Caras</th>
                                <th className="st-th">Observaciones</th>
                                <th className="st-th st-th--right">Presupuesto</th>
                                <th className="st-th st-th--right">Entrega</th>
                                <th className="st-th st-th--right st-th--no-border">Saldo</th>
                                <th className="st-th st-th--icon"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map((fila, idx) => {
                                const saldo = calcularSaldo(fila.presupuesto, fila.entrega);
                                const esPar = idx % 2 === 0;
                                return (
                                    <tr
                                        key={idx}
                                        style={{
                                            background: esPar ? 'rgba(255,255,255,0.01)' : 'rgba(0,170,228,0.025)',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,170,228,0.07)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = esPar ? 'rgba(255,255,255,0.01)' : 'rgba(0,170,228,0.025)')}
                                    >
                                        {/* Fecha */}
                                        <td className="st-td">
                                            <div className="fecha-wrapper">
                                                <span className="fecha-icon">📅</span>
                                                <Calendar
                                                    className="pr-calendar-table"
                                                    value={fila.fecha ? new Date(`${fila.fecha}T12:00:00`) : null}
                                                    onChange={e => actualizarFila(idx, 'fecha', e.value ? format(e.value, 'yyyy-MM-dd') : '')}
                                                    dateFormat="dd/mm/yy"
                                                    locale="es"
                                                    placeholder="dd/mm/aaaa"
                                                />
                                            </div>
                                        </td>

                                        {/* Tratamiento */}
                                        <td className="st-td">
                                            <Dropdown
                                                className="pr-dropdown-table"
                                                value={fila.tratamiento}
                                                options={TRATAMIENTOS}
                                                onChange={e => actualizarFila(idx, 'tratamiento', e.value)}
                                            />
                                        </td>

                                        {/* Diente */}
                                        <td className="st-td st-td--center">
                                            <InputText
                                                className="pr-input-table"
                                                style={{ textAlign: 'center' }}
                                                value={fila.diente}
                                                maxLength={6}
                                                placeholder="—"
                                                onChange={e => actualizarFila(idx, 'diente', e.target.value)}
                                            />
                                        </td>

                                        {/* Caras */}
                                        <td className="st-td st-td--center">
                                            <InputText
                                                className="pr-input-table"
                                                style={{ textAlign: 'center' }}
                                                value={fila.caras}
                                                maxLength={8}
                                                placeholder="—"
                                                onChange={e => actualizarFila(idx, 'caras', e.target.value)}
                                            />
                                        </td>

                                        {/* Observaciones */}
                                        <td className="st-td">
                                            <InputText
                                                className="pr-input-table"
                                                value={fila.observaciones}
                                                placeholder="..."
                                                onChange={e => actualizarFila(idx, 'observaciones', e.target.value)}
                                            />
                                        </td>

                                        {/* Presupuesto */}
                                        <td className="st-td st-td--right">
                                            <InputText
                                                className="pr-input-table"
                                                style={{ textAlign: 'right' }}
                                                value={fila.presupuesto}
                                                placeholder="$0"
                                                onChange={e => actualizarFila(idx, 'presupuesto', e.target.value)}
                                            />
                                        </td>

                                        {/* Entrega */}
                                        <td className="st-td st-td--right">
                                            <InputText
                                                className="pr-input-table"
                                                style={{ textAlign: 'right' }}
                                                value={fila.entrega}
                                                placeholder="$0"
                                                onChange={e => actualizarFila(idx, 'entrega', e.target.value)}
                                            />
                                        </td>

                                        {/* Saldo (calculado) */}
                                        <td className="st-td st-td--no-border">
                                            <span className={getSaldoClass(saldo)}>{saldo || '—'}</span>
                                        </td>

                                        {/* Botón Eliminar */}
                                        <td className="st-td st-td--acciones no-print">
                                            {filas.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarFila(idx)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: 'rgba(255, 99, 132, 0.7)',
                                                        fontSize: '14px',
                                                        padding: '2px',
                                                        transition: 'color 0.2s, transform 0.2s',
                                                    }}
                                                    title="Eliminar fila"
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.color = '#ff6384';
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.color = 'rgba(255, 99, 132, 0.7)';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Botón agregar fila */}
                    <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="no-print">
                        <button
                            type="button"
                            onClick={agregarFila}
                            style={{
                                background: 'rgba(0,170,228,0.12)',
                                border: '1px dashed rgba(0,170,228,0.4)',
                                borderRadius: '6px',
                                color: '#00aae4',
                                fontSize: '12px',
                                fontWeight: '600',
                                fontFamily: "'Inter', Arial, sans-serif",
                                padding: '5px 16px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,170,228,0.22)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,170,228,0.12)')}
                        >
                            + Agregar fila
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SeguimientoTratamiento;
