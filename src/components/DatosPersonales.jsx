import { format, parseISO } from 'date-fns';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';


/**
 * Primer fragmento modular del Formulario Clínico.
 * Renderiza los campos primarios del paciente (Nombre, DNI, Contacto) apoyándose 
 * en el contexto global de React Hook Form (`useFormContext`) para inyectar validaciones en vivo.
 *
 * @returns {JSX.Element} Bloque de inputs PrimeReact (Datos personales).
 */
function DatosPersonales() {
    const { control, setValue } = useFormContext();

    /**
     * Calcula la edad en años a partir de una fecha de nacimiento y
     * la escribe automáticamente en el campo `edad` del formulario.
     * Si la fecha se borra, limpia el campo edad.
     *
     * @param {Date|null} fecha - Objeto Date proveniente del Calendar de PrimeReact.
     * @param {Function} rhfOnChange - El `onChange` del Controller de RHF para `fechaNacimiento`.
     */
    const handleFechaNacimientoChange = useCallback((fecha, rhfOnChange) => {
        const isoValue = fecha ? format(fecha, 'yyyy-MM-dd') : '';
        rhfOnChange(isoValue);

        if (fecha) {
            const hoy = new Date();
            let edad = hoy.getFullYear() - fecha.getFullYear();
            const mDiff = hoy.getMonth() - fecha.getMonth();
            if (mDiff < 0 || (mDiff === 0 && hoy.getDate() < fecha.getDate())) {
                edad--;
            }
            // Solo se escribe si es un valor razonable (entre 0 y 130)
            if (edad >= 0 && edad <= 130) {
                setValue('edad', String(edad), { shouldDirty: true });
            }
        } else {
            setValue('edad', '', { shouldDirty: true });
        }
    }, [setValue]);

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
            <div className="form-grid grid-row-2">
                <div className="celda">
                    <span className="lbl">Fecha</span>
                    <Controller name="fecha" control={control} render={({ field }) => (
                        <Calendar
                            className="pr-calendar"
                            inputClassName="pr-input"
                            value={field.value ? parseISO(field.value) : null}
                            onChange={(e) => field.onChange(e.value ? format(e.value, 'yyyy-MM-dd') : '')}
                            dateFormat="dd/mm/yy"
                            locale="es"
                            placeholder="dd/mm/aaaa"
                        />
                    )} />
                </div>
                <div className="celda">
                    <span className="lbl">Nombre y Apellido</span>
                    <Controller name="nombre" control={control} render={({ field, fieldState }) => (
                        <>
                            <InputText className={`pr-input ${fieldState.error ? 'p-invalid' : ''}`} {...field} placeholder="Apellido, Nombre" />
                            {fieldState.error && <small className="p-error" style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldState.error.message}</small>}
                        </>
                    )} />
                </div>
            </div>

            {/* ── FILA 2: Doc. Identificación | Sexo | Fecha de Nacimiento | Edad ── */}
            <div className="form-grid grid-row-4-mixed">
                <div className="celda">
                    <span className="lbl">Doc. de Identificación</span>
                    <Controller name="dni" control={control} render={({ field }) => (
                        <InputText className="pr-input" {...field} placeholder="Nro. documento" />
                    )} />
                </div>
                <div className="celda">
                    <span className="lbl">Sexo</span>
                    <Controller name="sexo" control={control} render={({ field }) => (
                         <Dropdown className="pr-dropdown" {...field} options={sexos} placeholder="--" />
                    )} />
                </div>
                <div className="celda">
                    <span className="lbl">Fecha de Nacimiento</span>
                    <Controller name="fechaNacimiento" control={control} render={({ field }) => (
                        <Calendar
                            className="pr-calendar"
                            inputClassName="pr-input"
                            value={field.value ? parseISO(field.value) : null}
                            onChange={(e) => handleFechaNacimientoChange(e.value ?? null, field.onChange)}
                            dateFormat="dd/mm/yy"
                            locale="es"
                            placeholder="dd/mm/aaaa"
                        />
                    )} />
                </div>
                <div className="celda">
                    <span className="lbl">Edad</span>
                    <Controller name="edad" control={control} render={({ field }) => (
                        <InputText keyfilter="int" className="pr-input" {...field} placeholder="--" style={{ textAlign: 'center' }} />
                    )} />
                </div>
            </div>

            {/* ── FILA 3: Teléfono | Dirección | Email ── */}
            <div className="form-grid grid-row-3-mixed">
                <div className="celda">
                    <span className="lbl">Teléfono</span>
                    <Controller name="telefono" control={control} render={({ field }) => (
                        <InputText className="pr-input" {...field} placeholder="011 1234-5678" />
                    )} />
                </div>
                <div className="celda">
                    <span className="lbl">Dirección</span>
                    <Controller name="direccion" control={control} render={({ field }) => (
                        <InputText className="pr-input" {...field} placeholder="Calle, número, ciudad" />
                    )} />
                </div>
                <div className="celda">
                    <span className="lbl">Email</span>
                    <Controller name="email" control={control} render={({ field, fieldState }) => (
                        <>
                            <InputText className={`pr-input ${fieldState.error ? 'p-invalid' : ''}`} {...field} placeholder="correo@ejemplo.com" />
                            {fieldState.error && <small className="p-error" style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldState.error.message}</small>}
                        </>
                    )} />
                </div>
            </div>

            {/* ── FILA 4: Obra Social | N° de Afiliado ── */}
            <div className="form-grid grid-row-2-mixed">
                <div className="celda">
                    <span className="lbl">Obra Social</span>
                    <Controller name="obraSocial" control={control} render={({ field }) => (
                         <InputText className="pr-input" {...field} placeholder="Nombre de la obra social" />
                    )} />
                </div>
                <div className="celda">
                    <span className="lbl">N° de Afiliado</span>
                    <Controller name="afiliado" control={control} render={({ field }) => (
                        <InputText className="pr-input" {...field} placeholder="Nro. afiliado" />
                    )} />
                </div>
            </div>

            {/* ── FILA 5: Motivo de Consulta ── */}
            <div className="form-grid grid-row-1" style={{ borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
                <div className="celda" style={{ borderBottom: 'none' }}>
                    <span className="lbl">Motivo de Consulta</span>
                    <Controller name="motivoConsulta" control={control} render={({ field }) => (
                        <InputText className="pr-input" {...field} placeholder="Descripción del motivo de consulta" />
                    )} />
                </div>
            </div>
        </div>
    );
}

export default DatosPersonales;
