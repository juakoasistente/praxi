import { z } from "zod"

export const incidenciaSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  tipo: z.enum(["averia", "accidente", "pinchazo", "mecanico", "otro"]),
})

export type IncidenciaValidation = z.infer<typeof incidenciaSchema>
