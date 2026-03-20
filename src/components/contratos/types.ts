export type EstadoContrato = "borrador" | "enviado" | "firmado" | "cancelado"

export interface Contrato {
  id: string
  alumno_id: string
  alumno_nombre: string
  tipo_permiso: string
  fecha_creacion: string
  fecha_firma: string | null
  estado: EstadoContrato
  contenido: string
  firma_alumno: string | null
  firma_autoescuela: boolean
  importe_matricula: number
  importe_clases: number
  total: number
}

export const ESTADO_LABELS: Record<EstadoContrato, string> = {
  borrador: "Borrador",
  enviado: "Enviado",
  firmado: "Firmado",
  cancelado: "Cancelado",
}

export const ESTADO_COLORS: Record<EstadoContrato, string> = {
  borrador: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  enviado: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  firmado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export const ESTADOS_CONTRATO: EstadoContrato[] = ["borrador", "enviado", "firmado", "cancelado"]
