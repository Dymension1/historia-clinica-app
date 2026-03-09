import { useState } from 'react';
import DatosPersonales from './components/DatosPersonales';
import AntecedentesMedicos from './components/AntecedentesMedicos';
import HistoriaOdontologica from './components/HistoriaOdontologica';
import Diagnostico from './components/Diagnostico';

function App() {
  const [datos, setDatos] = useState({});
  const manejarCambio = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });
  const manejarImpresion = () => window.print();

  return (
    <div
      className="pagina-wrapper"
      style={{
        padding: '30px',
        backgroundColor: '#d0d8e0',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >

      <style>{`
        @page {
          size: A4 landscape;
          margin: 10mm;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .pagina-wrapper {
            background-color: white !important;
            padding: 0 !important;
          }
          .documento {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          input, select, textarea {
            border-bottom: 1px solid #aaa !important;
            background: transparent !important;
          }
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
        className="documento"
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

        {/* ── Sección: Datos Personales ── */}
        <DatosPersonales onChange={manejarCambio} />

        {/* ── Sección: Antecedentes Médicos ── */}
        <AntecedentesMedicos onChange={manejarCambio} />

        {/* ── Sección: Historia Odontológica ── */}
        <HistoriaOdontologica onChange={manejarCambio} />

        {/* ── Sección: Diagnóstico ── */}
        <Diagnostico onChange={manejarCambio} />

      </div>

      {/* Botón al final — no se imprime */}
      <button
        className="no-print"
        onClick={manejarImpresion}
        style={{
          marginTop: '24px',
          padding: '12px 48px',
          backgroundColor: '#0056b3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,86,179,0.4)',
        }}
      >
        🖨️ Guardar como PDF / Imprimir
      </button>

    </div>
  );
}

export default App;