import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { historiaClinicaSchema } from '../schemas/historiaClinicaSchema';

/**
 * Convierte un objeto de fila obtenido directo de la base de datos Supabase
 * en la estructura con formato plano e inicializado que espera `react-hook-form`.
 * 
 * @param {Object} r - El registro de historia_clinica recuperado de la base de datos.
 * @returns {Object} Un objeto con los campos inicializados para el estado del formulario.
 */
function rowToForm(r) {
  return {
    fecha: r.fecha || '',
    nombre: r.nombre || '',
    dni: r.dni || '',
    sexo: r.sexo || '',
    fechaNacimiento: r.fecha_nacimiento || '',
    edad: r.edad ?? '',
    telefono: r.telefono || '',
    direccion: r.direccion || '',
    email: r.email_paciente || '',
    obraSocial: r.obra_social || '',
    afiliado: r.afiliado || '',
    motivoConsulta: r.motivo_consulta || '',
    'cond_Cardiopatías': r.cond_cardiopatias || false,
    'cond_Hipertensión / Hipotensión': r.cond_hipertension || false,
    'cond_Diabetes': r.cond_diabetes || false,
    'cond_Asma': r.cond_asma || false,
    'cond_Anemia': r.cond_anemia || false,
    'cond_Trastornos tiroideos': r.cond_tiroides || false,
    'cond_Epilepsia': r.cond_epilepsia || false,
    'cond_Trastornos de coagulación': r.cond_coagulacion || false,
    'cond_Embarazo': r.cond_embarazo || false,
    cond_autoinmunes: r.cond_autoinmunes || false,
    autoinmunes_detalle: r.cond_autoinmunes_detalle || '',
    cond_otras: r.cond_otras || false,
    otras_detalle: r.cond_otras_detalle || '',
    fuma: r.fuma || false,
    fuma_detalle: r.fuma_detalle || '',
    alcohol_rta: r.alcohol_rta || '',
    hilo_frec: r.hilo_frec || '',
    enjuague_rta: r.enjuague_rta || '',
    encias_rta: r.encias_rta || '',
    sensibilidad_rta: r.sensibilidad_rta || '',
    bruxismo_rta: r.bruxismo_rta || '',
    reacciones: r.reacciones || false,
    reacciones_detalle: r.reacciones_detalle || '',
    cepilla: r.cepilla || '',
    hiloDental2: r.hilo_dental2 || '',
    enjuague2: r.enjuague2 || '',
    encias2: r.encias2 || '',
    tejidos: r.tejidos || '',
    diagnostico: r.diagnostico || '',
    seguimiento: [], // se carga por separado desde seguimiento_tratamiento
  };
}

/**
 * Realiza la conversión inversa; toma el estado centralizado del formulario administrado por 
 * `react-hook-form` y lo mapea hacia el formato relacional explícito exigido por Supabase `historias_clinicas`.
 * 
 * @param {Object} datos - El estado de los valores validados provistos por React Hook Form.
 * @param {string} userId - UUID del usuario (odontólogo/empleado) asociado en base de datos.
 * @returns {Object} El payload preparado para operaciones de INSERT o UPDATE en Supabase.
 */
