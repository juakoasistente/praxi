"use client"

import { useMemo } from "react"
import { Calendar, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RegistroFichaje } from "./types"

interface ResumenSemanaProps {
  registros: RegistroFichaje[]
  fechaActual: Date
  empleadoId?: string
  className?: string
}

interface ResumenDiario {
  fecha: string
  fechaCompleta: Date
  diaSemana: string
  horasTrabajadas: number // minutos
  horasPausa: number // minutos
  horasNetas: number // minutos
  primeraEntrada?: string
  ultimaSalida?: string
  registrosCount: number
  esFestivo?: boolean
}

export function ResumenSemana({ registros, fechaActual, empleadoId, className }: ResumenSemanaProps) {
  const resumenSemana = useMemo(() => {
    // Calcular el rango de la semana (Lunes a Domingo)
    const fechaBase = new Date(fechaActual)
    const diaActual = fechaBase.getDay() // 0 = Domingo, 1 = Lunes, etc.
    const diasParaLunes = diaActual === 0 ? -6 : -(diaActual - 1) // Ajustar para que Lunes sea el primer día

    const inicioSemana = new Date(fechaBase)
    inicioSemana.setDate(fechaBase.getDate() + diasParaLunes)
    inicioSemana.setHours(0, 0, 0, 0)

    const resumenDias: ResumenDiario[] = []

    // Generar resumen para cada día de la semana
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana)
      fecha.setDate(inicioSemana.getDate() + i)

      const fechaStr = fecha.toISOString().split('T')[0]

      // Filtrar registros del día y empleado específico
      const registrosDia = registros.filter(r => {
        const registroFecha = r.timestamp.split('T')[0]
        const matchFecha = registroFecha === fechaStr
        const matchEmpleado = !empleadoId || r.usuario_id === empleadoId
        return matchFecha && matchEmpleado
      }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      // Calcular estadísticas del día
      let tiempoTrabajo = 0
      let tiempoPausa = 0
      let estadoActual: "fuera" | "trabajando" | "en_pausa" = "fuera"
      let inicioBloque: Date | null = null
      let primeraEntrada: string | undefined
      let ultimaSalida: string | undefined

      for (const registro of registrosDia) {
        const tiempoRegistro = new Date(registro.timestamp)

        if (registro.tipo === "entrada") {
          if (!primeraEntrada) {
            primeraEntrada = tiempoRegistro.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit"
            })
          }

          if (estadoActual === "en_pausa" && inicioBloque) {
            // Finalizar pausa
            tiempoPausa += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "trabajando"
          inicioBloque = tiempoRegistro
        } else if (registro.tipo === "salida") {
          ultimaSalida = tiempoRegistro.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
          })

          if (estadoActual === "trabajando" && inicioBloque) {
            tiempoTrabajo += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "fuera"
          inicioBloque = null
        } else if (registro.tipo === "pausa_inicio") {
          if (estadoActual === "trabajando" && inicioBloque) {
            tiempoTrabajo += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "en_pausa"
          inicioBloque = tiempoRegistro
        } else if (registro.tipo === "pausa_fin") {
          if (estadoActual === "en_pausa" && inicioBloque) {
            tiempoPausa += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "trabajando"
          inicioBloque = tiempoRegistro
        }
      }

      const esFinDeSemana = fecha.getDay() === 0 || fecha.getDay() === 6

      resumenDias.push({
        fecha: fechaStr,
        fechaCompleta: fecha,
        diaSemana: fecha.toLocaleDateString("es-ES", { weekday: "short" }),
        horasTrabajadas: Math.round(tiempoTrabajo / (1000 * 60)),
        horasPausa: Math.round(tiempoPausa / (1000 * 60)),
        horasNetas: Math.round(tiempoTrabajo / (1000 * 60)),
        primeraEntrada,
        ultimaSalida,
        registrosCount: registrosDia.length,
        esFestivo: esFinDeSemana
      })
    }

    return resumenDias
  }, [registros, fechaActual, empleadoId])

  const totales = useMemo(() => {
    return resumenSemana.reduce(
      (acc, dia) => ({
        horasTrabajadas: acc.horasTrabajadas + dia.horasNetas,
        horasPausa: acc.horasPausa + dia.horasPausa,
        diasTrabajados: acc.diasTrabajados + (dia.horasNetas > 0 ? 1 : 0)
      }),
      { horasTrabajadas: 0, horasPausa: 0, diasTrabajados: 0 }
    )
  }, [resumenSemana])

  const formatTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    if (horas === 0) return `${mins}m`
    if (mins === 0) return `${horas}h`
    return `${horas}h ${mins}m`
  }

  const getEstadoBadge = (dia: ResumenDiario) => {
    if (dia.esFestivo) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Festivo</Badge>
    }
    if (dia.horasNetas === 0) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Sin fichar</Badge>
    }
    if (dia.horasNetas < 360) { // Menos de 6 horas
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Parcial</Badge>
    }
    return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completo</Badge>
  }

  const esHoy = (fecha: Date) => {
    const hoy = new Date()
    return fecha.toDateString() === hoy.toDateString()
  }

  const fechaInicioSemana = resumenSemana[0]?.fechaCompleta
  const fechaFinSemana = resumenSemana[6]?.fechaCompleta

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Resumen de la semana</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {fechaInicioSemana?.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} -
            {fechaFinSemana?.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas totales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatTiempo(totales.horasTrabajadas)}
            </p>
            <p className="text-sm text-muted-foreground">Total trabajado</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">
              {totales.diasTrabajados}
            </p>
            <p className="text-sm text-muted-foreground">Días trabajados</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-700">
              {Math.round((totales.horasTrabajadas / 60) / totales.diasTrabajados || 0)}h
            </p>
            <p className="text-sm text-muted-foreground">Media diaria</p>
          </div>
        </div>

        {/* Tabla semanal */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Día</TableHead>
                <TableHead className="w-24">Fecha</TableHead>
                <TableHead className="hidden sm:table-cell">Entrada</TableHead>
                <TableHead className="hidden sm:table-cell">Salida</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead className="w-24">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumenSemana.map((dia) => (
                <TableRow
                  key={dia.fecha}
                  className={`${esHoy(dia.fechaCompleta) ? "bg-primary/5 border-primary/20" : ""} ${
                    dia.esFestivo ? "bg-muted/30" : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    {dia.diaSemana}
                    {esHoy(dia.fechaCompleta) && (
                      <Badge variant="secondary" className="ml-1 text-xs">Hoy</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dia.fechaCompleta.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {dia.primeraEntrada || "-"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {dia.ultimaSalida || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {dia.horasNetas > 0 ? formatTiempo(dia.horasNetas) : "-"}
                    {dia.horasPausa > 0 && (
                      <div className="text-xs text-muted-foreground">
                        +{formatTiempo(dia.horasPausa)} pausa
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getEstadoBadge(dia)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <span>Completo (6h+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded"></div>
            <span>Parcial (&lt;6h)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span>Festivo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded"></div>
            <span>Sin fichar</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}