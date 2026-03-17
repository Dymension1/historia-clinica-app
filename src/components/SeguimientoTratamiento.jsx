import { useState } from 'react';
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

const TRATAMIENTOS = ['', 'Consulta', 'Limpieza', 'Extracción', 'Endodoncia', 'Operatoria simple', 'Operatoria compleja', 'Prótesis', 'Ortodoncia', 'Implante', 'Otro'];

const filaVacia = () => ({
    fecha: '', tratamiento: '', diente: '', caras: '', observaciones: '', presupuesto: '', entrega: '',
});

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
    // Estado local para los inputs inmediatos
    const [filas, setFilas] = useState(() => {
        if (valores.seguimiento && Array.isArray(valores.seguimiento) && valores.seguimiento.length > 0) {
            return [...valores.seguimiento];
        }
        return [filaVacia()];
    });

    // Sincronizar con el padre SOLO cuando las filas locales cambian realmente
    // Usamos una función interna para actualizar ambos estados a la vez
    const propagarCambios = (nuevasFilas) => {
        setFilas(nuevasFilas);
        onChange({ target: { name: 'seguimiento', value: nuevasFilas } });
    };

    const actualizarFila = (idx, campo, valor) => {
        const nuevasFilas = filas.map((f, i) => i === idx ? { ...f, [campo]: valor } : f);
        propagarCambios(nuevasFilas);
    };

    const agregarFila = () => {
        const nuevasFilas = [...filas, filaVacia()];
        propagarCambios(nuevasFilas);
    };

    const eliminarFila = (idx) => {
        const nuevasFilas = filas.filter((_, i) => i !== idx);
        propagarCambios(nuevasFilas);
    };

    return (
        <div className="section-wrapper">
            <div className="section-title"><span>Seguimiento de Tratamientos</span></div>
            <div className="section-body st-table-container">
                <table className="st-table">
                    <colgroup>
                        <col style={{ width: '135px' }} />
                        <col style={{ width: '160px' }} />
                        <col style={{ width: '75px' }} />
                        <col style={{ width: '85px' }} />
                        <col />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '35px' }} />
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
                            return (
                                <tr key={idx} className={`st-row ${idx % 2 === 0 ? 'st-row-even' : 'st-row-odd'}`}>
                                    <td className="st-td">
                                        <div className="fecha-wrapper">
                                            <span className="fecha-icon">📅</span>
                                            <Calendar
                                                className="pr-calendar-table"
                                                value={fila.fecha ? new Date(`${fila.fecha}T12:00:00`) : null}
                                                onChange={e => actualizarFila(idx, 'fecha', e.value ? format(e.value, 'yyyy-MM-dd') : '')}
                                                dateFormat="dd/mm/yy" locale="es" placeholder="dd/mm/aaaa"
                                            />
                                        </div>
                                    </td>
                                    <td className="st-td">
                                        <Dropdown className="pr-dropdown-table" value={fila.tratamiento} options={TRATAMIENTOS} onChange={e => actualizarFila(idx, 'tratamiento', e.value)} />
                                    </td>
                                    <td className="st-td st-td--center">
                                        <InputText className="pr-input-table" style={{ textAlign: 'center' }} value={fila.diente} maxLength={6} placeholder="—" onChange={e => actualizarFila(idx, 'diente', e.target.value)} />
                                    </td>
                                    <td className="st-td st-td--center">
                                        <InputText className="pr-input-table" style={{ textAlign: 'center' }} value={fila.caras} maxLength={8} placeholder="—" onChange={e => actualizarFila(idx, 'caras', e.target.value)} />
                                    </td>
                                    <td className="st-td">
                                        <InputText className="pr-input-table" value={fila.observaciones} placeholder="..." onChange={e => actualizarFila(idx, 'observaciones', e.target.value)} />
                                    </td>
                                    <td className="st-td st-td--right">
                                        <InputText className="pr-input-table" style={{ textAlign: 'right' }} value={fila.presupuesto} placeholder="$0" onChange={e => actualizarFila(idx, 'presupuesto', e.target.value)} />
                                    </td>
                                    <td className="st-td st-td--right">
                                        <InputText className="pr-input-table" style={{ textAlign: 'right' }} value={fila.entrega} placeholder="$0" onChange={e => actualizarFila(idx, 'entrega', e.target.value)} />
                                    </td>
                                    <td className="st-td st-td--no-border"><span className={getSaldoClass(saldo)}>{saldo || '—'}</span></td>
                                    <td className="st-td st-td--acciones no-print">
                                        {filas.length > 1 && <button type="button" onClick={() => eliminarFila(idx)} className="st-btn-del" title="Eliminar fila">✕</button>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="st-footer-actions no-print">
                    <button type="button" onClick={agregarFila} className="st-btn-add">+ Agregar fila</button>
                </div>
            </div>
        </div>
    );
}

export default SeguimientoTratamiento;
