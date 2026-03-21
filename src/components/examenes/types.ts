export type TipoExamen = "teorico" | "practico"

export type ResultadoExamen =
  | "pendiente"
  | "aprobado"
  | "suspendido"
  | "no_presentado"

export interface Examen {
  id: string
  alumno_id: string
  alumno_nombre: string
  tipo: TipoExamen
  fecha: string
  hora: string | null
  convocatoria: string | null
  intento: number
  resultado: ResultadoExamen
  centro_examen: string | null
  notas: string | null
  sede_id: string
}

export const TIPO_LABELS: Record<TipoExamen, string> = {
  teorico: "Teórico",
  practico: "Práctico",
}

export const RESULTADO_LABELS: Record<ResultadoExamen, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  suspendido: "Suspendido",
  no_presentado: "No presentado",
}

export const RESULTADO_COLORS: Record<ResultadoExamen, string> = {
  pendiente: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  aprobado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  suspendido: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  no_presentado: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export const TIPOS_EXAMEN: TipoExamen[] = ["teorico", "practico"]
export const RESULTADOS: ResultadoExamen[] = [
  "pendiente",
  "aprobado",
  "suspendido",
  "no_presentado",
]
