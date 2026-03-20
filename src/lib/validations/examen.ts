import { z } from "zod"

export const examenSchema = z.object({
  alumno_nombre: z.string().min(1, "El nombre del alumno es obligatorio"),
  tipo: z.enum(["teorico", "practico"]),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  intento: z.number().int().positive("El intento debe ser un número positivo"),
  resultado: z.enum(["pendiente", "aprobado", "suspendido", "no_presentado"]),
})

export type ExamenValidation = z.infer<typeof examenSchema>
