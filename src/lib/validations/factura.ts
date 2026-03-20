import { z } from "zod"

const lineaSchema = z.object({
  concepto: z.string().min(1, "El concepto es obligatorio"),
  descripcion: z.string(),
  cantidad: z.number().positive("La cantidad debe ser mayor que 0"),
  precio_unitario: z.number().positive("El precio debe ser mayor que 0"),
})

export const facturaSchema = z.object({
  numero: z.string().min(1, "El número de factura es obligatorio"),
  alumno_nombre: z.string().min(1, "El nombre del alumno es obligatorio"),
  fecha_emision: z.string().min(1, "La fecha de emisión es obligatoria"),
  fecha_vencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria"),
  lineas: z.array(lineaSchema).min(1, "Debe haber al menos una línea de factura"),
})

export type FacturaValidation = z.infer<typeof facturaSchema>
