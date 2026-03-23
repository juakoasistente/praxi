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
  codigo: string | null // auto-generated code
  sede_id: string
  // Personal
  nombre: string
  apellido1: string // primer apellido
  apellido2: string | null // segundo apellido
  dni: string
  sexo: "hombre" | "mujer" | null
  fecha_nacimiento: string
  pais_nacimiento: string | null
  nacionalidad: string | null
  estudios: string | null
  telefono_fijo: string | null
  telefono_movil: string
  email: string | null
  foto_url: string | null
  como_conocio: string | null // internet, recomendación, etc.
  observaciones: string | null
  // Tutor (if minor)
  tutor_nombre: string | null
  tutor_apellidos: string | null
  tutor_dni: string | null
  tutor_relacion: string | null // padre/madre/tutor
  // Address
  direccion: string | null
  codigo_postal: string | null
  poblacion: string | null
  provincia: string | null
  pais: string | null
  // Billing (optional)
  facturacion_diferente: boolean
  facturacion_nif: string | null
  facturacion_nombre: string | null
  facturacion_direccion: string | null
  // Banking (optional)
  titular_cuenta: string | null
  iban: string | null
  fecha_mandato_sepa: string | null
  // Enrollment
  permiso: PermisoType
  estado: EstadoAlumno
  fecha_matricula: string
  notas: string | null
  // Keep backward compat
  apellidos: string // computed from apellido1 + apellido2
  telefono: string // mapped to telefono_movil
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

export const ESTUDIOS_OPTIONS = [
  { value: "sin_estudios", label: "Sin estudios" },
  { value: "primarios", label: "Primarios" },
  { value: "secundarios", label: "Secundarios" },
  { value: "bachillerato", label: "Bachillerato" },
  { value: "fp", label: "Formación Profesional" },
  { value: "universitarios", label: "Universitarios" },
]

export const COMO_CONOCIO_OPTIONS = [
  { value: "internet", label: "Internet" },
  { value: "recomendacion", label: "Recomendación" },
  { value: "publicidad", label: "Publicidad" },
  { value: "redes_sociales", label: "Redes sociales" },
  { value: "otros", label: "Otros" },
]

export const RELACION_TUTOR_OPTIONS = [
  { value: "padre", label: "Padre" },
  { value: "madre", label: "Madre" },
  { value: "tutor_legal", label: "Tutor legal" },
]
