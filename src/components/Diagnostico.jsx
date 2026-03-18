import { InputTextarea } from 'primereact/inputtextarea';
import { useFormContext, Controller } from 'react-hook-form';

function Diagnostico() {
    const { control } = useFormContext();

    return (
        <div className="section-wrapper">
            <div className="section-title">Diagnóstico</div>
            <Controller name="diagnostico" control={control} render={({ field }) => (
                <InputTextarea
                    {...field}
                    className="diagnostico-textarea"
                    placeholder="Escribir diagnóstico aquí..."
                    autoResize
                />
            )} />
        </div>
    );
}

export default Diagnostico;
