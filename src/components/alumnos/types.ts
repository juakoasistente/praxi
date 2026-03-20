export type PermisoType = "AM" | "A1" | "A2" | "A" | "B" | "C" | "D"

export type EstadoAlumno =
  | "matriculado"
  | "en_curso"
  | "teorico_aprobado"
  | "practico_aprobado"
  | "completado"
  | "baja"

export interface Alumno {
  id: string
  nombre: string
  apellidos: string
  dni: string
  email: string | null
  telefono: string
  fecha_nacimiento: string
  direccion: string | null
  permiso: PermisoType
  estado: EstadoAlumno
  fecha_matricula: string
  notas: string | null
}

export const ESTADO_LABELS: Record<EstadoAlumno, string> = {
  matriculado: "Matriculado",
  en_curso: "En curso",
  teorico_aprobado: "Teórico aprobado",
  practico_aprobado: "Práctico aprobado",
  completado: "Completado",
  baja: "Baja",
}

export const ESTADO_COLORS: Record<EstadoAlumno, string> = {
  matriculado: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  en_curso: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  teorico_aprobado: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  practico_aprobado: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  completado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  baja: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export const PERMISOS: PermisoType[] = ["AM", "A1", "A2", "A", "B", "C", "D"]
export const ESTADOS: EstadoAlumno[] = [
  "matriculado",
  "en_curso",
  "teorico_aprobado",
  "practico_aprobado",
  "completado",
  "baja",
]
