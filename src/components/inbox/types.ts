export type CanalMensaje = "whatsapp" | "instagram" | "email"
export type EstadoConversacion = "nueva" | "abierta" | "pendiente" | "cerrada"
export type PrioridadConversacion = "alta" | "media" | "baja"

export interface Mensaje {
  id: string
  conversacion_id: string
  contenido: string
  fecha: string
  es_entrante: boolean
  leido: boolean
  adjuntos: Adjunto[] | null
}

export interface Adjunto {
  nombre: string
  tipo: string
  url: string
}

export interface Conversacion {
  id: string
  canal: CanalMensaje
  contacto_nombre: string
  contacto_telefono: string | null
  contacto_email: string | null
  contacto_instagram: string | null
  alumno_id: string | null
  estado: EstadoConversacion
  prioridad: PrioridadConversacion
  asignado_a: string | null
  ultimo_mensaje: string
  ultimo_mensaje_fecha: string
  mensajes_no_leidos: number
  etiquetas: string[]
}

export const CANAL_LABELS: Record<CanalMensaje, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  email: "Email",
}

export const CANAL_COLORS: Record<CanalMensaje, string> = {
  whatsapp: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  instagram: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  email: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

export const ESTADO_CONV_LABELS: Record<EstadoConversacion, string> = {
  nueva: "Nueva",
  abierta: "Abierta",
  pendiente: "Pendiente",
  cerrada: "Cerrada",
}

export const ESTADO_CONV_COLORS: Record<EstadoConversacion, string> = {
  nueva: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  abierta: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pendiente: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  cerrada: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export const PRIORIDAD_LABELS: Record<PrioridadConversacion, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
}

export const PRIORIDAD_COLORS: Record<PrioridadConversacion, string> = {
  alta: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  media: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  baja: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}
