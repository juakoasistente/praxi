export type TipoNotificacion = "examen" | "factura" | "itv" | "clase" | "general"
export type PrioridadNotificacion = "alta" | "media" | "baja"

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  prioridad: PrioridadNotificacion
  titulo: string
  descripcion: string
  fecha: string
  leida: boolean
  enlace?: string
}
