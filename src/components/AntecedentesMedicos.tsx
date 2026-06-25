import { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import type { HistoriaClinicaForm } from '../types';

type FieldName = keyof HistoriaClinicaForm;

// ── Preguntas con radio buttons (Sí/No o custom) ──
interface PreguntaRadio {
    type: 'radio';
    name: FieldName;
    label: string;
    options: { value: string; label: string }[];
}

// ── Preguntas con campo de texto ──
interface PreguntaTexto {
    type: 'texto';
    name: FieldName;
    label: string;
    detalleName: FieldName;
    placeholder: string;
}

type Pregunta = PreguntaRadio | PreguntaTexto;

const SI_NO = [{ value: 'Si', label: 'Sí' }, { value: 'No', label: 'No' }];

const preguntasCol2: Pregunta[] = [
    { type: 'texto', name: 'fuma', label: '¿Fuma?', detalleName: 'fuma_detalle', placeholder: 'Cantidad / tipo' },
    { type: 'radio', name: 'alcohol_rta', label: '¿Consume alcohol con frecuencia?', options: SI_NO },
    { type: 'radio', name: 'hilo_frec', label: '¿Usa hilo dental?', options: [{ value: '1', label: '1 vez/día' }, { value: '3', label: '3 veces/día' }] },
    { type: 'radio', name: 'enjuague_rta', label: '¿Usa enjuague bucal?', options: SI_NO },
    { type: 'radio', name: 'encias_rta', label: '¿Sangran sus encías?', options: SI_NO },
    { type: 'radio', name: 'sensibilidad_rta', label: '¿Siente sensibilidad dental?', options: SI_NO },
    { type: 'radio', name: 'bruxismo_rta', label: '¿Bruxismo (aprieta o rechina)?', options: SI_NO },
    { type: 'texto', name: 'reacciones', label: '¿Tuvo reacciones adversas?', detalleName: 'reacciones_detalle', placeholder: 'Especificar' },
    { type: 'radio', name: 'cepilla', label: '¿Se cepilla los dientes diariamente?', options: SI_NO },
    { type: 'radio', name: 'encias2', label: '¿Sangran sus encías?', options: SI_NO },
    { type: 'radio', name: 'tejidos', label: '¿Lesiones de tejidos blandos?', options: SI_NO },
];

const condiciones = [
    'Cardiopatías', 'Hipertensión / Hipotensión', 'Diabetes', 'Asma', 'Anemia',
    'Trastornos tiroideos', 'Epilepsia', 'Trastornos de coagulación', 'Embarazo',
];

// ── Componente reutilizable para fila con radio buttons ──
function FilaRadio({ name, label, options, control }: PreguntaRadio & { control: ReturnType<typeof useFormContext<HistoriaClinicaForm>>['control'] }) {
    return (
        <div className="form-row-item">
            <Controller name={name} control={control} render={({ field }) => (
                <Checkbox checked={!!field.value} onChange={(e) => { if (!e.checked) field.onChange(''); }} />
            )} />
            <span>{label}</span>
            <Controller name={name} control={control} render={({ field }) => (
                <>
                    {options.map((opt) => (
                        <label key={opt.value} className="form-radio-label">
                            <RadioButton {...field} value={opt.value} checked={field.value === opt.value} />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </>
            )} />
        </div>
    );
}

// ── Componente reutilizable para fila con campo de texto ──
function FilaTexto({ name, label, detalleName, placeholder, control }: PreguntaTexto & { control: ReturnType<typeof useFormContext<HistoriaClinicaForm>>['control'] }) {
    return (
        <div className="form-row-item">
            <Controller name={name} control={control} render={({ field }) => (
                <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
            )} />
            <span>{label}</span>
            <Controller name={detalleName} control={control} render={({ field }) => (
                <InputText className="pr-input" {...field} value={String(field.value ?? '')} placeholder={placeholder} style={{ flex: 1 }} />
            )} />
        </div>
    );
}

function AntecedentesMedicos() {
    const { control, setValue } = useFormContext<HistoriaClinicaForm>();
    const cepillaValue = useWatch({ control, name: 'cepilla' });

    useEffect(() => {
        if (cepillaValue !== 'Si') {
            setValue('cepilla_veces', '');
        }
    }, [cepillaValue, setValue]);

    return (
        <div className="section-wrapper">
            <div className="section-title">Antecedentes Médicos</div>
            <div className="section-body section-body--flex">
                <div className="section-col section-col--padded">
                    {condiciones.map((cond) => (
                        <label key={cond} className="form-label-item">
                            <Controller name={`cond_${cond}` as FieldName} control={control} render={({ field }) => (
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
                    {preguntasCol2.map((p) => {
                        if (p.name === 'cepilla') {
                            // Caso especial: cepilla tiene un sub-campo condicional
                            return (
                                <div key={p.name}>
                                    <FilaRadio {...p as PreguntaRadio} control={control} />
                                    {cepillaValue === 'Si' && (
                                        <div className="form-row-item" style={{ marginTop: 8, paddingLeft: 26 }}>
                                            <span>¿Cuántas veces al día?</span>
                                            <Controller name="cepilla_veces" control={control} render={({ field }) => (
                                                <InputText className="pr-input" {...field} placeholder="Ej: 2" style={{ width: 80 }} />
                                            )} />
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        if (p.type === 'texto') {
                            return <FilaTexto key={p.name} {...p} control={control} />;
                        }
                        return <FilaRadio key={p.name} {...p} control={control} />;
                    })}
                </div>
            </div>
        </div>
    );
}

export default AntecedentesMedicos;
