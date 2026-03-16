import { InputTextarea } from 'primereact/inputtextarea';

function Diagnostico({ onChange, valores = {} }) {
    return (
        <div className="section-wrapper">
            {/* Título */}
            <div className="section-title">Diagnóstico</div>

            {/* Textarea */}
            <InputTextarea
                name="diagnostico"
                className="diagnostico-textarea"
                onChange={onChange}
                value={valores.diagnostico || ''}
                placeholder="Escribir diagnóstico aquí..."
                autoResize
            />
        </div>
    );
}

export default Diagnostico;
