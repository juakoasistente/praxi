import type { Notificacion } from "./types"
import { MOCK_EXAMENES } from "@/components/examenes/mock-data"
import { MOCK_FACTURAS } from "@/components/facturacion/mock-data"
import { MOCK_COSTES, MOCK_VEHICULOS } from "@/components/vehiculos/mock-data"
import { MOCK_CLASES } from "@/components/clases/mock-data"

const HOY = new Date(2026, 2, 20) // 2026-03-20

function diffDias(fecha: string): number {
  const d = new Date(fecha + "T00:00:00")
  return Math.round((d.getTime() - HOY.getTime()) / (1000 * 60 * 60 * 24))
}

function fechaRelativa(fecha: string): string {
  const d = diffDias(fecha)
  if (d === 0) return "Hoy"
  if (d === -1) return "Ayer"
  if (d === 1) return "Mañana"
  if (d > 1) return `En ${d} días`
  return `Hace ${Math.abs(d)} días`
}

function generarNotificaciones(): Notificacion[] {
  const notificaciones: Notificacion[] = []
  let id = 1

  // Exámenes próximos (pendientes, dentro de los próximos 7 días o hoy)
  MOCK_EXAMENES.filter(
    (e) => e.resultado === "pendiente" && diffDias(e.fecha) >= 0 && diffDias(e.fecha) <= 7
  ).forEach((examen) => {
    const dias = diffDias(examen.fecha)
    const cuando = dias === 0 ? "hoy" : dias === 1 ? "mañana" : `en ${dias} días`
    notificaciones.push({
      id: String(id++),
      tipo: "examen",
      prioridad: dias <= 1 ? "alta" : "media",
      titulo: "Examen próximo",
      descripcion: `${examen.alumno_nombre} tiene examen ${examen.tipo} ${cuando} a las ${examen.hora} en ${examen.centro_examen}`,
      fecha: new Date(HOY.getTime() - dias * 60 * 60 * 1000).toISOString(), // notificación generada horas antes
      leida: false,
      enlace: "/dashboard/examenes",
    })
  })

  // Facturas vencidas (alta prioridad)
  MOCK_FACTURAS.filter((f) => f.estado === "vencida").forEach((factura) => {
    notificaciones.push({
      id: String(id++),
      tipo: "factura",
      prioridad: "alta",
      titulo: "Factura vencida",
      descripcion: `${factura.numero} de ${factura.alumno_nombre} — ${factura.total.toFixed(2)} € vencida desde ${factura.fecha_vencimiento}`,
      fecha: new Date(HOY.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // hace 2 días
      leida: false,
      enlace: "/dashboard/facturacion",
    })
  })

  // Facturas pendientes > 30 días
  MOCK_FACTURAS.filter((f) => {
    if (f.estado !== "pendiente") return false
    const diasDesdeEmision = -diffDias(f.fecha_emision)
    return diasDesdeEmision > 30
  }).forEach((factura) => {
    notificaciones.push({
      id: String(id++),
      tipo: "factura",
      prioridad: "media",
      titulo: "Factura pendiente",
      descripcion: `${factura.numero} de ${factura.alumno_nombre} — ${factura.total.toFixed(2)} € pendiente desde ${factura.fecha_emision}`,
      fecha: new Date(HOY.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // ayer
      leida: true,
      enlace: "/dashboard/facturacion",
    })
  })

  // ITV próxima (simular basándose en costes ITV existentes)
  const costesItv = MOCK_COSTES.filter((c) => c.categoria === "itv")
  costesItv.forEach((coste) => {
    const vehiculo = MOCK_VEHICULOS.find((v) => v.id === coste.vehiculo_id)
    if (!vehiculo || vehiculo.estado === "baja") return
    // Simular que la próxima ITV es ~12 meses después de la última
    const ultimaItv = new Date(coste.fecha + "T00:00:00")
    const proximaItv = new Date(ultimaItv)
    proximaItv.setFullYear(proximaItv.getFullYear() + 1)
    const diasHastaItv = Math.round(
      (proximaItv.getTime() - HOY.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diasHastaItv <= 60 && diasHastaItv > 0) {
      notificaciones.push({
        id: String(id++),
        tipo: "itv",
        prioridad: diasHastaItv <= 15 ? "alta" : "baja",
        titulo: "ITV próxima",
        descripcion: `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.matricula}) — ITV ${fechaRelativa(proximaItv.toISOString().slice(0, 10))}`,
        fecha: new Date(HOY.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        leida: false,
        enlace: "/dashboard/vehiculos",
      })
    }
  })

  // Clases programadas mañana
  const manana = new Date(HOY)
  manana.setDate(manana.getDate() + 1)
  const mananaStr = manana.toISOString().slice(0, 10)
  // Since "today" is Friday 2026-03-20, mañana = Saturday, no classes.
  // Use today's classes instead for meaningful notifications
  const hoyStr = HOY.toISOString().slice(0, 10)
  const clasesHoy = MOCK_CLASES.filter(
    (c) => c.fecha === hoyStr && c.estado === "programada"
  )
  clasesHoy.slice(0, 2).forEach((clase) => {
    notificaciones.push({
      id: String(id++),
      tipo: "clase",
      prioridad: "baja",
      titulo: "Clase programada hoy",
      descripcion: `${clase.alumno_nombre} ${clase.alumno_apellidos} — ${clase.hora_inicio} a ${clase.hora_fin}`,
      fecha: new Date(HOY.getTime() - 12 * 60 * 60 * 1000).toISOString(), // esta mañana
      leida: false,
      enlace: "/dashboard/clases",
    })
  })

  // Clase programada para el lunes (próximo día hábil)
  const lunes = new Date(HOY)
  lunes.setDate(lunes.getDate() + 3) // viernes + 3 = lunes
  const lunesStr = lunes.toISOString().slice(0, 10)
  const clasesLunes = MOCK_CLASES.filter(
    (c) => c.fecha === lunesStr && c.estado === "programada"
  )
  if (clasesLunes.length > 0) {
    notificaciones.push({
      id: String(id++),
      tipo: "clase",
      prioridad: "baja",
      titulo: "Clases el lunes",
      descripcion: `${clasesLunes.length} clases programadas para el lunes`,
      fecha: new Date(HOY.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      leida: true,
      enlace: "/dashboard/clases",
    })
  }

  // General notification
  notificaciones.push({
    id: String(id++),
    tipo: "general",
    prioridad: "baja",
    titulo: "Bienvenido a Praxi",
    descripcion: "Sistema de notificaciones activado. Recibirás alertas de exámenes, facturas, ITV y clases.",
    fecha: new Date(HOY.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    leida: true,
  })

  return notificaciones.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )
}

export const MOCK_NOTIFICATIONS = generarNotificaciones()
