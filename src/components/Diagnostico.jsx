import { SECTION_TITLE } from './theme';
import { InputTextarea } from 'primereact/inputtextarea';

function Diagnostico({ onChange, valores = {} }) {
    const textareaPT = {
        root: {
            style: {
                width: '100%',
                minHeight: '110px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: 'none',
                backgroundColor: 'rgba(255,255,255,0.04)',
                resize: 'vertical',
                padding: '12px 16px',
                fontFamily: "'Inter', Arial, sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.85)',
                outline: 'none',
                boxSizing: 'border-box',
                borderRadius: '0 0 6px 6px'
            }
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <style>{`
                /* PrimeReact Overrides para Diagnostico */
                .p-inputtextarea:focus {
                    border-bottom-color: #00aae4 !important;
                    box-shadow: none !important;
                }
            `}</style>
            {/* Título */}
            <div style={{ ...SECTION_TITLE }}>Diagnóstico</div>

            {/* Textarea */}
            <InputTextarea
                name="diagnostico"
                onChange={onChange}
                value={valores.diagnostico || ''}
                placeholder="Escribir diagnóstico aquí..."
                pt={textareaPT}
                autoResize
            />
        </div>
    );
}

export default Diagnostico;