function formToRow(datos, userId) {
  return {
    user_id: userId,
    fecha: datos.fecha || null,
    nombre: datos.nombre || null,
    dni: datos.dni || null,
    sexo: datos.sexo || null,
    fecha_nacimiento: datos.fechaNacimiento || null,
    edad: datos.edad ? parseInt(datos.edad) : null,
    telefono: datos.telefono || null,
    direccion: datos.direccion || null,
    email_paciente: datos.email || null,
    obra_social: datos.obraSocial || null,
    afiliado: datos.afiliado || null,
    motivo_consulta: datos.motivoConsulta || null,
    cond_cardiopatias: !!datos['cond_Cardiopatías'],
    cond_hipertension: !!datos['cond_Hipertensión / Hipotensión'],
    cond_diabetes: !!datos['cond_Diabetes'],
    cond_asma: !!datos['cond_Asma'],
    cond_anemia: !!datos['cond_Anemia'],
    cond_tiroides: !!datos['cond_Trastornos tiroideos'],
    cond_epilepsia: !!datos['cond_Epilepsia'],
    cond_coagulacion: !!datos['cond_Trastornos de coagulación'],
    cond_embarazo: !!datos['cond_Embarazo'],
    cond_autoinmunes: !!datos.cond_autoinmunes,
    cond_autoinmunes_detalle: datos.autoinmunes_detalle || null,
    cond_otras: !!datos.cond_otras,
    cond_otras_detalle: datos.otras_detalle || null,
    fuma: !!datos.fuma,
    fuma_detalle: datos.fuma_detalle || null,
    alcohol_rta: datos.alcohol_rta || null,
    hilo_frec: datos.hilo_frec || null,
    enjuague_rta: datos.enjuague_rta || null,
    encias_rta: datos.encias_rta || null,
    sensibilidad_rta: datos.sensibilidad_rta || null,
    bruxismo_rta: datos.bruxismo_rta || null,
    reacciones: !!datos.reacciones,
    reacciones_detalle: datos.reacciones_detalle || null,
    cepilla: datos.cepilla || null,
    hilo_dental2: datos.hiloDental2 || null,
    enjuague2: datos.enjuague2 || null,
    encias2: datos.encias2 || null,
    tejidos: datos.tejidos || null,
    diagnostico: datos.diagnostico || null,
  };
}

export const valoresPorDefecto = {
  fecha: '', nombre: '', dni: '', sexo: '', fechaNacimiento: '', edad: '',
  telefono: '', direccion: '', email: '', obraSocial: '', afiliado: '', motivoConsulta: '',
  'cond_Cardiopatías': false, 'cond_Hipertensión / Hipotensión': false, 'cond_Diabetes': false,
  'cond_Asma': false, 'cond_Anemia': false, 'cond_Trastornos tiroideos': false,
  'cond_Epilepsia': false, 'cond_Trastornos de coagulación': false, 'cond_Embarazo': false,
  cond_autoinmunes: false, autoinmunes_detalle: '', cond_otras: false, otras_detalle: '',
  fuma: false, fuma_detalle: '', alcohol_rta: '', hilo_frec: '', enjuague_rta: '',
  encias_rta: '', sensibilidad_rta: '', bruxismo_rta: '', reacciones: false, reacciones_detalle: '',
  cepilla: '', hiloDental2: '', enjuague2: '', encias2: '', tejidos: '', diagnostico: '',
  seguimiento: [{ fecha: '', tratamiento: '', diente: '', caras: '', observaciones: '', presupuesto: '', entrega: '' }]
};

/**
 * Hook personalizado que centraliza todo el estado, validación y transacciones asíncronas
 * del formulario de Historia Clínica, apoyándose en `react-hook-form` para Performance.
 * 
 * @param {Object} param0 - Configuraciones u hooks externos recibidos.
 * @param {Function} param0.onGuardadoOk - Callback opcional lanzado tras guardarse correctamente en base de datos.
 * @returns {Object} Un objeto conteniendo los métodos del formulario y la capa de guardado para la vista. 
 */
