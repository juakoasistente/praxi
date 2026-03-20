import { z } from "zod"

export const vehiculoSchema = z.object({
  marca: z.string().min(1, "La marca es obligatoria"),
  modelo: z.string().min(1, "El modelo es obligatorio"),
  matricula: z.string().regex(/^\d{4}\s?[A-Z]{3}$/, "Matrícula inválida (ej: 1234 BCD)"),
  tipo: z.enum(["turismo", "motocicleta", "camion", "autobus", "furgoneta"]),
  año: z.number().min(1990, "El año debe ser 1990 o posterior").max(new Date().getFullYear() + 1, `El año no puede superar ${new Date().getFullYear() + 1}`),
  km_actuales: z.number().min(0, "Los kilómetros no pueden ser negativos"),
  fecha_adquisicion: z.string().min(1, "La fecha de adquisición es obligatoria"),
  precio_adquisicion: z.number().min(0, "El precio no puede ser negativo"),
  estado: z.enum(["activo", "en_taller", "baja"]),
  notas: z.string().nullable().optional(),
})

export type VehiculoValidation = z.infer<typeof vehiculoSchema>
