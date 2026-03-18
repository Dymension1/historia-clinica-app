import { RadioButton } from 'primereact/radiobutton';
import { useFormContext, Controller } from 'react-hook-form';

function HistoriaOdontologica() {
    const { control } = useFormContext();

    const preguntas = [
        { name: 'cepilla', label: '¿Se cepilla los dientes diariamente?' },
        { name: 'hiloDental2', label: '¿Usa hilo dental?' },
        { name: 'enjuague2', label: '¿Usa enjuague bucal?' },
        { name: 'encias2', label: '¿Sangran sus encías?' },
        { name: 'tejidos', label: '¿Lesiones de tejidos blandos?' },
    ];

    return (
        <div className="section-wrapper">
            <div className="section-title">Historia Odontológica</div>
            <div className="section-body" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {preguntas.map(({ name, label }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ minWidth: '280px', color: 'rgba(255,255,255,0.82)', fontSize: '13px' }}>{label}</span>
                        <Controller name={name} control={control} render={({ field }) => (
                            <>
                                <label className="form-radio-label">
                                    <RadioButton {...field} value="Si" checked={field.value === 'Si'} /> 
                                    <span>Sí</span>
                                </label>
                                <label className="form-radio-label" style={{ marginLeft: '10px' }}>
                                    <RadioButton {...field} value="No" checked={field.value === 'No'} /> 
                                    <span>No</span>
                                </label>
                            </>
                        )} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoriaOdontologica;
