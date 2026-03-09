function DatosPersonales({ onChange, valores = {} }) {
    return (
        <>
            {/* ── FILA 1: Fecha | Nombre y Apellido ── */}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
                <colgroup>
                    <col style={{ width: '200px' }} />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Fecha</span>
                            <input type="date" className="inp" name="fecha" onChange={onChange} defaultValue={valores.fecha || ''} style={{ width: '100%' }} />
                        </td>
                        <td className="celda">
                            <span className="lbl">Nombre y Apellido</span>
                            <input type="text" className="inp" name="nombre" onChange={onChange} defaultValue={valores.nombre || ''} placeholder="Apellido, Nombre" style={{ width: '100%' }} />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 2: Doc. Identificación | Sexo | Fecha de Nacimiento | Edad ── */}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
                <colgroup>
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '45%' }} />
                    <col style={{ width: '12%' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Doc. de Identificación</span>
                            <input type="text" className="inp" name="dni" onChange={onChange} defaultValue={valores.dni || ''} placeholder="Nro. documento" style={{ width: '100%' }} />
                        </td>
                        <td className="celda">
                            <span className="lbl">Sexo</span>
                            <select name="sexo" className="inp" onChange={onChange} defaultValue={valores.sexo || ''} style={{ width: '100%', cursor: 'pointer' }}>
                                <option value="">--</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </td>
                        <td className="celda">
                            <span className="lbl">Fecha de Nacimiento</span>
                            <input type="date" className="inp" name="fechaNacimiento" onChange={onChange} defaultValue={valores.fechaNacimiento || ''} style={{ width: '100%' }} />
                        </td>
                        <td className="celda">
                            <span className="lbl">Edad</span>
                            <input type="number" className="inp" name="edad" onChange={onChange} defaultValue={valores.edad || ''} min="0" max="120" placeholder="--" style={{ width: '100%', textAlign: 'center' }} />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 3: Teléfono | Dirección | Email ── */}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
                <colgroup>
                    <col style={{ width: '220px' }} />
                    <col />
                    <col style={{ width: '300px' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Teléfono</span>
                            <input type="tel" className="inp" name="telefono" onChange={onChange} defaultValue={valores.telefono || ''} placeholder="011 1234-5678" style={{ width: '100%' }} />
                        </td>
                        <td className="celda">
                            <span className="lbl">Dirección</span>
                            <input type="text" className="inp" name="direccion" onChange={onChange} defaultValue={valores.direccion || ''} placeholder="Calle, número, ciudad" style={{ width: '100%' }} />
                        </td>
                        <td className="celda">
                            <span className="lbl">Email</span>
                            <input type="email" className="inp" name="email" onChange={onChange} defaultValue={valores.email || ''} placeholder="correo@ejemplo.com" style={{ width: '100%' }} />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 4: Obra Social | N° de Afiliado ── */}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
                <colgroup>
                    <col />
                    <col style={{ width: '300px' }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda">
                            <span className="lbl">Obra Social</span>
                            <input type="text" className="inp" name="obraSocial" onChange={onChange} defaultValue={valores.obraSocial || ''} placeholder="Nombre de la obra social" style={{ width: '100%' }} />
                        </td>
                        <td className="celda">
                            <span className="lbl">N° de Afiliado</span>
                            <input type="text" className="inp" name="afiliado" onChange={onChange} defaultValue={valores.afiliado || ''} placeholder="Nro. afiliado" style={{ width: '100%' }} />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── FILA 5: Motivo de Consulta ── */}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px' }}>
                <colgroup>
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td className="celda" style={{ borderBottom: 'none' }}>
                            <span className="lbl">Motivo de Consulta</span>
                            <input type="text" className="inp" name="motivoConsulta" onChange={onChange} defaultValue={valores.motivoConsulta || ''} placeholder="Descripción del motivo de consulta" style={{ width: '100%' }} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default DatosPersonales;
