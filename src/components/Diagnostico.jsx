import { SECTION_TITLE } from './theme';

function Diagnostico({ onChange, valores = {} }) {
    return (
        <div style={{ marginTop: '20px' }}>

            {/* Título */}
            <div style={{ ...SECTION_TITLE, textAlign: 'center' }}>Diagnóstico</div>

            {/* Textarea */}
            <textarea
                name="diagnostico"
                onChange={onChange}
                defaultValue={valores.diagnostico || ''}
                placeholder="Escribir diagnóstico aquí..."
                style={{
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
                }}
            />
        </div>
    );
}

export default Diagnostico;
