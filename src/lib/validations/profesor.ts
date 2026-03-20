import { z } from "zod"

export const profesorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  permisos_habilitados: z.array(z.string()).min(1, "Selecciona al menos un permiso"),
  activo: z.boolean(),
})

export type ProfesorValidation = z.infer<typeof profesorSchema>
