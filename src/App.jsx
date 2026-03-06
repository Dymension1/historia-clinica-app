import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

function App() {
  const componentePdfRef = useRef();

  const manejarImpresion = useReactToPrint({
    content: () => componentePdfRef.current,
    documentTitle: 'Historia_Clinica',
  });

  const [datos, setDatos] = useState({});
  const manejarCambio = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#d0d8e0',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      <button
        onClick={manejarImpresion}
        style={{
          marginBottom: '24px',
          padding: '10px 36px',
          backgroundColor: '#0056b3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,86,179,0.4)',
        }}
      >
        Guardar como PDF / Imprimir
      </button>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          input, select { border-bottom: 1px solid #aaa !important; background: transparent !important; }
          .no-print { display: none !important; }
        }
        .lbl {
          display: block;
          font-size: 10px;
          font-weight: bold;
          color: #003d6b;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 3px;
        }
        .inp {
          border: none;
          border-bottom: 1px solid #7ab3d9;
          background: transparent;
          outline: none;
          font-family: Arial, sans-serif;
          color: #000;
          padding: 2px 0;
          font-size: 12px;
        }
        .celda {
          background-color: #e8f4fc;
          border-bottom: 2px solid #fff;
          border-right: 2px solid #fff;
          vertical-align: top;
          padding: 8px 12px;
        }
      `}</style>

      {/* Documento */}
      <div
        ref={componentePdfRef}
        style={{
          width: '100%',
          backgroundColor: 'white',
          padding: '30px 40px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          fontFamily: 'Arial, sans-serif',
          boxSizing: 'border-box',
          borderRadius: '4px',
        }}
      >

        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #00aae4', paddingBottom: '16px' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h2 style={{ textDecoration: 'underline', margin: 0, color: '#000', fontSize: '18px', letterSpacing: '2px' }}>
              HISTORIA CLÍNICA
            </h2>
          </div>
        </div>

        {/* ── FILA 1: Fecha | Nombre y Apellido ── */}
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
          <colgroup>
            <col style={{ width: '200px' }} />  {/* Fecha */}
            <col />                              {/* Nombre y Apellido (resto) */}
          </colgroup>
          <tbody>
            <tr>
              <td className="celda">
                <span className="lbl">Fecha</span>
                <input type="date" className="inp" name="fecha" onChange={manejarCambio} style={{ width: '100%' }} />
              </td>
              <td className="celda">
                <span className="lbl">Nombre y Apellido</span>
                <input type="text" className="inp" name="nombre" onChange={manejarCambio} placeholder="Apellido, Nombre" style={{ width: '100%' }} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── FILA 2: Doc. Identificación | Sexo | Fecha de Nacimiento | Edad ── */}
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
          <colgroup>
            <col style={{ width: '220px' }} />  {/* Doc. Identificación */}
            <col style={{ width: '120px' }} />  {/* Sexo */}
            <col />                             {/* Fecha de Nacimiento (resto) */}
            <col style={{ width: '80px' }} />   {/* Edad */}
          </colgroup>
          <tbody>
            <tr>
              <td className="celda">
                <span className="lbl">Doc. de Identificación</span>
                <input type="text" className="inp" name="dni" onChange={manejarCambio} placeholder="Nro. documento" style={{ width: '100%' }} />
              </td>
              <td className="celda">
                <span className="lbl">Sexo</span>
                <select name="sexo" className="inp" onChange={manejarCambio} style={{ width: '100%', cursor: 'pointer' }}>
                  <option value="">--</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </td>
              <td className="celda">
                <span className="lbl">Fecha de Nacimiento</span>
                <input type="date" className="inp" name="fechaNacimiento" onChange={manejarCambio} style={{ width: '100%' }} />
              </td>
              <td className="celda">
                <span className="lbl">Edad</span>
                <input type="number" className="inp" name="edad" onChange={manejarCambio} min="0" max="120" placeholder="--" style={{ width: '100%', textAlign: 'center' }} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── FILA 3: Teléfono | Dirección | Email ── */}
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
          <colgroup>
            <col style={{ width: '220px' }} />  {/* Teléfono */}
            <col />                             {/* Dirección (resto) */}
            <col style={{ width: '300px' }} />  {/* Email */}
          </colgroup>
          <tbody>
            <tr>
              <td className="celda">
                <span className="lbl">Teléfono</span>
                <input type="tel" className="inp" name="telefono" onChange={manejarCambio} placeholder="011 1234-5678" style={{ width: '100%' }} />
              </td>
              <td className="celda">
                <span className="lbl">Dirección</span>
                <input type="text" className="inp" name="direccion" onChange={manejarCambio} placeholder="Calle, número, ciudad" style={{ width: '100%' }} />
              </td>
              <td className="celda">
                <span className="lbl">Email</span>
                <input type="email" className="inp" name="email" onChange={manejarCambio} placeholder="correo@ejemplo.com" style={{ width: '100%' }} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── FILA 4: Obra Social | N° de Afiliado ── */}
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px', marginBottom: '2px' }}>
          <colgroup>
            <col />                             {/* Obra Social (resto) */}
            <col style={{ width: '300px' }} />  {/* N° de Afiliado */}
          </colgroup>
          <tbody>
            <tr>
              <td className="celda">
                <span className="lbl">Obra Social</span>
                <input type="text" className="inp" name="obraSocial" onChange={manejarCambio} placeholder="Nombre de la obra social" style={{ width: '100%' }} />
              </td>
              <td className="celda">
                <span className="lbl">N° de Afiliado</span>
                <input type="text" className="inp" name="afiliado" onChange={manejarCambio} placeholder="Nro. afiliado" style={{ width: '100%' }} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── FILA 5: Motivo de Consulta ── */}
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', tableLayout: 'fixed', fontSize: '12px' }}>
          <colgroup>
            <col />  {/* Motivo (ancho completo) */}
          </colgroup>
          <tbody>
            <tr>
              <td className="celda" style={{ borderBottom: 'none' }}>
                <span className="lbl">Motivo de Consulta</span>
                <input type="text" className="inp" name="motivoConsulta" onChange={manejarCambio} placeholder="Descripción del motivo de consulta" style={{ width: '100%' }} />
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;