import { z } from "zod"

export const profesorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  primer_apellido: z.string().min(1, "El primer apellido es obligatorio"),
  segundo_apellido: z.string().optional(),
  sexo: z.enum(["hombre", "mujer"], { message: "Selecciona el sexo" }),
  dni: z.string().min(9, "El DNI es obligatorio").max(9, "El DNI debe tener 9 caracteres"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  codigo_postal: z.string().min(5, "El código postal es obligatorio"),
  poblacion: z.string().min(1, "La población es obligatoria"),
  municipio: z.string().min(1, "El municipio es obligatorio"),
  provincia: z.string().min(1, "La provincia es obligatoria"),
  telefono_fijo: z.string().optional(),
  telefono_movil: z.string().min(9, "El teléfono móvil es obligatorio"),
  email: z.string().email("Email inválido"),
  vehiculo_asignado: z.string().optional(),
  fecha_permiso_a: z.string().optional(),
  permitir_solapamiento: z.boolean(),
  observaciones: z.string(),
  permisos_habilitados: z.array(z.string()).min(1, "Selecciona al menos un permiso"),
  activo: z.boolean(),
})

export type ProfesorValidation = z.infer<typeof profesorSchema>
