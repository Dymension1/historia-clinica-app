import { useState } from 'react';
import { supabase } from '../supabaseClient';

// ── Convierte una fila de Supabase → estado del formulario ──
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

// ── Convierte estado del formulario → fila de Supabase ──
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
    // seguimiento se guarda en tabla separada
  };
}

/**
 * Hook que encapsula toda la lógica de persistencia de historias clínicas.
 * @param {Object} options
 * @param {Function} options.onGuardadoOk - callback ejecutado 1.8 s después de guardar exitosamente
 */
export function useHistoriaClinica({ onGuardadoOk } = {}) {
  const [datos, setDatos] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState(null); // 'ok' | 'error' | null

  // Maneja cambios de cualquier campo del formulario
  const manejarCambio = (e) => {
    const { name, type, checked, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Prepara el estado para una nueva historia
  const abrirNueva = () => {
    setDatos({});
    setEditandoId(null);
    setEstadoGuardado(null);
  };

  // Carga una historia existente (historia + seguimiento)
  const abrirEditar = async (id) => {
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

      setDatos(formData);
      setEditandoId(id);
      setEstadoGuardado(null);
    }
  };

  // Guarda la historia + seguimiento (INSERT o UPDATE según modo)
  const guardarHistoria = async (sessionId) => {
    setGuardando(true);
    setEstadoGuardado(null);

    const registro = formToRow(datos, sessionId);
    const seguimientoFilas = datos.seguimiento || [];

    let error;
    let historiaId = editandoId;

    if (editandoId) {
      // Modo edición → UPDATE
      ({ error } = await supabase
        .from('historias_clinicas')
        .update(registro)
        .eq('id', editandoId));
    } else {
      // Modo nuevo → INSERT, recuperamos el ID para ligar el seguimiento
      const { data: inserted, error: insertError } = await supabase
        .from('historias_clinicas')
        .insert(registro)
        .select('id')
        .single();
      error      = insertError;
      historiaId = inserted?.id ?? null;
    }

    // ── Guardar seguimiento: borrar existentes y re-insertar ──
    // (estrategia "delete + insert" para manejar alta/baja/modificación en un solo paso)
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

      // 1. Eliminar TODOS los registros previos de esta historia
      const { error: deleteError } = await supabase
        .from('seguimiento_tratamiento')
        .delete()
        .eq('historia_id', historiaId);
      if (deleteError) error = deleteError;

      // 2. Re-insertar solo las filas válidas (sin pasar id → GENERATED ALWAYS)
      if (!error && filasValidas.length > 0) {
        const { error: insertError } = await supabase
          .from('seguimiento_tratamiento')
          .insert(filasValidas.map(toPayload));
        if (insertError) error = insertError;
      }
    }

    setGuardando(false);
    if (!error) {
      setEstadoGuardado('ok');
      if (onGuardadoOk) setTimeout(onGuardadoOk, 1800);
    } else {
      console.error('Error al guardar:', error);
      setEstadoGuardado('error');
    }
  };

  return {
    datos,
    editandoId,
    guardando,
    estadoGuardado,
    manejarCambio,
    abrirNueva,
    abrirEditar,
    guardarHistoria,
    setEstadoGuardado,
  };
}
