import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
// Descomenta la siguiente línea cuando tengas tu imagen de los dientes
import imgDientes from './assets/dientes.png';

function App() {
  const componentePdfRef = useRef();

  // Función mágica para imprimir/guardar como PDF
  const manejarImpresion = useReactToPrint({
    content: () => componentePdfRef.current,
    documentTitle: 'Historia_Clinica',
  });

  const [datos, setDatos] = useState({});
  const manejarCambio = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: '20px', backgroundColor: '#e0e0e0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <button
        onClick={manejarImpresion}
        style={{ marginBottom: '20px', padding: '10px 30px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
      >
        Guardar como PDF / Imprimir
      </button>

      {/* Estilos CSS especiales para la versión impresa */}
      <style>
        {`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            input, textarea, select { 
              border: none !important; 
              background: transparent !important; 
              appearance: none; 
              -webkit-appearance: none; 
            }
            .no-print { display: none !important; }
          }
          .input-estilo {
            width: 100%; border: none; background: transparent; outline: none; font-family: Arial; font-size: 11px;
          }
          .celda-azul { background-color: #e6f2ff; font-weight: bold; border-bottom: 1px solid #b3d9ff; padding: 4px; }
          .celda-borde { border: 1px solid #000; padding: 4px; text-align: center; }
        `}
      </style>

      {/* === INICIO DEL DOCUMENTO TAMAÑO A4 === */}
      <div
        ref={componentePdfRef}
        style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white', padding: '15mm', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.2)', fontFamily: 'Arial, sans-serif', fontSize: '11px', boxSizing: 'border-box' }}
      >

        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ color: '#00aae4', fontSize: '24px', fontWeight: 'bold', width: '30%' }}>
            GRUPO DENTAL<br /><span style={{ fontSize: '36px', color: '#000' }}>ALBA</span>
          </div>
          <div style={{ width: '70%', textAlign: 'center' }}>
            <h2 style={{ textDecoration: 'underline', margin: 0 }}>HISTORIA CLINICA</h2>
          </div>
        </div>

        {/* Datos Personales (Tabla Azul) */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '11px' }}>
          <tbody>
            <tr>
              <td className="celda-azul" style={{ width: '50%' }}>
                Nombre y apellido: <input type="text" className="input-estilo" name="nombre" onChange={manejarCambio} style={{ width: '60%' }} />
              </td>
              <td className="celda-azul" style={{ width: '25%' }}>
                Fecha de nacimiento: <input type="date" className="input-estilo" name="fechaNacimiento" onChange={manejarCambio} />
              </td>
              <td className="celda-azul" style={{ width: '25%' }}>
                DNI: <input type="text" className="input-estilo" name="dni" onChange={manejarCambio} />
              </td>
            </tr>
            <tr>
              <td className="celda-azul" colSpan="2">
                Domicilio: <input type="text" className="input-estilo" name="domicilio" onChange={manejarCambio} />
              </td>
              <td className="celda-azul">
                Nº de teléfono: <input type="text" className="input-estilo" name="telefono" onChange={manejarCambio} />
              </td>
            </tr>
            <tr>
              <td className="celda-azul">
                Nº de afiliado: <input type="text" className="input-estilo" name="afiliado" onChange={manejarCambio} />
              </td>
              <td className="celda-azul">
                Obra social: <input type="text" className="input-estilo" name="obraSocial" onChange={manejarCambio} />
              </td>
              <td className="celda-azul">
                Plan: <input type="text" className="input-estilo" name="plan" onChange={manejarCambio} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Odontograma */}
        <div style={{ textAlign: 'center', marginBottom: '20px', minHeight: '150px', border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Reemplaza este span por la imagen cuando la tengas */}
          <span className="no-print" style={{ color: '#999' }}>[ Aquí irá la imagen de tu odontograma (dientes.png) ]</span>
          <img src={imgDientes} alt="Odontograma" style={{ maxWidth: '80%' }} />
        </div>

        {/* Antecedentes Médicos */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontWeight: 'bold' }}>
          Antecedentes médicos al: <input type="date" className="input-estilo" style={{ width: '150px', marginLeft: '10px', borderBottom: '1px solid black' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '10px' }}>
          <tbody>
            <tr>
              <td className="celda-borde">Problemas cardíacos</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Presión sanguínea anormal</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Anemia</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
            </tr>
            <tr>
              <td className="celda-borde">Diabetes</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Enfermedades venéreas</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Epilepsia</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
            </tr>
            <tr>
              <td className="celda-borde">Hepatitis</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Asma</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Puede estar embarazada</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
            </tr>
            <tr>
              <td className="celda-borde">Consume drogas</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Antecedentes alérgicos</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
              <td className="celda-borde">Está bajo tratamiento médico</td><td className="celda-borde"><input type="checkbox" /> SI</td><td className="celda-borde"><input type="checkbox" /> NO</td>
            </tr>
          </tbody>
        </table>

        {/* Observaciones y Firmas */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 5px 0' }}>Observaciones:</p>
          <textarea className="input-estilo" style={{ width: '100%', border: 'none', height: '40px', resize: 'none' }}></textarea>

          <div style={{ display: 'flex', border: '1px solid #00aae4', height: '80px', marginTop: '10px' }}>
            <div style={{ flex: 1, borderRight: '1px solid #00aae4', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>Firma y sello del profesional</div>
            <div style={{ width: '120px', borderRight: '1px solid #00aae4', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>Matricula</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>Firma y aclaración en conformidad del paciente</div>
          </div>
        </div>

        {/* Tabla de Tratamientos */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10px' }}>
          <thead>
            <tr style={{ fontWeight: 'bold' }}>
              <td className="celda-borde">Fecha</td>
              <td className="celda-borde">Código de<br />prestación</td>
              <td className="celda-borde">Pieza<br />dental</td>
              <td className="celda-borde">Ubicación<br />de la lesión</td>
              <td className="celda-borde" style={{ width: '40%' }}>Observaciones</td>
              <td className="celda-borde">Conformidad del paciente<br />Tratamiento terminado</td>
            </tr>
          </thead>
          <tbody>
            {/* Generamos 5 filas vacías para la tabla */}
            {[...Array(5)].map((_, i) => (
              <tr key={i} style={{ height: '25px' }}>
                <td className="celda-borde"><input type="text" className="input-estilo" /></td>
                <td className="celda-borde"><input type="text" className="input-estilo" /></td>
                <td className="celda-borde"><input type="text" className="input-estilo" /></td>
                <td className="celda-borde"><input type="text" className="input-estilo" /></td>
                <td className="celda-borde"><input type="text" className="input-estilo" /></td>
                <td className="celda-borde"><input type="text" className="input-estilo" /></td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;