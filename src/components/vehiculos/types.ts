import { Car, Bike, Truck, Bus } from "lucide-react"

export type TipoVehiculo = "turismo" | "motocicleta" | "camion" | "autobus" | "furgoneta"

export type EstadoVehiculo = "activo" | "en_taller" | "baja"

export interface Vehiculo {
  id: string
  marca: string
  modelo: string
  matricula: string
  tipo: TipoVehiculo
  año: number
  km_actuales: number
  fecha_adquisicion: string
  precio_adquisicion: number
  estado: EstadoVehiculo
  notas: string | null
  sede_id: string | null
}

export type CategoriaCoste =
  | "mantenimiento"
  | "seguro"
  | "itv"
  | "combustible"
  | "reparacion"
  | "otro"

export interface CosteVehiculo {
  id: string
  vehiculo_id: string
  concepto: string
  importe: number
  fecha: string
  categoria: CategoriaCoste
}

export const TIPO_LABELS: Record<TipoVehiculo, string> = {
  turismo: "Turismo",
  motocicleta: "Motocicleta",
  camion: "Camión",
  autobus: "Autobús",
  furgoneta: "Furgoneta",
}

export const TIPO_ICONS: Record<TipoVehiculo, typeof Car> = {
  turismo: Car,
  motocicleta: Bike,
  camion: Truck,
  autobus: Bus,
  furgoneta: Truck,
}

export const ESTADO_LABELS: Record<EstadoVehiculo, string> = {
  activo: "Activo",
  en_taller: "En taller",
  baja: "Baja",
}

export const ESTADO_COLORS: Record<EstadoVehiculo, string> = {
  activo: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  en_taller: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  baja: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export const CATEGORIA_COSTE_LABELS: Record<CategoriaCoste, string> = {
  mantenimiento: "Mantenimiento",
  seguro: "Seguro",
  itv: "ITV",
  combustible: "Combustible",
  reparacion: "Reparación",
  otro: "Otro",
}

export type TipoIncidencia = "averia" | "accidente" | "pinchazo" | "mecanico" | "otro"

export interface IncidenciaVehiculo {
  id: string
  vehiculo_id: string
  descripcion: string
  fecha: string
  tipo: TipoIncidencia
}

export const TIPO_INCIDENCIA_LABELS: Record<TipoIncidencia, string> = {
  averia: "Avería",
  accidente: "Accidente",
  pinchazo: "Pinchazo",
  mecanico: "Visita al mecánico",
  otro: "Otro",
}

export const TIPO_INCIDENCIA_COLORS: Record<TipoIncidencia, string> = {
  averia: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  accidente: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  pinchazo: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  mecanico: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  otro: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export const TIPOS_INCIDENCIA: TipoIncidencia[] = ["averia", "accidente", "pinchazo", "mecanico", "otro"]

export const TIPOS: TipoVehiculo[] = ["turismo", "motocicleta", "camion", "autobus", "furgoneta"]
export const ESTADOS: EstadoVehiculo[] = ["activo", "en_taller", "baja"]
export const CATEGORIAS_COSTE: CategoriaCoste[] = [
  "mantenimiento",
  "seguro",
  "itv",
  "combustible",
  "reparacion",
  "otro",
]
