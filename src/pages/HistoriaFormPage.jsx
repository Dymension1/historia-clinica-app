import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { useHistoriaClinica } from '../hooks/useHistoriaClinica';
import Topbar from '../components/Topbar';
import DatosPersonales from '../components/DatosPersonales';
import AntecedentesMedicos from '../components/AntecedentesMedicos';
import HistoriaOdontologica from '../components/HistoriaOdontologica';
import Diagnostico from '../components/Diagnostico';
import SeguimientoTratamiento from '../components/SeguimientoTratamiento';
import { Skeleton } from 'primereact/skeleton';

/**
 * Componente "Wrapper" (Envoltorio) enrutado para la creación y/o edición de pacientes.
 * Se encarga de instanciar y alimentar a todos los sub-componentes interactivos del formulario general
 * con el estado validado de Zod, además de capturar las señales de la URL (`:id`).
 *
 * Muestra transiciones elegantes tipo "Skeleton" (Cargando) mientras los datos remotos viajan 
 * a través del hook maestro `useHistoriaClinica`.
 *
 * @param {Object} props
 * @param {string} props.usuario - Email del usuario activo en la sesión.
 * @param {string} props.userId - Identificador UUID primario del usuario autenticado en la Base de Datos Supabase.
 * @param {Function} props.cerrarSesion - Ejecutable para anular la sesión y regresar a pantalla de login.
 * @returns {JSX.Element} Toda la disposición visual, topbar, formularios apilados y botones de control inferior.
 */
function HistoriaFormPage({ usuario, userId, cerrarSesion }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    formMethods,
    editandoId,
    guardando,
    estadoGuardado,
    cargandoHistoria,
    abrirNueva,
    abrirEditar,
    guardarHistoria,
  } = useHistoriaClinica({ onGuardadoOk: () => navigate('/dashboard') });

  useEffect(() => {
    if (id) {
      abrirEditar(id);
    } else {
      abrirNueva();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Invoca directamente a la ventana interna de impresión del explorador actual (`window.print()`).
   * React se ajusta al contexto físico ya que hay sentencias `@media print` en los archivos CSS.
   */
  const manejarImpresion = () => window.print();

  return (
      <div className="form-page-wrapper">
        {/* ── Topbar Unificado ── */}
        <Topbar usuario={usuario}>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <i className="pi pi-arrow-left"></i> Dashboard
          </button>
          <button className="btn-ghost-red" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </Topbar>

        {/* ── Cuerpo ── */}
        <div className="form-body">
          <h1 className="form-page-title">
            {id ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
          </h1>
          <div className="form-card">
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit((datos) => guardarHistoria(userId, datos))}>
                <div className="form-inner" key={editandoId || 'nuevo'}>
                  {cargandoHistoria ? (
                    <div style={{ padding: '2rem' }}>
                      <Skeleton width="40%" height="2rem" className="mb-4" style={{ marginBottom: '1.5rem'}} />
                      <div className="form-grid grid-row-2" style={{ marginBottom: '1.5rem'}}>
                         <Skeleton width="100%" height="40px" />
                         <Skeleton width="100%" height="40px" />
                      </div>
                      <div className="form-grid grid-row-2" style={{ marginBottom: '1.5rem'}}>
                         <Skeleton width="100%" height="40px" />
                         <Skeleton width="100%" height="40px" />
                      </div>
                      <Skeleton width="100%" height="150px" style={{ marginBottom: '1.5rem'}} />
                      <Skeleton width="100%" height="100px" style={{ marginBottom: '1.5rem'}} />
                    </div>
                  ) : (
                    <>
                      <DatosPersonales />
                      <AntecedentesMedicos />
                      <HistoriaOdontologica />
                      <Diagnostico />
                      <SeguimientoTratamiento />
                    </>
                  )}
                </div>

                {/* Acciones */}
                <div className="form-actions no-print">
                  <button type="submit" className="btn-save" disabled={guardando}>
                    {guardando ? '⏳ Guardando...' : id ? '💾 Guardar cambios' : '💾 Guardar Historia'}
                  </button>
                  <button type="button" className="btn-print" onClick={manejarImpresion}>🖨️ Imprimir / PDF</button>
                  <button type="button" className="btn-cancel-form" onClick={() => navigate('/dashboard')}>✕ Cancelar</button>
                </div>
              </form>
            </FormProvider>

            {/* Toasts del formulario */}
            {estadoGuardado === 'ok' && <div className="toast toast-ok">✅ Guardado correctamente — volviendo al panel...</div>}
            {estadoGuardado === 'error' && <div className="toast toast-error">❌ Error al guardar. Verificá tu conexión.</div>}
          </div>
        </div>
      </div>
  );
}

export default HistoriaFormPage;
