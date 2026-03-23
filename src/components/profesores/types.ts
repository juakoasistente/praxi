export type TipoClaseProfesor = "teorico" | "practico" | "ambos"

export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado"

export interface FranjaHoraria {
  id: string
  dia: DiaSemana
  hora_inicio: string // "09:00", "09:15", "09:30", "09:45" etc.
  hora_fin: string // "14:00", "14:15", "14:30" etc.
  sede_id: string // en qué sede trabaja esa franja
}

export interface Profesor {
  id: string
  nombre: string
  primer_apellido: string
  segundo_apellido: string
  sexo: "hombre" | "mujer"
  dni: string
  direccion: string
  codigo_postal: string
  poblacion: string
  municipio: string
  provincia: string
  telefono_fijo: string
  telefono_movil: string
  email: string
  vehiculo_asignado?: string
  fecha_permiso_a?: string
  permitir_solapamiento: boolean
  observaciones: string
  permisos_habilitados: string[]
  activo: boolean
  sedes: string[] // array of sede_ids (N:M relationship)
  tipo_clase: TipoClaseProfesor
  horario: FranjaHoraria[]

  // Legacy field for backwards compatibility
  apellidos?: string
  telefono?: string
}

// Helper constants and labels
export const TIPO_CLASE_LABELS: Record<TipoClaseProfesor, string> = {
  teorico: "Teórico",
  practico: "Práctico",
  ambos: "Teórico y Práctico",
}

export const DIAS_SEMANA: DiaSemana[] = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]

export const DIA_LABELS: Record<DiaSemana, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado"
}
