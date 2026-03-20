import type { PlantillaWhatsApp, ConfigWhatsApp, HistorialEnvio } from "./types"

export const MOCK_PLANTILLAS: PlantillaWhatsApp[] = [
  {
    id: "wp1",
    nombre: "Recordatorio de clase",
    tipo: "recordatorio_clase",
    contenido: "Hola {{alumno_nombre}}, te recordamos que tienes clase mañana {{fecha_clase}} a las {{hora_clase}} con {{profesor_nombre}}. ¡No faltes! 🚗",
    variables: ["alumno_nombre", "fecha_clase", "hora_clase", "profesor_nombre"],
    estado: "activa",
    envios_totales: 234,
    ultimo_envio: "2026-03-19",
  },
  {
    id: "wp2",
    nombre: "Resultado de examen",
    tipo: "resultado_examen",
    contenido: "¡{{alumno_nombre}}! Tu resultado del examen {{tipo_examen}} ha sido: {{resultado}}. {{mensaje_extra}}",
    variables: ["alumno_nombre", "tipo_examen", "resultado", "mensaje_extra"],
    estado: "activa",
    envios_totales: 89,
    ultimo_envio: "2026-03-18",
  },
  {
    id: "wp3",
    nombre: "Aviso de pago pendiente",
    tipo: "aviso_pago",
    contenido: "Hola {{alumno_nombre}}, tienes una factura pendiente ({{numero_factura}}) por importe de {{importe}}€. Por favor, regulariza el pago.",
    variables: ["alumno_nombre", "numero_factura", "importe"],
    estado: "activa",
    envios_totales: 56,
    ultimo_envio: "2026-03-15",
  },
  {
    id: "wp4",
    nombre: "Bienvenida nuevo alumno",
    tipo: "bienvenida",
    contenido: "¡Bienvenido/a a {{autoescuela_nombre}}, {{alumno_nombre}}! 🎉 Estamos encantados de que empieces tu camino hacia el carnet {{permiso}}.",
    variables: ["autoescuela_nombre", "alumno_nombre", "permiso"],
    estado: "activa",
    envios_totales: 42,
    ultimo_envio: "2026-03-10",
  },
  {
    id: "wp5",
    nombre: "Plantilla personalizada",
    tipo: "personalizado",
    contenido: "",
    variables: [],
    estado: "borrador",
    envios_totales: 0,
    ultimo_envio: null,
  },
]

export const MOCK_CONFIG: ConfigWhatsApp = {
  activo: false,
  telefono_negocio: null,
  api_key: null,
  recordatorio_clase_horas: 24,
  recordatorio_examen_dias: 3,
  aviso_pago_dias: 5,
  enviar_bienvenida: true,
}

export const MOCK_HISTORIAL: HistorialEnvio[] = []
