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
