import { z } from "zod"

export const costeVehiculoSchema = z.object({
  concepto: z.string().min(1, "El concepto es obligatorio"),
  importe: z.number().positive("El importe debe ser mayor que 0"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  categoria: z.enum(["mantenimiento", "seguro", "itv", "combustible", "reparacion", "otro"]),
})

export type CosteVehiculoValidation = z.infer<typeof costeVehiculoSchema>
