import { z } from "zod"

// Spanish CIF: letter + 7 digits + letter/digit, or other formats
// Simplified: 1 letter + 8 digits, OR 8 digits + 1 letter
const cifRegex = /^[A-Z]\d{8}$|^\d{8}[A-Z]$/

export const autoescuelaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  direccion: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  email: z.string().email("Email inválido").nullable().optional().or(z.literal("")),
  cif: z
    .string()
    .regex(cifRegex, "CIF inválido (ej: B12345678 o 12345678A)")
    .nullable()
    .optional()
    .or(z.literal("")),
})

export type AutoescuelaFormData = z.infer<typeof autoescuelaSchema>
