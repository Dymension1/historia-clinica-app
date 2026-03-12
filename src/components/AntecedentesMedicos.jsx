import { useState } from 'react';
import { SECTION_TITLE, SECTION_BODY } from './theme';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';

function AntecedentesMedicos({ onChange, valores = {} }) {
    const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)', fontSize: '13px' };
    const radioLabelStyle = { display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)', fontSize: '13px', marginLeft: '6px' };
    const rowStyle = { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', color: 'rgba(255,255,255,0.82)', fontSize: '13px' };

    const handleCheckChange = (e) => {
        onChange({ target: { name: e.target.name, type: 'checkbox', checked: e.checked } });
    };

    const handleRadioChange = (e) => {
        onChange({ target: { name: e.target.name, value: e.value } });
    };

    const checkboxPT = {
        box: (options) => {
            const isChecked = options?.props?.checked || options?.context?.checked || options?.state?.checked;
            return {
                style: {
                    background: isChecked ? '#00aae4' : 'rgba(255,255,255,0.06)',
                    borderColor: isChecked ? '#00aae4' : 'rgba(255,255,255,0.2)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s, border-color 0.2s'
                }
            };
        },
        icon: { style: { color: '#ffffff', fill: '#ffffff', stroke: '#ffffff', strokeWidth: 1.5, fontSize: '11px', width: '11px', height: '11px' } }
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
            <style>{`
                /* PrimeReact Overrides para Antecedentes Médicos */
                .pr-input {
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(0,170,228,0.35);
                    border-radius: 0;
                    color: rgba(255,255,255,0.9);
                    padding: 4px 0;
                    font-size: 13px;
                    font-family: 'Inter', Arial, sans-serif;
                    box-shadow: none !important;
                }
                .pr-input:focus {
                    border-bottom-color: #00aae4;
                }
                .pr-input::placeholder {
                    color: rgba(255,255,255,0.3);
                }
            `}</style>
            {/* Título */}
            <div style={SECTION_TITLE}>Antecedentes Médicos</div>

            {/* Cuerpo: dos columnas */}
            <div style={{ ...SECTION_BODY, display: 'flex' }}>

                {/* ── Columna izquierda: condiciones ── */}
                <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Cardiopatías', 'Hipertensión / Hipotensión', 'Diabetes', 'Asma', 'Anemia', 'Trastornos tiroideos', 'Epilepsia', 'Trastornos de coagulación', 'Embarazo'].map((cond) => (
                        <label key={cond} style={labelStyle}>
                            <Checkbox pt={checkboxPT} inputId={cond} name={`cond_${cond}`} onChange={handleCheckChange} checked={!!valores[`cond_${cond}`]} />
                            <span htmlFor={cond}>{cond}</span>
                        </label>
                    ))}
                    <label style={labelStyle}>
                        <Checkbox pt={checkboxPT} name="cond_autoinmunes" onChange={handleCheckChange} checked={!!valores.cond_autoinmunes} />
                        Enfermedades autoinmunes:
                        <InputText className="pr-input" name="autoinmunes_detalle" onChange={onChange} value={valores.autoinmunes_detalle || ''} style={{ flex: 1 }} />
                    </label>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                        <Checkbox pt={checkboxPT} name="cond_otras" onChange={handleCheckChange} checked={!!valores.cond_otras} />
                        Otras:
                        <InputText className="pr-input" name="otras_detalle" onChange={onChange} value={valores.otras_detalle || ''} style={{ flex: 1 }} />
                    </label>
                </div>

                {/* ── Columna derecha: preguntas Sí/No ── */}
                <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="fuma" onChange={handleCheckChange} checked={!!valores.fuma} />
                        <span>¿Fuma?</span>
                        <InputText className="pr-input" name="fuma_detalle" onChange={onChange} value={valores.fuma_detalle || ''} placeholder="Cantidad / tipo" style={{ flex: 1 }} />
                    </div>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="alcohol" onChange={handleCheckChange} checked={!!valores.alcohol} />
                        <span>¿Consume alcohol con frecuencia?</span>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="alcohol_rta" value="Si" onChange={handleRadioChange} checked={valores.alcohol_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="alcohol_rta" value="No" onChange={handleRadioChange} checked={valores.alcohol_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="hiloDental" onChange={handleCheckChange} checked={!!valores.hiloDental} />
                        <span>¿Usa hilo dental?</span>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="hilo_frec" value="1" onChange={handleRadioChange} checked={valores.hilo_frec === '1'} /> 
                            <span>1 vez/día</span>
                        </label>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="hilo_frec" value="3" onChange={handleRadioChange} checked={valores.hilo_frec === '3'} /> 
                            <span>3 veces/día</span>
                        </label>
                    </div>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="enjuague" onChange={handleCheckChange} checked={!!valores.enjuague} />
                        <span>¿Usa enjuague bucal?</span>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="enjuague_rta" value="Si" onChange={handleRadioChange} checked={valores.enjuague_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="enjuague_rta" value="No" onChange={handleRadioChange} checked={valores.enjuague_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="encias" onChange={handleCheckChange} checked={!!valores.encias} />
                        <span>¿Sangran sus encías?</span>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="encias_rta" value="Si" onChange={handleRadioChange} checked={valores.encias_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="encias_rta" value="No" onChange={handleRadioChange} checked={valores.encias_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="sensibilidad" onChange={handleCheckChange} checked={!!valores.sensibilidad} />
                        <span>¿Siente sensibilidad dental?</span>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="sensibilidad_rta" value="Si" onChange={handleRadioChange} checked={valores.sensibilidad_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="sensibilidad_rta" value="No" onChange={handleRadioChange} checked={valores.sensibilidad_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="bruxismo" onChange={handleCheckChange} checked={!!valores.bruxismo} />
                        <span>¿Bruxismo (aprieta o rechina)?</span>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="bruxismo_rta" value="Si" onChange={handleRadioChange} checked={valores.bruxismo_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label style={radioLabelStyle}>
                            <RadioButton pt={radioPT} name="bruxismo_rta" value="No" onChange={handleRadioChange} checked={valores.bruxismo_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div style={rowStyle}>
                        <Checkbox pt={checkboxPT} name="reacciones" onChange={handleCheckChange} checked={!!valores.reacciones} />
                        <span>¿Tuvo reacciones adversas?</span>
                        <InputText className="pr-input" name="reacciones_detalle" onChange={onChange} value={valores.reacciones_detalle || ''} placeholder="Especificar" style={{ flex: 1 }} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AntecedentesMedicos;
