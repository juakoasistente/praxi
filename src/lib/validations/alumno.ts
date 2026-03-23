import { z } from "zod"

export const alumnoSchema = z.object({
  codigo: z.string().nullable().optional(),
  sede_id: z.string().min(1, "La sede es obligatoria"),
  // Personal
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido1: z.string().min(1, "El primer apellido es obligatorio"),
  apellido2: z.string().nullable().optional(),
  dni: z.string().regex(/^\d{8}[A-Z]$/, "DNI inválido (ej: 12345678A)"),
  sexo: z.enum(["hombre", "mujer"]).nullable().optional(),
  fecha_nacimiento: z.string().optional(),
  pais_nacimiento: z.string().nullable().optional(),
  nacionalidad: z.string().nullable().optional(),
  estudios: z.string().nullable().optional(),
  telefono_fijo: z.string().nullable().optional(),
  telefono_movil: z.string().min(9, "Teléfono móvil debe tener al menos 9 dígitos"),
  email: z.string().email("Email inválido").nullable().optional().or(z.literal("")),
  foto_url: z.string().nullable().optional(),
  como_conocio: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  // Tutor
  tutor_nombre: z.string().nullable().optional(),
  tutor_apellidos: z.string().nullable().optional(),
  tutor_dni: z.string().nullable().optional(),
  tutor_relacion: z.string().nullable().optional(),
  // Address
  direccion: z.string().nullable().optional(),
  codigo_postal: z.string().nullable().optional(),
  poblacion: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  pais: z.string().nullable().optional(),
  // Billing
  facturacion_diferente: z.boolean().default(false),
  facturacion_nif: z.string().nullable().optional(),
  facturacion_nombre: z.string().nullable().optional(),
  facturacion_direccion: z.string().nullable().optional(),
  // Banking
  titular_cuenta: z.string().nullable().optional(),
  iban: z.string().nullable().optional(),
  fecha_mandato_sepa: z.string().nullable().optional(),
  // Enrollment
  permiso: z.enum(["AM", "A1", "A2", "A", "B", "C", "D"]),
  estado: z.enum(["matriculado", "en_curso", "teorico_aprobado", "practico_aprobado", "completado", "baja"]),
  fecha_matricula: z.string().min(1, "La fecha de matrícula es obligatoria"),
  notas: z.string().nullable().optional(),
  // Backward compat
  apellidos: z.string().optional(),
  telefono: z.string().optional(),
})

export type AlumnoValidation = z.infer<typeof alumnoSchema>
