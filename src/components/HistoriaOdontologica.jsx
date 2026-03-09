import { SECTION_TITLE, SECTION_BODY } from './theme';

function HistoriaOdontologica({ onChange }) {
    const preguntas = [
        { name: 'cepilla', label: '¿Se cepilla los dientes diariamente?' },
        { name: 'hiloDental2', label: '¿Usa hilo dental?' },
        { name: 'enjuague2', label: '¿Usa enjuague bucal?' },
        { name: 'encias2', label: '¿Sangran sus encías?' },
        { name: 'tejidos', label: '¿Lesiones de tejidos blandos?' },
    ];

    return (
        <div style={{ marginTop: '20px' }}>

            {/* Título */}
            <div style={SECTION_TITLE}>Historia Odontológica</div>

            {/* Preguntas */}
            <div style={{ ...SECTION_BODY, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {preguntas.map(({ name, label }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ minWidth: '280px', color: 'rgba(255,255,255,0.82)' }}>{label}</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)' }}>
                            <input type="radio" name={name} value="Si" onChange={onChange} style={{ accentColor: '#00aae4' }} /> Sí
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)' }}>
                            <input type="radio" name={name} value="No" onChange={onChange} style={{ accentColor: '#00aae4' }} /> No
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoriaOdontologica;
