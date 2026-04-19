import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { useFormContext, Controller } from 'react-hook-form';
import type { HistoriaClinicaForm } from '../types';

function AntecedentesMedicos() {
    const { control } = useFormContext<HistoriaClinicaForm>();

    const condiciones = ['Cardiopatías', 'Hipertensión / Hipotensión', 'Diabetes', 'Asma', 'Anemia', 'Trastornos tiroideos', 'Epilepsia', 'Trastornos de coagulación', 'Embarazo'];

    return (
        <div className="section-wrapper">
            <div className="section-title">Antecedentes Médicos</div>
            <div className="section-body section-body--flex">
                <div className="section-col section-col--padded">
                    {condiciones.map((cond) => (
                        <label key={cond} className="form-label-item">
                            <Controller name={`cond_${cond}` as keyof HistoriaClinicaForm} control={control} render={({ field }) => (
                                <Checkbox inputId={cond} checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                            )} />
                            <span>{cond}</span>
                        </label>
                    ))}
                    <label className="form-label-item">
                        <Controller name="cond_autoinmunes" control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        Enfermedades autoinmunes:
                        <Controller name="autoinmunes_detalle" control={control} render={({ field }) => (
                             <InputText className="pr-input" {...field} style={{ flex: 1 }} />
                        )} />
                    </label>
                    <label className="form-label-item" style={{ marginBottom: 0 }}>
                        <Controller name="cond_otras" control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        Otras:
                        <Controller name="otras_detalle" control={control} render={({ field }) => (
                             <InputText className="pr-input" {...field} style={{ flex: 1 }} />
                        )} />
                    </label>
                </div>

                <div className="section-col--padded2">
                    <div className="form-row-item">
                        <Controller name="fuma" control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Fuma?</span>
                        <Controller name="fuma_detalle" control={control} render={({ field }) => (
                             <InputText className="pr-input" {...field} placeholder="Cantidad / tipo" style={{ flex: 1 }} />
                        )} />
                    </div>

                    <div className="form-row-item">
                        <Controller name={'alcohol_rta' as keyof HistoriaClinicaForm} control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Consume alcohol con frecuencia?</span>
                        <Controller name="alcohol_rta" control={control} render={({ field }) => (
                            <>
                                <label className="form-radio-label">
                                    <RadioButton inputId="alcohol_si" {...field} value="Si" checked={field.value === 'Si'} /> 
                                    <span>Sí</span>
                                </label>
                                <label className="form-radio-label">
                                    <RadioButton inputId="alcohol_no" {...field} value="No" checked={field.value === 'No'} /> 
                                    <span>No</span>
                                </label>
                            </>
                        )} />
                    </div>

                    <div className="form-row-item">
                        <Controller name={'hilo_frec' as keyof HistoriaClinicaForm} control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Usa hilo dental?</span>
                        <Controller name="hilo_frec" control={control} render={({ field }) => (
                            <>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="1" checked={field.value === '1'} /> 
                                    <span>1 vez/día</span>
                                </label>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="3" checked={field.value === '3'} /> 
                                    <span>3 veces/día</span>
                                </label>
                            </>
                        )} />
                    </div>

                    <div className="form-row-item">
                        <Controller name={'enjuague_rta' as keyof HistoriaClinicaForm} control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Usa enjuague bucal?</span>
                        <Controller name="enjuague_rta" control={control} render={({ field }) => (
                            <>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="Si" checked={field.value === 'Si'} /> 
                                    <span>Sí</span>
                                </label>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="No" checked={field.value === 'No'} /> 
                                    <span>No</span>
                                </label>
                            </>
                        )} />
                    </div>

                    <div className="form-row-item">
                        <Controller name={'encias_rta' as keyof HistoriaClinicaForm} control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Sangran sus encías?</span>
                        <Controller name="encias_rta" control={control} render={({ field }) => (
                            <>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="Si" checked={field.value === 'Si'} /> 
                                    <span>Sí</span>
                                </label>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="No" checked={field.value === 'No'} /> 
                                    <span>No</span>
                                </label>
                            </>
                        )} />
                    </div>

                    <div className="form-row-item">
                        <Controller name={'sensibilidad_rta' as keyof HistoriaClinicaForm} control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Siente sensibilidad dental?</span>
                        <Controller name="sensibilidad_rta" control={control} render={({ field }) => (
                            <>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="Si" checked={field.value === 'Si'} /> 
                                    <span>Sí</span>
                                </label>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="No" checked={field.value === 'No'} /> 
                                    <span>No</span>
                                </label>
                            </>
                        )} />
                    </div>

                    <div className="form-row-item">
                        <Controller name={'bruxismo_rta' as keyof HistoriaClinicaForm} control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Bruxismo (aprieta o rechina)?</span>
                        <Controller name="bruxismo_rta" control={control} render={({ field }) => (
                            <>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="Si" checked={field.value === 'Si'} /> 
                                    <span>Sí</span>
                                </label>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="No" checked={field.value === 'No'} /> 
                                    <span>No</span>
                                </label>
                            </>
                        )} />
                    </div>

                    <div className="form-row-item">
                        <Controller name="reacciones" control={control} render={({ field }) => (
                            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                        )} />
                        <span>¿Tuvo reacciones adversas?</span>
                         <Controller name="reacciones_detalle" control={control} render={({ field }) => (
                            <InputText className="pr-input" {...field} placeholder="Especificar" style={{ flex: 1 }} />
                        )} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AntecedentesMedicos;
