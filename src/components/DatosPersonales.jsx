import { format } from 'date-fns';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});

function DatosPersonales({ onChange, valores = {} }) {
    const handleDateChange = (name, date) => {
        onChange({
            target: {
                name,
                value: date ? format(date, 'yyyy-MM-dd') : ''
            }
        });
    };

    const sexos = [
        { label: '--', value: '' },
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' },
        { label: 'Otro', value: 'Otro' }
    ];

    return (
        <div className="section-wrapper" style={{ marginTop: 0 }}>
            <div className="section-title">
                DATOS PERSONALES
            </div>
            {/* ── FILA 1: Fecha | Nombre y Apellido ── */}
            <table className="form-layout-table">
                <colgroup>
                    <col style={{ width: '200px' }} />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Fecha</span>
                            <Calendar
                                className="pr-calendar"
                                inputClassName="pr-input"
                                value={valores.fecha ? new Date(`${valores.fecha}T12:00:00`) : null}
                                onChange={e => handleDateChange('fecha', e.value)}
                                dateFormat="dd/mm/yy"
                                locale="es"
                                placeholder="dd/mm/aaaa"
                            />
                        </td>
                        <td className="celda">
                            <span className="lbl">Nombre y Apellido</span>
                            <InputText className="pr-input" name="nombre" onChange={onChange} value={valores.nombre || ''} placeholder="Apellido, Nombre" />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 2: Doc. Identificación | Sexo | Fecha de Nacimiento | Edad ── */}
            <table className="form-layout-table">
                <colgroup>
                    <col style={{ width: '40%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '10%' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Doc. de Identificación</span>
                            <InputText className="pr-input" name="dni" onChange={onChange} value={valores.dni || ''} placeholder="Nro. documento" />
                        </td>
                        <td className="celda">
                            <span className="lbl">Sexo</span>
                            <Dropdown className="pr-dropdown" name="sexo" value={valores.sexo || ''} options={sexos} onChange={onChange} placeholder="--" />
                        </td>
                        <td className="celda">
                            <span className="lbl">Fecha de Nacimiento</span>
                            <Calendar
                                className="pr-calendar"
                                inputClassName="pr-input"
                                value={valores.fechaNacimiento ? new Date(`${valores.fechaNacimiento}T12:00:00`) : null}
                                onChange={e => handleDateChange('fechaNacimiento', e.value)}
                                dateFormat="dd/mm/yy"
                                locale="es"
                                placeholder="dd/mm/aaaa"
                            />
                        </td>
                        <td className="celda">
                            <span className="lbl">Edad</span>
                            <InputText keyfilter="int" className="pr-input" name="edad" onChange={onChange} value={valores.edad || ''} placeholder="--" style={{ textAlign: 'center' }} />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 3: Teléfono | Dirección | Email ── */}
            <table className="form-layout-table">
                <colgroup>
                    <col style={{ width: '220px' }} />
                    <col />
                    <col style={{ width: '300px' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Teléfono</span>
                            <InputText className="pr-input" name="telefono" onChange={onChange} value={valores.telefono || ''} placeholder="011 1234-5678" />
                        </td>
                        <td className="celda">
                            <span className="lbl">Dirección</span>
                            <InputText className="pr-input" name="direccion" onChange={onChange} value={valores.direccion || ''} placeholder="Calle, número, ciudad" />
                        </td>
                        <td className="celda">
                            <span className="lbl">Email</span>
                            <InputText className="pr-input" name="email" onChange={onChange} value={valores.email || ''} placeholder="correo@ejemplo.com" />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 4: Obra Social | N° de Afiliado ── */}
            <table className="form-layout-table">
                <colgroup>
                    <col />
                    <col style={{ width: '300px' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Obra Social</span>
                            <InputText className="pr-input" name="obraSocial" onChange={onChange} value={valores.obraSocial || ''} placeholder="Nombre de la obra social" />
                        </td>
                        <td className="celda">
                            <span className="lbl">N° de Afiliado</span>
                            <InputText className="pr-input" name="afiliado" onChange={onChange} value={valores.afiliado || ''} placeholder="Nro. afiliado" />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 5: Motivo de Consulta ── */}
            <table className="form-layout-table form-layout-table--last">
                <colgroup>
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda" style={{ borderBottom: 'none' }}>
                            <span className="lbl">Motivo de Consulta</span>
                            <InputText className="pr-input" name="motivoConsulta" onChange={onChange} value={valores.motivoConsulta || ''} placeholder="Descripción del motivo de consulta" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DatosPersonales;
