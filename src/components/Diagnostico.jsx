function Diagnostico({ onChange }) {
    return (
        <div style={{ marginTop: '18px' }}>

            {/* Título */}
            <div style={{
                backgroundColor: '#003d6b',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                letterSpacing: '1px',
                padding: '5px 10px',
                textTransform: 'uppercase',
                textAlign: 'center',
            }}>
                Diagnóstico
            </div>

            {/* Área de escritura libre */}
            <textarea
                name="diagnostico"
                onChange={onChange}
                placeholder="Escribir diagnóstico aquí..."
                style={{
                    width: '100%',
                    minHeight: '100px',
                    border: '1px solid #b3d9ff',
                    borderTop: 'none',
                    backgroundColor: '#fff',
                    resize: 'vertical',
                    padding: '10px 14px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    color: '#000',
                    outline: 'none',
                    boxSizing: 'border-box',
                }}
            />
        </div>
    );
}

export default Diagnostico;
