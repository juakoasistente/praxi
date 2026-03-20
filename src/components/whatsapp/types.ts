export type TipoPlantilla = "recordatorio_clase" | "resultado_examen" | "aviso_pago" | "bienvenida" | "personalizado"
export type EstadoPlantilla = "activa" | "inactiva" | "borrador"

export interface PlantillaWhatsApp {
  id: string
  nombre: string
  tipo: TipoPlantilla
  contenido: string
  variables: string[]
  estado: EstadoPlantilla
  envios_totales: number
  ultimo_envio: string | null
}

export interface ConfigWhatsApp {
  activo: boolean
  telefono_negocio: string | null
  api_key: string | null
  recordatorio_clase_horas: number
  recordatorio_examen_dias: number
  aviso_pago_dias: number
  enviar_bienvenida: boolean
}

export interface HistorialEnvio {
  id: string
  fecha: string
  alumno_nombre: string
  plantilla_nombre: string
  estado: "enviado" | "fallido" | "pendiente"
  telefono: string
}

export const TIPO_LABELS: Record<TipoPlantilla, string> = {
  recordatorio_clase: "Recordatorio clase",
  resultado_examen: "Resultado examen",
  aviso_pago: "Aviso de pago",
  bienvenida: "Bienvenida",
  personalizado: "Personalizado",
}

export const TIPO_COLORS: Record<TipoPlantilla, string> = {
  recordatorio_clase: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  resultado_examen: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  aviso_pago: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  bienvenida: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  personalizado: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export const ESTADO_PLANTILLA_LABELS: Record<EstadoPlantilla, string> = {
  activa: "Activa",
  inactiva: "Inactiva",
  borrador: "Borrador",
}

export const ESTADO_PLANTILLA_COLORS: Record<EstadoPlantilla, string> = {
  activa: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactiva: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  borrador: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
}
