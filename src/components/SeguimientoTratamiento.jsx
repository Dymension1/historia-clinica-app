import { format, parseISO } from 'date-fns';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';
import '../styles/SeguimientoTratamiento.css';

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

/**
 * Sub-componente aislado para cada fila del seguimiento.
 * Usa `useWatch` exclusivamente sobre los campos `presupuesto` y `entrega` de su índice,
 * evitando que el cálculo de saldo provoque re-renders de toda la tabla
 * al cambiar cualquier otro campo del array.
 */
function FilaSeguimiento({ control, idx, fieldId, canRemove, onRemove }) {
    const presupuesto = useWatch({ control, name: `seguimiento.${idx}.presupuesto` });
    const entrega     = useWatch({ control, name: `seguimiento.${idx}.entrega` });
    const saldo       = calcularSaldo(presupuesto, entrega);

    return (
        <tr key={fieldId} className={`st-row ${idx % 2 === 0 ? 'st-row-even' : 'st-row-odd'}`}>
            <td className="st-td">
                <div className="fecha-wrapper">
                    <span className="fecha-icon">📅</span>
                    <Controller name={`seguimiento.${idx}.fecha`} control={control} render={({ field: colField }) => (
                        <Calendar
                            className="pr-calendar-table"
                            value={colField.value ? parseISO(colField.value) : null}
                            onChange={e => colField.onChange(e.value ? format(e.value, 'yyyy-MM-dd') : '')}
                            dateFormat="dd/mm/yy" locale="es" placeholder="dd/mm/aaaa"
                        />
                    )} />
                </div>
            </td>
            <td className="st-td">
                <Controller name={`seguimiento.${idx}.tratamiento`} control={control} render={({ field: colField }) => (
                    <Dropdown className="pr-dropdown-table" {...colField} options={TRATAMIENTOS} />
                )} />
            </td>
            <td className="st-td st-td--center">
                <Controller name={`seguimiento.${idx}.diente`} control={control} render={({ field: colField }) => (
                    <InputText className="pr-input-table st-input--center" {...colField} maxLength={6} placeholder="—" />
                )} />
            </td>
            <td className="st-td st-td--center">
                <Controller name={`seguimiento.${idx}.caras`} control={control} render={({ field: colField }) => (
                    <InputText className="pr-input-table st-input--center" {...colField} maxLength={8} placeholder="—" />
                )} />
            </td>
            <td className="st-td">
                <Controller name={`seguimiento.${idx}.observaciones`} control={control} render={({ field: colField }) => (
                    <InputText className="pr-input-table" {...colField} placeholder="..." />
                )} />
            </td>
            <td className="st-td st-td--right">
                <Controller name={`seguimiento.${idx}.presupuesto`} control={control} render={({ field: colField }) => (
                    <InputText className="pr-input-table st-input--right" {...colField} placeholder="$0" />
                )} />
            </td>
            <td className="st-td st-td--right">
                <Controller name={`seguimiento.${idx}.entrega`} control={control} render={({ field: colField }) => (
                    <InputText className="pr-input-table st-input--right" {...colField} placeholder="$0" />
                )} />
            </td>
            <td className="st-td st-td--no-border"><span className={getSaldoClass(saldo)}>{saldo || '—'}</span></td>
            <td className="st-td st-td--acciones no-print">
                {canRemove && <button type="button" onClick={onRemove} className="st-btn-del" title="Eliminar fila">✕</button>}
            </td>
        </tr>
    );
}

function SeguimientoTratamiento() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'seguimiento'
    });

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
                        {fields.map((field, idx) => (
                            <FilaSeguimiento
                                key={field.id}
                                control={control}
                                idx={idx}
                                fieldId={field.id}
                                canRemove={fields.length > 1}
                                onRemove={() => remove(idx)}
                            />
                        ))}
                    </tbody>
                </table>
                <div className="st-footer-actions no-print">
                    <button type="button" onClick={() => append(filaVacia())} className="st-btn-add">+ Agregar fila</button>
                </div>
            </div>
        </div>
    );
}

export default SeguimientoTratamiento;
