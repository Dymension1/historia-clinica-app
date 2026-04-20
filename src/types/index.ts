import { z } from 'zod';
import { historiaClinicaSchema } from '../schemas/historiaClinicaSchema';

// ── Tipo central derivado del schema de Zod ──
export type HistoriaClinicaForm = z.infer<typeof historiaClinicaSchema>;

// ── Fila de seguimiento ──
export interface SeguimientoFila {
  fecha: string;
  tratamiento: string;
  diente: string;
  caras: string;
  observaciones: string;
  presupuesto: string;
  entrega: string;
}

// ── Registro del Dashboard (lo que trae el SELECT parcial) ──
export interface HistoriaResumen {
  id: string;
  created_at: string;
  fecha: string | null;
  nombre: string | null;
  dni: string | null;
  motivo_consulta: string | null;
  diagnostico: string | null;
}

// ── Resultado del guardado ──
export interface GuardarResultado {
  success: boolean;
  error?: unknown;
}

// ── Fila de la tabla historias_clinicas (SELECT *) ──
export interface HistoriaClinicaRow {
  id: string;
  created_at: string;
  user_id: string;
  fecha: string | null;
  nombre: string | null;
  dni: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  edad: number | null;
  telefono: string | null;
  direccion: string | null;
  email_paciente: string | null;
  obra_social: string | null;
  afiliado: string | null;
  motivo_consulta: string | null;
  cond_cardiopatias: boolean;
  cond_hipertension: boolean;
  cond_diabetes: boolean;
  cond_asma: boolean;
  cond_anemia: boolean;
  cond_tiroides: boolean;
  cond_epilepsia: boolean;
  cond_coagulacion: boolean;
  cond_embarazo: boolean;
  cond_autoinmunes: boolean;
  cond_autoinmunes_detalle: string | null;
  cond_otras: boolean;
  cond_otras_detalle: string | null;
  fuma: boolean;
  fuma_detalle: string | null;
  alcohol_rta: string | null;
  hilo_frec: string | null;
  enjuague_rta: string | null;
  encias_rta: string | null;
  sensibilidad_rta: string | null;
  bruxismo_rta: string | null;
  reacciones: boolean;
  reacciones_detalle: string | null;
  cepilla: string | null;
  hilo_dental2: string | null;
  enjuague2: string | null;
  encias2: string | null;
  tejidos: string | null;
  diagnostico: string | null;
}

// ── Fila de la tabla seguimiento_tratamiento (SELECT *) ──
export interface SeguimientoRow {
  id: string;
  created_at: string;
  historia_id: string;
  fecha: string | null;
  tratamiento: string | null;
  diente: string | null;
  caras: string | null;
  observaciones: string | null;
  presupuesto: number | null;
  entrega: number | null;
}

// ── Payload para INSERT/UPDATE de historias_clinicas ──
export interface HistoriaClinicaInsert {
  user_id: string;
  fecha: string | null;
  nombre: string | null;
  dni: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  edad: number | null;
  telefono: string | null;
  direccion: string | null;
  email_paciente: string | null;
  obra_social: string | null;
  afiliado: string | null;
  motivo_consulta: string | null;
  cond_cardiopatias: boolean;
  cond_hipertension: boolean;
  cond_diabetes: boolean;
  cond_asma: boolean;
  cond_anemia: boolean;
  cond_tiroides: boolean;
  cond_epilepsia: boolean;
  cond_coagulacion: boolean;
  cond_embarazo: boolean;
  cond_autoinmunes: boolean;
  cond_autoinmunes_detalle: string | null;
  cond_otras: boolean;
  cond_otras_detalle: string | null;
  fuma: boolean;
  fuma_detalle: string | null;
  alcohol_rta: string | null;
  hilo_frec: string | null;
  enjuague_rta: string | null;
  encias_rta: string | null;
  sensibilidad_rta: string | null;
  bruxismo_rta: string | null;
  reacciones: boolean;
  reacciones_detalle: string | null;
  cepilla: string | null;
  hilo_dental2: string | null;
  enjuague2: string | null;
  encias2: string | null;
  tejidos: string | null;
  diagnostico: string | null;
}

// ── Callback del login ──
export type OnLoginCallback = (email: string, userId: string) => void;
