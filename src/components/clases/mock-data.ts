export type EstadoClase = "programada" | "completada" | "cancelada" | "no_show"

export interface Vehiculo {
  id: string
  matricula: string
  modelo: string
  tipo: "coche" | "moto"
}

export interface Clase {
  id: string
  profesor_id: string
  alumno_id: string
  alumno_nombre: string
  alumno_apellidos: string
  vehiculo_id: string
  fecha: string // YYYY-MM-DD
  hora_inicio: string // HH:MM
  hora_fin: string // HH:MM
  estado: EstadoClase
  notas: string | null
}

export const VEHICULOS: Vehiculo[] = [
  { id: "v1", matricula: "1234 ABC", modelo: "Seat León", tipo: "coche" },
  { id: "v2", matricula: "5678 DEF", modelo: "Citroën C3", tipo: "coche" },
  { id: "v3", matricula: "9012 GHI", modelo: "Renault Clio", tipo: "coche" },
  { id: "v4", matricula: "3456 JKL", modelo: "Yamaha MT-07", tipo: "moto" },
]

export const ESTADO_LABELS: Record<EstadoClase, string> = {
  programada: "Programada",
  completada: "Completada",
  cancelada: "Cancelada",
  no_show: "No presentado",
}

export const ESTADO_COLORS: Record<EstadoClase, string> = {
  programada: "bg-blue-100 text-blue-800 border-blue-200",
  completada: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelada: "bg-red-100 text-red-800 border-red-200",
  no_show: "bg-amber-100 text-amber-800 border-amber-200",
}

export const ESTADO_DOT_COLORS: Record<EstadoClase, string> = {
  programada: "bg-blue-500",
  completada: "bg-emerald-500",
  cancelada: "bg-red-500",
  no_show: "bg-amber-500",
}

// Helper: get Monday of a given week offset from "today"
function getMonday(weekOffset: number): Date {
  const d = new Date(2026, 2, 20) // 2026-03-20 Friday — "today"
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff + weekOffset * 7)
  d.setHours(0, 0, 0, 0)
  return d
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function dayOfWeek(monday: Date, dayIndex: number): string {
  const d = new Date(monday)
  d.setDate(d.getDate() + dayIndex)
  return fmt(d)
}

const mon = getMonday(0) // current week Monday = 2026-03-16
const prevMon = getMonday(-1) // previous week Monday = 2026-03-09

