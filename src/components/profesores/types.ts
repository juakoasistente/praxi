export type TipoClaseProfesor = "teorico" | "practico" | "ambos"

export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado"

export interface FranjaHoraria {
  dia: DiaSemana
  hora_inicio: string // "09:00"
  hora_fin: string // "14:00"
}

export interface Profesor {
  id: string
  nombre: string
  apellidos: string
  email: string
  telefono: string
  permisos_habilitados: string[]
  activo: boolean
  sedes: string[] // array of sede_ids (N:M relationship)
  tipo_clase: TipoClaseProfesor
  horario: FranjaHoraria[]
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
