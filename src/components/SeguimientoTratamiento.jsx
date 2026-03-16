import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { addLocale } from 'primereact/api';
import '../styles/SeguimientoTratamiento.css';

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
        <div className="section-wrapper">
            {/* Título */}
            <div className="section-title">
                <span>📋 Seguimiento de Tratamientos</span>
            </div>

            {/* Tabla */}
            <div className="section-body st-table-container">
                <table className="st-table">
                    <colgroup>
                        <col style={{ width: '13%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '19%' }} />
                        <col style={{ width: '13%' }} />
                        <col style={{ width: '13%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '2%' }} />
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
                            const rowClass = `st-row ${idx % 2 === 0 ? 'st-row-even' : 'st-row-odd'}`;
                            return (
                                <tr key={idx} className={rowClass}>
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
                                                className="st-btn-del"
                                                title="Eliminar fila"
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
                <div className="st-footer-actions no-print">
                    <button
                        type="button"
                        onClick={agregarFila}
                        className="st-btn-add"
                    >
                        + Agregar fila
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SeguimientoTratamiento;
