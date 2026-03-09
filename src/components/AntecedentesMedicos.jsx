function AntecedentesMedicos({ onChange }) {
    return (
        <div style={{ marginTop: '18px' }}>

            {/* Título de sección */}
            <div style={{
                backgroundColor: '#003d6b',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                letterSpacing: '1px',
                padding: '5px 10px',
                textTransform: 'uppercase',
            }}>
                Antecedentes Médicos
            </div>

            {/* Cuerpo: dos columnas */}
            <div style={{ display: 'flex', border: '1px solid #b3d9ff', fontSize: '12px' }}>

                {/* ── Columna izquierda: condiciones ── */}
                <div style={{ flex: 1, borderRight: '1px solid #b3d9ff', padding: '10px 14px', backgroundColor: '#f0f7ff' }}>
                    {['Cardiopatías', 'Hipertensión / Hipotensión', 'Diabetes', 'Asma', 'Anemia', 'Trastornos tiroideos', 'Epilepsia', 'Trastornos de coagulación', 'Embarazo'].map((cond) => (
                        <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', cursor: 'pointer' }}>
                            <input type="checkbox" name={`cond_${cond}`} onChange={onChange} style={{ width: '14px', height: '14px' }} />
                            {cond}
                        </label>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', cursor: 'pointer' }}>
                        <input type="checkbox" name="cond_autoinmunes" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        Enfermedades autoinmunes:
                        <input type="text" className="inp" name="autoinmunes_detalle" onChange={onChange} style={{ flex: 1 }} />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input type="checkbox" name="cond_otras" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        Otras:
                        <input type="text" className="inp" name="otras_detalle" onChange={onChange} style={{ flex: 1 }} />
                    </label>
                </div>

                {/* ── Columna derecha: preguntas Sí/No ── */}
                <div style={{ flex: 1, padding: '10px 14px', backgroundColor: '#f0f7ff', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" name="fuma" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Fuma?
                        <input type="text" className="inp" name="fuma_detalle" onChange={onChange} placeholder="Cantidad / tipo" style={{ flex: 1 }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="checkbox" name="alcohol" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Consume alcohol con frecuencia?
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="alcohol_rta" value="Si" onChange={onChange} /> Sí</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="alcohol_rta" value="No" onChange={onChange} /> No</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="checkbox" name="hiloDental" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Usa hilo dental?
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="hilo_frec" value="1" onChange={onChange} /> 1 vez/día</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="hilo_frec" value="3" onChange={onChange} /> 3 veces/día</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="checkbox" name="enjuague" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Usa enjuague bucal?
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="enjuague_rta" value="Si" onChange={onChange} /> Sí</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="enjuague_rta" value="No" onChange={onChange} /> No</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="checkbox" name="encias" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Sangran sus encías?
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="encias_rta" value="Si" onChange={onChange} /> Sí</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="encias_rta" value="No" onChange={onChange} /> No</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="checkbox" name="sensibilidad" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Siente sensibilidad dental?
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="sensibilidad_rta" value="Si" onChange={onChange} /> Sí</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="sensibilidad_rta" value="No" onChange={onChange} /> No</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="checkbox" name="bruxismo" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Bruxismo (aprieta o rechina los dientes)?
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="bruxismo_rta" value="Si" onChange={onChange} /> Sí</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><input type="radio" name="bruxismo_rta" value="No" onChange={onChange} /> No</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" name="reacciones" onChange={onChange} style={{ width: '14px', height: '14px' }} />
                        ¿Tuvo reacciones adversas?
                        <input type="text" className="inp" name="reacciones_detalle" onChange={onChange} placeholder="Especificar" style={{ flex: 1 }} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AntecedentesMedicos;
