import { SECTION_TITLE, SECTION_BODY } from './theme';

function AntecedentesMedicos({ onChange, valores = {} }) {
    const labelStyle = { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)' };
    const radioLabel = { display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)' };
    const rowStyle = { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', color: 'rgba(255,255,255,0.82)' };

    return (
        <div style={{ marginTop: '20px' }}>

            {/* Título */}
            <div style={SECTION_TITLE}>Antecedentes Médicos</div>

            {/* Cuerpo: dos columnas */}
            <div style={{ ...SECTION_BODY, display: 'flex' }}>

                {/* ── Columna izquierda: condiciones ── */}
                <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px' }}>
                    {['Cardiopatías', 'Hipertensión / Hipotensión', 'Diabetes', 'Asma', 'Anemia', 'Trastornos tiroideos', 'Epilepsia', 'Trastornos de coagulación', 'Embarazo'].map((cond) => (
                        <label key={cond} style={labelStyle}>
                            <input type="checkbox" name={`cond_${cond}`} onChange={onChange} defaultChecked={!!valores[`cond_${cond}`]} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                            {cond}
                        </label>
                    ))}
                    <label style={labelStyle}>
                        <input type="checkbox" name="cond_autoinmunes" onChange={onChange} defaultChecked={!!valores.cond_autoinmunes} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        Enfermedades autoinmunes:
                        <input type="text" className="inp" name="autoinmunes_detalle" onChange={onChange} defaultValue={valores.autoinmunes_detalle || ''} style={{ flex: 1 }} />
                    </label>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                        <input type="checkbox" name="cond_otras" onChange={onChange} defaultChecked={!!valores.cond_otras} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        Otras:
                        <input type="text" className="inp" name="otras_detalle" onChange={onChange} defaultValue={valores.otras_detalle || ''} style={{ flex: 1 }} />
                    </label>
                </div>

                {/* ── Columna derecha: preguntas Sí/No ── */}
                <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    <div style={rowStyle}>
                        <input type="checkbox" name="fuma" onChange={onChange} defaultChecked={!!valores.fuma} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Fuma?
                        <input type="text" className="inp" name="fuma_detalle" onChange={onChange} defaultValue={valores.fuma_detalle || ''} placeholder="Cantidad / tipo" style={{ flex: 1 }} />
                    </div>

                    <div style={rowStyle}>
                        <input type="checkbox" name="alcohol" onChange={onChange} defaultChecked={!!valores.alcohol} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Consume alcohol con frecuencia?
                        <label style={radioLabel}><input type="radio" name="alcohol_rta" value="Si" onChange={onChange} defaultChecked={valores.alcohol_rta === 'Si'} style={{ accentColor: '#00aae4' }} /> Sí</label>
                        <label style={radioLabel}><input type="radio" name="alcohol_rta" value="No" onChange={onChange} defaultChecked={valores.alcohol_rta === 'No'} style={{ accentColor: '#00aae4' }} /> No</label>
                    </div>

                    <div style={rowStyle}>
                        <input type="checkbox" name="hiloDental" onChange={onChange} defaultChecked={!!valores.hiloDental} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Usa hilo dental?
                        <label style={radioLabel}><input type="radio" name="hilo_frec" value="1" onChange={onChange} defaultChecked={valores.hilo_frec === '1'} style={{ accentColor: '#00aae4' }} /> 1 vez/día</label>
                        <label style={radioLabel}><input type="radio" name="hilo_frec" value="3" onChange={onChange} defaultChecked={valores.hilo_frec === '3'} style={{ accentColor: '#00aae4' }} /> 3 veces/día</label>
                    </div>

                    <div style={rowStyle}>
                        <input type="checkbox" name="enjuague" onChange={onChange} defaultChecked={!!valores.enjuague} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Usa enjuague bucal?
                        <label style={radioLabel}><input type="radio" name="enjuague_rta" value="Si" onChange={onChange} defaultChecked={valores.enjuague_rta === 'Si'} style={{ accentColor: '#00aae4' }} /> Sí</label>
                        <label style={radioLabel}><input type="radio" name="enjuague_rta" value="No" onChange={onChange} defaultChecked={valores.enjuague_rta === 'No'} style={{ accentColor: '#00aae4' }} /> No</label>
                    </div>

                    <div style={rowStyle}>
                        <input type="checkbox" name="encias" onChange={onChange} defaultChecked={!!valores.encias} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Sangran sus encías?
                        <label style={radioLabel}><input type="radio" name="encias_rta" value="Si" onChange={onChange} defaultChecked={valores.encias_rta === 'Si'} style={{ accentColor: '#00aae4' }} /> Sí</label>
                        <label style={radioLabel}><input type="radio" name="encias_rta" value="No" onChange={onChange} defaultChecked={valores.encias_rta === 'No'} style={{ accentColor: '#00aae4' }} /> No</label>
                    </div>

                    <div style={rowStyle}>
                        <input type="checkbox" name="sensibilidad" onChange={onChange} defaultChecked={!!valores.sensibilidad} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Siente sensibilidad dental?
                        <label style={radioLabel}><input type="radio" name="sensibilidad_rta" value="Si" onChange={onChange} defaultChecked={valores.sensibilidad_rta === 'Si'} style={{ accentColor: '#00aae4' }} /> Sí</label>
                        <label style={radioLabel}><input type="radio" name="sensibilidad_rta" value="No" onChange={onChange} defaultChecked={valores.sensibilidad_rta === 'No'} style={{ accentColor: '#00aae4' }} /> No</label>
                    </div>

                    <div style={rowStyle}>
                        <input type="checkbox" name="bruxismo" onChange={onChange} defaultChecked={!!valores.bruxismo} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Bruxismo (aprieta o rechina los dientes)?
                        <label style={radioLabel}><input type="radio" name="bruxismo_rta" value="Si" onChange={onChange} defaultChecked={valores.bruxismo_rta === 'Si'} style={{ accentColor: '#00aae4' }} /> Sí</label>
                        <label style={radioLabel}><input type="radio" name="bruxismo_rta" value="No" onChange={onChange} defaultChecked={valores.bruxismo_rta === 'No'} style={{ accentColor: '#00aae4' }} /> No</label>
                    </div>

                    <div style={rowStyle}>
                        <input type="checkbox" name="reacciones" onChange={onChange} defaultChecked={!!valores.reacciones} style={{ width: '14px', height: '14px', accentColor: '#00aae4' }} />
                        ¿Tuvo reacciones adversas?
                        <input type="text" className="inp" name="reacciones_detalle" onChange={onChange} defaultValue={valores.reacciones_detalle || ''} placeholder="Especificar" style={{ flex: 1 }} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AntecedentesMedicos;
