import { z } from 'zod';

export const historiaClinicaSchema = z.object({
  fecha: z.string().optional(),
  nombre: z.string().min(1, 'El nombre completo es obligatorio'),
  dni: z.string().optional(),
  sexo: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  edad: z.union([z.string(), z.number()]).optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  email: z.union([z.literal(''), z.string().email('Formato de email incorrecto')]).optional(),
  obraSocial: z.string().optional(),
  afiliado: z.string().optional(),
  motivoConsulta: z.string().optional(),
  
  // Antecedentes
  'cond_Cardiopatías': z.boolean().optional(),
  'cond_Hipertensión / Hipotensión': z.boolean().optional(),
  'cond_Diabetes': z.boolean().optional(),
  'cond_Asma': z.boolean().optional(),
  'cond_Anemia': z.boolean().optional(),
  'cond_Trastornos tiroideos': z.boolean().optional(),
  'cond_Epilepsia': z.boolean().optional(),
  'cond_Trastornos de coagulación': z.boolean().optional(),
  'cond_Embarazo': z.boolean().optional(),
  cond_autoinmunes: z.boolean().optional(),
  autoinmunes_detalle: z.string().optional(),
  cond_otras: z.boolean().optional(),
  otras_detalle: z.string().optional(),
  
  fuma: z.boolean().optional(),
  fuma_detalle: z.string().optional(),
  alcohol_rta: z.string().optional(),
  hilo_frec: z.string().optional(),
  enjuague_rta: z.string().optional(),
  encias_rta: z.string().optional(),
  sensibilidad_rta: z.string().optional(),
  bruxismo_rta: z.string().optional(),
  reacciones: z.boolean().optional(),
  reacciones_detalle: z.string().optional(),

  // Historia Odontológica
  cepilla: z.string().optional(),
  hiloDental2: z.string().optional(),
  enjuague2: z.string().optional(),
  encias2: z.string().optional(),
  tejidos: z.string().optional(),

  // Diagnóstico
  diagnostico: z.string().optional(),

  // Seguimiento
  seguimiento: z.array(z.object({
    fecha: z.string().default(''),
    tratamiento: z.string().default(''),
    diente: z.string().default(''),
    caras: z.string().default(''),
    observaciones: z.string().default(''),
    presupuesto: z.string().default(''),
    entrega: z.string().default(''),
  })).default([{ fecha: '', tratamiento: '', diente: '', caras: '', observaciones: '', presupuesto: '', entrega: '' }])
});
