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
        <>
            <style>{`
                .pr-calendar {
                    width: 100%;
                }
                .p-datepicker-title .p-datepicker-month {
                    margin-right: 8px;
                }
                
                /* PrimeReact Overrides para Datos Personales */
                .pr-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(0,170,228,0.35);
                    border-radius: 0;
                    color: rgba(255,255,255,0.9);
                    padding: 4px 0;
                    font-size: 13px;
                    font-family: 'Inter', Arial, sans-serif;
                    box-shadow: none !important;
                }
                .pr-input:focus, .pr-dropdown.p-focus {
                    border-bottom-color: #00aae4;
                }
                .pr-input::placeholder {
                    color: rgba(255,255,255,0.3);
                }
                
                .pr-dropdown {
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(0,170,228,0.35);
                    border-radius: 0;
                    width: 100%;
                    box-shadow: none !important;
                }
                .pr-dropdown .p-dropdown-label {
                    padding: 4px 0;
                    color: rgba(255,255,255,0.9);
                    font-size: 13px;
                    font-family: 'Inter', Arial, sans-serif;
                }
                .pr-dropdown .p-dropdown-trigger {
                    width: 2rem;
                    color: rgba(255,255,255,0.5);
                }
                
                /* PrimeReact Dropdown Panel Styling */
                .p-dropdown-panel {
                    background: #0d2444;
                    border: 1px solid rgba(0,170,228,0.3);
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    font-family: 'Inter', Arial, sans-serif;
                    font-size: 13px;
                }
                .p-dropdown-panel .p-dropdown-items {
                    padding: 4px 0;
                    list-style-type: none;
                }
                .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
                    padding: 10px 16px;
                    color: rgba(255,255,255,0.85);
                    transition: background 0.2s;
                    cursor: pointer;
                }
                .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
                    background: rgba(0,170,228,0.3) !important;
                    color: #00aae4;
                    font-weight: 600;
                }
                .p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):hover {
                    background: rgba(0,170,228,0.15);
                }
            `}</style>
            
            {/* ── FILA 1: Fecha | Nombre y Apellido ── */}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
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
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
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
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
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
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
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
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px' }}>
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
        </>
    );
}

export default DatosPersonales;
