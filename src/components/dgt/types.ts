export type TipoTramite = "alta_alumno" | "presentacion_teorico" | "presentacion_practico" | "expedicion_carnet" | "renovacion" | "duplicado"
export type EstadoTramite = "pendiente" | "en_proceso" | "completado" | "rechazado"

export interface TramiteDGT {
  id: string
  alumno_id: string
  alumno_nombre: string
  tipo: TipoTramite
  estado: EstadoTramite
  fecha_inicio: string
  fecha_resolucion: string | null
  numero_expediente: string | null
  centro_dgt: string
  documentos: string[]
  documentos_entregados: string[]
  notas: string | null
  tasa_pagada: boolean
  importe_tasa: number
}

export const TIPO_TRAMITE_LABELS: Record<TipoTramite, string> = {
  alta_alumno: "Alta alumno",
  presentacion_teorico: "Presentación teórico",
  presentacion_practico: "Presentación práctico",
  expedicion_carnet: "Expedición carnet",
  renovacion: "Renovación",
  duplicado: "Duplicado",
}

export const TIPO_TRAMITE_COLORS: Record<TipoTramite, string> = {
  alta_alumno: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  presentacion_teorico: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  presentacion_practico: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  expedicion_carnet: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  renovacion: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  duplicado: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export const ESTADO_TRAMITE_LABELS: Record<EstadoTramite, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  completado: "Completado",
  rechazado: "Rechazado",
}

export const ESTADO_TRAMITE_COLORS: Record<EstadoTramite, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  en_proceso: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rechazado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export const TIPOS_TRAMITE: TipoTramite[] = ["alta_alumno", "presentacion_teorico", "presentacion_practico", "expedicion_carnet", "renovacion", "duplicado"]
export const ESTADOS_TRAMITE: EstadoTramite[] = ["pendiente", "en_proceso", "completado", "rechazado"]

export const DOCUMENTOS_POR_TIPO: Record<TipoTramite, string[]> = {
  alta_alumno: ["Fotografía carnet", "DNI (original + copia)", "Certificado médico", "Justificante tasa 790-062"],
  presentacion_teorico: ["DNI (original)", "Justificante tasa 790-062", "Certificado aptitud centro"],
  presentacion_practico: ["DNI (original)", "Justificante tasa 790-062", "Certificado teórico aprobado"],
  expedicion_carnet: ["DNI (original + copia)", "Fotografía carnet", "Certificado médico", "Justificante tasa 790-062", "Certificado práctico aprobado"],
  renovacion: ["DNI (original + copia)", "Fotografía carnet", "Certificado médico", "Carnet anterior", "Justificante tasa 790-062"],
  duplicado: ["DNI (original + copia)", "Fotografía carnet", "Denuncia por extravío/robo", "Justificante tasa 790-062"],
}
