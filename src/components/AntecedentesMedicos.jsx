import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';

function AntecedentesMedicos({ onChange, valores = {} }) {
    const handleCheckChange = (e) => {
        onChange({ target: { name: e.target.name, type: 'checkbox', checked: e.checked } });
    };

    const handleRadioChange = (e) => {
        onChange({ target: { name: e.target.name, value: e.value } });
    };

    return (
        <div className="section-wrapper">
            {/* Título */}
            <div className="section-title">Antecedentes Médicos</div>

            {/* Cuerpo: dos columnas */}
            <div className="section-body" style={{ display: 'flex' }}>

                {/* ── Columna izquierda: condiciones ── */}
                <div className="section-col" style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Cardiopatías', 'Hipertensión / Hipotensión', 'Diabetes', 'Asma', 'Anemia', 'Trastornos tiroideos', 'Epilepsia', 'Trastornos de coagulación', 'Embarazo'].map((cond) => (
                        <label key={cond} className="form-label-item">
                            <Checkbox inputId={cond} name={`cond_${cond}`} onChange={handleCheckChange} checked={!!valores[`cond_${cond}`]} />
                            <span>{cond}</span>
                        </label>
                    ))}
                    <label className="form-label-item">
                        <Checkbox name="cond_autoinmunes" onChange={handleCheckChange} checked={!!valores.cond_autoinmunes} />
                        Enfermedades autoinmunes:
                        <InputText className="pr-input" name="autoinmunes_detalle" onChange={onChange} value={valores.autoinmunes_detalle || ''} style={{ flex: 1 }} />
                    </label>
                    <label className="form-label-item" style={{ marginBottom: 0 }}>
                        <Checkbox name="cond_otras" onChange={handleCheckChange} checked={!!valores.cond_otras} />
                        Otras:
                        <InputText className="pr-input" name="otras_detalle" onChange={onChange} value={valores.otras_detalle || ''} style={{ flex: 1 }} />
                    </label>
                </div>

                {/* ── Columna derecha: preguntas Sí/No ── */}
                <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    <div className="form-row-item">
                        <Checkbox name="fuma" onChange={handleCheckChange} checked={!!valores.fuma} />
                        <span>¿Fuma?</span>
                        <InputText className="pr-input" name="fuma_detalle" onChange={onChange} value={valores.fuma_detalle || ''} placeholder="Cantidad / tipo" style={{ flex: 1 }} />
                    </div>

                    <div className="form-row-item">
                        <Checkbox name="alcohol" onChange={handleCheckChange} checked={!!valores.alcohol} />
                        <span>¿Consume alcohol con frecuencia?</span>
                        <label className="form-radio-label">
                            <RadioButton name="alcohol_rta" value="Si" onChange={handleRadioChange} checked={valores.alcohol_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label className="form-radio-label">
                            <RadioButton name="alcohol_rta" value="No" onChange={handleRadioChange} checked={valores.alcohol_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div className="form-row-item">
                        <Checkbox name="hiloDental" onChange={handleCheckChange} checked={!!valores.hiloDental} />
                        <span>¿Usa hilo dental?</span>
                        <label className="form-radio-label">
                            <RadioButton name="hilo_frec" value="1" onChange={handleRadioChange} checked={valores.hilo_frec === '1'} /> 
                            <span>1 vez/día</span>
                        </label>
                        <label className="form-radio-label">
                            <RadioButton name="hilo_frec" value="3" onChange={handleRadioChange} checked={valores.hilo_frec === '3'} /> 
                            <span>3 veces/día</span>
                        </label>
                    </div>

                    <div className="form-row-item">
                        <Checkbox name="enjuague" onChange={handleCheckChange} checked={!!valores.enjuague} />
                        <span>¿Usa enjuague bucal?</span>
                        <label className="form-radio-label">
                            <RadioButton name="enjuague_rta" value="Si" onChange={handleRadioChange} checked={valores.enjuague_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label className="form-radio-label">
                            <RadioButton name="enjuague_rta" value="No" onChange={handleRadioChange} checked={valores.enjuague_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div className="form-row-item">
                        <Checkbox name="encias" onChange={handleCheckChange} checked={!!valores.encias} />
                        <span>¿Sangran sus encías?</span>
                        <label className="form-radio-label">
                            <RadioButton name="encias_rta" value="Si" onChange={handleRadioChange} checked={valores.encias_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label className="form-radio-label">
                            <RadioButton name="encias_rta" value="No" onChange={handleRadioChange} checked={valores.encias_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div className="form-row-item">
                        <Checkbox name="sensibilidad" onChange={handleCheckChange} checked={!!valores.sensibilidad} />
                        <span>¿Siente sensibilidad dental?</span>
                        <label className="form-radio-label">
                            <RadioButton name="sensibilidad_rta" value="Si" onChange={handleRadioChange} checked={valores.sensibilidad_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label className="form-radio-label">
                            <RadioButton name="sensibilidad_rta" value="No" onChange={handleRadioChange} checked={valores.sensibilidad_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div className="form-row-item">
                        <Checkbox name="bruxismo" onChange={handleCheckChange} checked={!!valores.bruxismo} />
                        <span>¿Bruxismo (aprieta o rechina)?</span>
                        <label className="form-radio-label">
                            <RadioButton name="bruxismo_rta" value="Si" onChange={handleRadioChange} checked={valores.bruxismo_rta === 'Si'} /> 
                            <span>Sí</span>
                        </label>
                        <label className="form-radio-label">
                            <RadioButton name="bruxismo_rta" value="No" onChange={handleRadioChange} checked={valores.bruxismo_rta === 'No'} /> 
                            <span>No</span>
                        </label>
                    </div>

                    <div className="form-row-item">
                        <Checkbox name="reacciones" onChange={handleCheckChange} checked={!!valores.reacciones} />
                        <span>¿Tuvo reacciones adversas?</span>
                        <InputText className="pr-input" name="reacciones_detalle" onChange={onChange} value={valores.reacciones_detalle || ''} placeholder="Especificar" style={{ flex: 1 }} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AntecedentesMedicos;
