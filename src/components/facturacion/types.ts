export type EstadoFactura =
  | "pendiente"
  | "pagada"
  | "parcial"
  | "vencida"
  | "anulada"

export type MetodoPago =
  | "efectivo"
  | "tarjeta"
  | "transferencia"
  | "domiciliacion"

export type ConceptoFactura =
  | "matricula"
  | "bono_clases"
  | "clase_suelta"
  | "examen"
  | "material"
  | "otro"

export interface LineaFactura {
  id: string
  concepto: ConceptoFactura
  descripcion: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Factura {
  id: string
  numero: string
  alumno_id: string
  alumno_nombre: string
  fecha_emision: string
  fecha_vencimiento: string
  lineas: LineaFactura[]
  total: number
  estado: EstadoFactura
  metodo_pago: MetodoPago | null
  fecha_pago: string | null
  notas: string | null
  sede_id: string
}

export const ESTADO_FACTURA_LABELS: Record<EstadoFactura, string> = {
  pendiente: "Pendiente",
  pagada: "Pagada",
  parcial: "Parcial",
  vencida: "Vencida",
  anulada: "Anulada",
}

export const ESTADO_FACTURA_COLORS: Record<EstadoFactura, string> = {
  pendiente: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  pagada: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  parcial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  vencida: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  anulada: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export const METODO_PAGO_LABELS: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  domiciliacion: "Domiciliación",
}

export const CONCEPTO_LABELS: Record<ConceptoFactura, string> = {
  matricula: "Matrícula",
  bono_clases: "Bono de clases",
  clase_suelta: "Clase suelta",
  examen: "Tasa de examen",
  material: "Material",
  otro: "Otro",
}

export interface PagoFactura {
  id: string
  factura_id: string
  importe: number
  fecha: string
  metodo_pago: MetodoPago
  notas: string | null
}

export const ESTADOS_FACTURA: EstadoFactura[] = [
  "pendiente",
  "pagada",
  "parcial",
  "vencida",
  "anulada",
]

export const METODOS_PAGO: MetodoPago[] = [
  "efectivo",
  "tarjeta",
  "transferencia",
  "domiciliacion",
]

export const CONCEPTOS: ConceptoFactura[] = [
  "matricula",
  "bono_clases",
  "clase_suelta",
  "examen",
  "material",
  "otro",
]