export function useHistoriaClinica() {
  const queryClient = useQueryClient();
  const formMethods = useForm({
    resolver: zodResolver(historiaClinicaSchema),
    defaultValues: valoresPorDefecto,
    mode: 'onSubmit' // Validate on submit to improve initial performance
  });

  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [cargandoHistoria, setCargandoHistoria] = useState(false);

  /**
   * Resetea el formulario por completo y lo prepara para insertar una nueva 
   * historia en blanco, limpiando cualquier identificador previo o mensaje de feedback.
   */
  const abrirNueva = () => {
    formMethods.reset(valoresPorDefecto);
    setEditandoId(null);
  };

  /**
   * Consulta una historia clínica vía Supabase utilizando su ID primario,
   * además de consultar asíncronamente sus filas relacionadas en `seguimiento_tratamiento`.
   * Parsea este resultado e inicializa automáticamente los inputs reactivos de la UI.
   * 
   * @param {string|number} id - Identificador de la base de datos correspondiente a la historia a cargar.
   */
  const abrirEditar = async (id) => {
    setCargandoHistoria(true);
    const { data, error } = await supabase
      .from('historias_clinicas')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      const { data: seguimientoData } = await supabase
        .from('seguimiento_tratamiento')
        .select('*')
        .eq('historia_id', id)
        .order('created_at', { ascending: true });

      const formData = rowToForm(data);
      formData.seguimiento = (seguimientoData || []).map((s) => ({
        _dbId:         s.id,
        fecha:         s.fecha         || '',
        tratamiento:   s.tratamiento   || '',
        diente:        s.diente        || '',
        caras:         s.caras         || '',
        observaciones: s.observaciones || '',
        presupuesto:   s.presupuesto != null ? String(s.presupuesto) : '',
        entrega:       s.entrega      != null ? String(s.entrega)     : '',
      }));
      
      if (formData.seguimiento.length === 0) {
        formData.seguimiento = [{ fecha: '', tratamiento: '', diente: '', caras: '', observaciones: '', presupuesto: '', entrega: '' }];
      }

      formMethods.reset(formData);
      setEditandoId(id);
    }
    setCargandoHistoria(false);
  };

  /**
   * Emite el guardado final hacia Supabase considerando 2 escenarios condicionales:
   * 1. (UPDATE): Modifica un registro primario si `editandoId` está activo.
   * 2. (INSERT): Genera un nuevo registro.
   * Al finalizar, reescribe de forma paralela la tabla `seguimiento_tratamiento`.
   * 
   * @param {string} userId - UUID del usuario autenticado en la sesión.
   * @param {Object} datos - Datos recolectados y chequeados (on valid) por handleSubmit de React Hook Form.
   */
  const guardarHistoria = async (userId, datos) => {
    setGuardando(true);

    const registro = formToRow(datos, userId);
    const seguimientoFilas = datos.seguimiento || [];

    let error;
    let historiaId = editandoId;

    if (editandoId) {
      ({ error } = await supabase
        .from('historias_clinicas')
        .update(registro)
        .eq('id', editandoId));
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('historias_clinicas')
        .insert(registro)
        .select('id')
        .single();
      error      = insertError;
      historiaId = inserted?.id ?? null;
    }

    if (!error && historiaId) {
      const filasValidas = seguimientoFilas.filter(
        (f) => f.fecha || f.tratamiento || f.diente || f.caras || f.observaciones || f.presupuesto || f.entrega
      );

      const toPayload = (f) => ({
        historia_id:   historiaId,
        fecha:         f.fecha         || null,
        tratamiento:   f.tratamiento   || null,
        diente:        f.diente        || null,
        caras:         f.caras         || null,
        observaciones: f.observaciones || null,
        presupuesto:   parseFloat((f.presupuesto || '').replace(/\./g, '').replace(',', '.')) || 0,
        entrega:       parseFloat((f.entrega     || '').replace(/\./g, '').replace(',', '.')) || 0,
      });

      const { error: deleteError } = await supabase
        .from('seguimiento_tratamiento')
        .delete()
        .eq('historia_id', historiaId);
      if (deleteError) error = deleteError;

      if (!error && filasValidas.length > 0) {
        const { error: insertError } = await supabase
          .from('seguimiento_tratamiento')
          .insert(filasValidas.map(toPayload));
        if (insertError) error = insertError;
      }
    }

    setGuardando(false);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['historias'] });
      queryClient.invalidateQueries({ queryKey: ['totalesHistorias'] });
      return { success: true };
    } else {
      console.error('Error al guardar:', error);
      return { success: false, error };
    }
  };

  return {
    formMethods, editandoId, guardando, cargandoHistoria,
    abrirNueva, abrirEditar, guardarHistoria,
  };
}
