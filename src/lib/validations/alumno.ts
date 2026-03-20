import { z } from "zod"

export const alumnoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  dni: z.string().regex(/^\d{8}[A-Z]$/, "DNI inválido (ej: 12345678A)"),
  email: z.string().email("Email inválido").nullable().optional().or(z.literal("")),
  telefono: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  direccion: z.string().nullable().optional(),
  permiso: z.enum(["AM", "A1", "A2", "A", "B", "C", "D"]),
  estado: z.enum(["matriculado", "en_curso", "teorico_aprobado", "practico_aprobado", "completado", "baja"]),
  fecha_matricula: z.string().min(1, "La fecha de matrícula es obligatoria"),
  notas: z.string().nullable().optional(),
})

export type AlumnoValidation = z.infer<typeof alumnoSchema>
