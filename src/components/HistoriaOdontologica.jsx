function HistoriaOdontologica({ onChange }) {
    const preguntas = [
        { name: 'cepilla', label: '¿Se cepilla los dientes diariamente?' },
        { name: 'hiloDental2', label: '¿Usa hilo dental?' },
        { name: 'enjuague2', label: '¿Usa enjuague bucal?' },
        { name: 'encias2', label: '¿Sangran sus encías?' },
        { name: 'tejidos', label: '¿Lesiones de tejidos blandos?' },
    ];

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
            }}>
                Historia Odontológica
            </div>

            {/* Preguntas */}
            <div style={{
                border: '1px solid #b3d9ff',
                backgroundColor: '#f0f7ff',
                padding: '10px 14px',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}>
                {preguntas.map(({ name, label }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ minWidth: '280px' }}>{label}</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input type="radio" name={name} value="Si" onChange={onChange} /> Sí
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input type="radio" name={name} value="No" onChange={onChange} /> No
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoriaOdontologica;
