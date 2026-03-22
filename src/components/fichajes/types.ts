export type TipoRegistro = "entrada" | "salida" | "pausa_inicio" | "pausa_fin"
export type TipoPausa = "cafe" | "comida" | "personal" | "otro"
export type TipoIncidencia = "llegada_tarde" | "salida_anticipada" | "ausencia_justificada" | "ausencia_injustificada" | "teletrabajo" | "otro"
export type EstadoEmpleado = "fuera" | "trabajando" | "en_pausa"

export interface RegistroFichaje {
  id: string
  usuario_id: string
  usuario_nombre: string
  tipo: TipoRegistro
  timestamp: string // ISO
  sede_id: string
  metodo: "manual" | "app"
  tipo_pausa?: TipoPausa | null
  notas?: string | null
}

export interface Incidencia {
  id: string
  usuario_id: string
  usuario_nombre: string
  fecha: string
  tipo: TipoIncidencia
  descripcion: string
  aprobada: boolean | null // null = pending
}

export interface ResumenDia {
  fecha: string
  entradas: RegistroFichaje[]
  salidas: RegistroFichaje[]
  pausas: { inicio: RegistroFichaje; fin: RegistroFichaje | null }[]
  horasTrabajadas: number // minutes
  horasPausa: number // minutes
  horasNetas: number // minutes
  incidencias: Incidencia[]
}

// Legacy types for backwards compatibility
export type RolUsuario = "admin" | "profesor" | "secretario"
export type TipoFichaje = "entrada" | "salida"
export type MetodoFichaje = "manual" | "app"

export interface Fichaje {
  id: string
  usuario_nombre: string
  usuario_apellidos: string
  usuario_rol: RolUsuario
  tipo: TipoFichaje
  timestamp: string // ISO string
  metodo: MetodoFichaje
  sede_id: string
}