export const MOCK_CLASES: Clase[] = [
  // === CURRENT WEEK (2026-03-16 to 2026-03-20) ===
  // Monday 16
  { id: "c01", profesor_id: "1", alumno_id: "1", alumno_nombre: "María", alumno_apellidos: "García López", vehiculo_id: "v1", fecha: dayOfWeek(mon, 0), hora_inicio: "09:00", hora_fin: "10:00", estado: "completada", notas: "Buena clase. Mejorando en rotondas." },
  { id: "c02", profesor_id: "1", alumno_id: "8", alumno_nombre: "Diego", alumno_apellidos: "Navarro Torres", vehiculo_id: "v2", fecha: dayOfWeek(mon, 0), hora_inicio: "10:00", hora_fin: "11:00", estado: "completada", notas: null },
  { id: "c03", profesor_id: "2", alumno_id: "3", alumno_nombre: "Ana", alumno_apellidos: "Rodríguez Sánchez", vehiculo_id: "v4", fecha: dayOfWeek(mon, 0), hora_inicio: "09:00", hora_fin: "10:00", estado: "completada", notas: "Primera clase con moto. Buen equilibrio." },
  { id: "c04", profesor_id: "1", alumno_id: "2", alumno_nombre: "Juan", alumno_apellidos: "Pérez Martínez", vehiculo_id: "v1", fecha: dayOfWeek(mon, 0), hora_inicio: "12:00", hora_fin: "13:00", estado: "completada", notas: null },

  // Tuesday 17
  { id: "c05", profesor_id: "1", alumno_id: "5", alumno_nombre: "Laura", alumno_apellidos: "Martín González", vehiculo_id: "v3", fecha: dayOfWeek(mon, 1), hora_inicio: "08:00", hora_fin: "09:00", estado: "completada", notas: null },
  { id: "c06", profesor_id: "2", alumno_id: "7", alumno_nombre: "Sofía", alumno_apellidos: "Díaz Moreno", vehiculo_id: "v4", fecha: dayOfWeek(mon, 1), hora_inicio: "10:00", hora_fin: "11:00", estado: "no_show", notas: "No se presentó. Contactar por teléfono." },
  { id: "c07", profesor_id: "3", alumno_id: "1", alumno_nombre: "María", alumno_apellidos: "García López", vehiculo_id: "v2", fecha: dayOfWeek(mon, 1), hora_inicio: "11:00", hora_fin: "12:00", estado: "completada", notas: null },
  { id: "c08", profesor_id: "1", alumno_id: "10", alumno_nombre: "Alejandro", alumno_apellidos: "Romero Castro", vehiculo_id: "v1", fecha: dayOfWeek(mon, 1), hora_inicio: "16:00", hora_fin: "17:00", estado: "cancelada", notas: "Cancelada por lluvia intensa." },

  // Wednesday 18
  { id: "c09", profesor_id: "1", alumno_id: "1", alumno_nombre: "María", alumno_apellidos: "García López", vehiculo_id: "v1", fecha: dayOfWeek(mon, 2), hora_inicio: "09:00", hora_fin: "10:00", estado: "completada", notas: "Práctica de aparcamiento en batería." },
  { id: "c10", profesor_id: "2", alumno_id: "9", alumno_nombre: "Elena", alumno_apellidos: "Jiménez Vega", vehiculo_id: "v4", fecha: dayOfWeek(mon, 2), hora_inicio: "09:00", hora_fin: "10:00", estado: "completada", notas: null },
  { id: "c11", profesor_id: "5", alumno_id: "3", alumno_nombre: "Ana", alumno_apellidos: "Rodríguez Sánchez", vehiculo_id: "v4", fecha: dayOfWeek(mon, 2), hora_inicio: "11:00", hora_fin: "12:00", estado: "completada", notas: null },
  { id: "c12", profesor_id: "3", alumno_id: "2", alumno_nombre: "Juan", alumno_apellidos: "Pérez Martínez", vehiculo_id: "v3", fecha: dayOfWeek(mon, 2), hora_inicio: "15:00", hora_fin: "16:00", estado: "completada", notas: "Excelente conducción en autovía." },

  // Thursday 19
  { id: "c13", profesor_id: "1", alumno_id: "8", alumno_nombre: "Diego", alumno_apellidos: "Navarro Torres", vehiculo_id: "v2", fecha: dayOfWeek(mon, 3), hora_inicio: "08:00", hora_fin: "09:00", estado: "programada", notas: null },
  { id: "c14", profesor_id: "1", alumno_id: "5", alumno_nombre: "Laura", alumno_apellidos: "Martín González", vehiculo_id: "v1", fecha: dayOfWeek(mon, 3), hora_inicio: "10:00", hora_fin: "11:00", estado: "programada", notas: null },
  { id: "c15", profesor_id: "2", alumno_id: "7", alumno_nombre: "Sofía", alumno_apellidos: "Díaz Moreno", vehiculo_id: "v4", fecha: dayOfWeek(mon, 3), hora_inicio: "12:00", hora_fin: "13:00", estado: "programada", notas: "Recuperación de la clase del martes." },
  { id: "c16", profesor_id: "3", alumno_id: "10", alumno_nombre: "Alejandro", alumno_apellidos: "Romero Castro", vehiculo_id: "v1", fecha: dayOfWeek(mon, 3), hora_inicio: "17:00", hora_fin: "18:00", estado: "programada", notas: null },

  // Friday 20 (today)
  { id: "c17", profesor_id: "1", alumno_id: "1", alumno_nombre: "María", alumno_apellidos: "García López", vehiculo_id: "v1", fecha: dayOfWeek(mon, 4), hora_inicio: "09:00", hora_fin: "10:00", estado: "programada", notas: "Simulacro de examen práctico." },
  { id: "c18", profesor_id: "2", alumno_id: "3", alumno_nombre: "Ana", alumno_apellidos: "Rodríguez Sánchez", vehiculo_id: "v4", fecha: dayOfWeek(mon, 4), hora_inicio: "10:00", hora_fin: "11:00", estado: "programada", notas: null },
  { id: "c19", profesor_id: "5", alumno_id: "9", alumno_nombre: "Elena", alumno_apellidos: "Jiménez Vega", vehiculo_id: "v4", fecha: dayOfWeek(mon, 4), hora_inicio: "12:00", hora_fin: "13:00", estado: "programada", notas: null },
  { id: "c20", profesor_id: "1", alumno_id: "2", alumno_nombre: "Juan", alumno_apellidos: "Pérez Martínez", vehiculo_id: "v3", fecha: dayOfWeek(mon, 4), hora_inicio: "16:00", hora_fin: "17:00", estado: "programada", notas: null },

  // === PREVIOUS WEEK (2026-03-09 to 2026-03-13) ===
  { id: "c21", profesor_id: "1", alumno_id: "1", alumno_nombre: "María", alumno_apellidos: "García López", vehiculo_id: "v1", fecha: dayOfWeek(prevMon, 0), hora_inicio: "09:00", hora_fin: "10:00", estado: "completada", notas: null },
  { id: "c22", profesor_id: "2", alumno_id: "7", alumno_nombre: "Sofía", alumno_apellidos: "Díaz Moreno", vehiculo_id: "v4", fecha: dayOfWeek(prevMon, 1), hora_inicio: "10:00", hora_fin: "11:00", estado: "completada", notas: null },
  { id: "c23", profesor_id: "1", alumno_id: "8", alumno_nombre: "Diego", alumno_apellidos: "Navarro Torres", vehiculo_id: "v2", fecha: dayOfWeek(prevMon, 2), hora_inicio: "11:00", hora_fin: "12:00", estado: "completada", notas: null },
  { id: "c24", profesor_id: "3", alumno_id: "2", alumno_nombre: "Juan", alumno_apellidos: "Pérez Martínez", vehiculo_id: "v3", fecha: dayOfWeek(prevMon, 3), hora_inicio: "15:00", hora_fin: "16:00", estado: "cancelada", notas: "Alumno enfermo." },
  { id: "c25", profesor_id: "5", alumno_id: "9", alumno_nombre: "Elena", alumno_apellidos: "Jiménez Vega", vehiculo_id: "v4", fecha: dayOfWeek(prevMon, 4), hora_inicio: "09:00", hora_fin: "10:00", estado: "completada", notas: null },
]

export const PROFESORES_CLASES = [
  { id: "1", nombre: "Antonio", apellidos: "Ruiz Delgado" },
  { id: "2", nombre: "Carmen", apellidos: "Fernández Molina" },
  { id: "3", nombre: "Francisco", apellidos: "Gómez Serrano" },
  { id: "5", nombre: "Miguel", apellidos: "Santos Rivas" },
]

export const ALUMNOS_CLASES = [
  { id: "1", nombre: "María", apellidos: "García López" },
  { id: "2", nombre: "Juan", apellidos: "Pérez Martínez" },
  { id: "3", nombre: "Ana", apellidos: "Rodríguez Sánchez" },
  { id: "5", nombre: "Laura", apellidos: "Martín González" },
  { id: "7", nombre: "Sofía", apellidos: "Díaz Moreno" },
  { id: "8", nombre: "Diego", apellidos: "Navarro Torres" },
  { id: "9", nombre: "Elena", apellidos: "Jiménez Vega" },
  { id: "10", nombre: "Alejandro", apellidos: "Romero Castro" },
]
