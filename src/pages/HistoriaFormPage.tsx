import { useEffect, useRef, useCallback } from 'react';
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
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import type { HistoriaClinicaForm } from '../types';

interface HistoriaFormPageProps {
  usuario: string;
  userId: string | null;
  cerrarSesion: () => void;
}

function HistoriaFormPage({ usuario, userId, cerrarSesion }: HistoriaFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useRef<Toast>(null);

  const {
    formMethods,
    editandoId,
    guardando,
    cargandoHistoria,
    abrirNueva,
    abrirEditar,
    guardarHistoria,
  } = useHistoriaClinica();

  const snapshotRef = useRef<string | null>(null);

  useEffect(() => {
    snapshotRef.current = null;
  }, [id]);

  useEffect(() => {
    if (cargandoHistoria) return;
    const timer = setTimeout(() => {
      snapshotRef.current = JSON.stringify(formMethods.getValues());
    }, 0);
    return () => clearTimeout(timer);
  }, [cargandoHistoria, formMethods]);

  const hasChanges = useCallback(
    () => {
      if (!snapshotRef.current) return false;
      return JSON.stringify(formMethods.getValues()) !== snapshotRef.current;
    },
    [formMethods]
  );

  useEffect(() => {
    if (id) {
      abrirEditar(id);
    } else {
      abrirNueva();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const manejarImpresion = () => window.print();

  const manejarSubmit = async (datos: HistoriaClinicaForm) => {
    if (!userId) return;
    const res = await guardarHistoria(userId, datos);
    if (res?.success) {
      snapshotRef.current = JSON.stringify(formMethods.getValues());
      toast.current?.show({ severity: 'success', summary: id ? 'Actualizado' : 'Guardado', detail: 'Registro guardado correctamente', life: 1500 });
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar. Verificá tu conexión.', life: 3000 });
    }
  };

  const volverAlDashboard = useCallback(() => {
    if (!hasChanges()) {
      navigate('/dashboard');
      return;
    }
    confirmDialog({
      message: 'Tenés cambios sin guardar. ¿Seguro que querés salir?',
      header: 'Cambios sin guardar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, salir',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-confirm-dialog-accept',
      rejectClassName: 'p-confirm-dialog-reject',
      accept: () => navigate('/dashboard'),
    });
  }, [hasChanges, navigate]);

  return (
    <div className="form-page-wrapper">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Topbar usuario={usuario}>
        <button className="btn-back" onClick={volverAlDashboard}>
          <i className="pi pi-arrow-left"></i> Dashboard
        </button>
        <button className="btn-ghost-red" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </Topbar>

      <div className="form-body">
        <h1 className="form-page-title">
          {id ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
        </h1>
        <div className="form-card">
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(manejarSubmit)}>
              <div className="form-inner" key={editandoId || 'nuevo'}>
                {cargandoHistoria ? (
                  <div style={{ padding: '2rem' }}>
                    <Skeleton width="40%" height="2rem" className="mb-4" style={{ marginBottom: '1.5rem' }} />
                    <div className="form-grid grid-row-2" style={{ marginBottom: '1.5rem' }}>
                      <Skeleton width="100%" height="40px" />
                      <Skeleton width="100%" height="40px" />
                    </div>
                    <div className="form-grid grid-row-2" style={{ marginBottom: '1.5rem' }}>
                      <Skeleton width="100%" height="40px" />
                      <Skeleton width="100%" height="40px" />
                    </div>
                    <Skeleton width="100%" height="150px" style={{ marginBottom: '1.5rem' }} />
                    <Skeleton width="100%" height="100px" style={{ marginBottom: '1.5rem' }} />
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

              <div className="form-actions no-print">
                <button type="submit" className="btn-save" disabled={guardando}>
                  {guardando ? '⏳ Guardando...' : id ? '💾 Guardar cambios' : '💾 Guardar Historia'}
                </button>
                <button type="button" className="btn-print" onClick={manejarImpresion}>🖨️ Imprimir / PDF</button>
                <button type="button" className="btn-cancel-form" onClick={volverAlDashboard}>✕ Cancelar</button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default HistoriaFormPage;
