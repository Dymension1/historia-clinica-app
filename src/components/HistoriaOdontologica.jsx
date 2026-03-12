import { RadioButton } from 'primereact/radiobutton';
import { SECTION_TITLE, SECTION_BODY } from './theme';

function HistoriaOdontologica({ onChange, valores = {} }) {
    const preguntas = [
        { name: 'cepilla', label: '¿Se cepilla los dientes diariamente?' },
        { name: 'hiloDental2', label: '¿Usa hilo dental?' },
        { name: 'enjuague2', label: '¿Usa enjuague bucal?' },
        { name: 'encias2', label: '¿Sangran sus encías?' },
        { name: 'tejidos', label: '¿Lesiones de tejidos blandos?' },
    ];

    const handleRadioChange = (e) => {
        onChange({ target: { name: e.target.name, value: e.value } });
    };

    const radioPT = {
        box: (options) => {
            const isChecked = options?.props?.checked || options?.context?.checked || options?.state?.checked;
            return {
                style: {
                    background: 'rgba(255,255,255,0.06)',
                    borderColor: isChecked ? '#00aae4' : 'rgba(255,255,255,0.2)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s, border-color 0.2s'
                }
            };
        },
        icon: { style: { background: '#00aae4', width: '10px', height: '10px', borderRadius: '50%' } }
    };

    return (
        <div style={{ marginTop: '20px' }}>

            {/* Título */}
            <div style={SECTION_TITLE}>Historia Odontológica</div>

            {/* Preguntas */}
            <div style={{ ...SECTION_BODY, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {preguntas.map(({ name, label }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ minWidth: '280px', color: 'rgba(255,255,255,0.82)', fontSize: '13px' }}>{label}</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)', fontSize: '13px' }}>
                            <RadioButton pt={radioPT} name={name} value="Si" onChange={handleRadioChange} checked={valores[name] === 'Si'} /> <span style={{ marginTop: '-5px' }}>Sí</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)', fontSize: '13px', marginLeft: '10px' }}>
                            <RadioButton pt={radioPT} name={name} value="No" onChange={handleRadioChange} checked={valores[name] === 'No'} /> <span style={{ marginTop: '-5px' }}>No</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoriaOdontologica;
