"use client"

import { useMemo } from "react"
import { Clock, Coffee, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RegistroFichaje, TipoPausa } from "./types"

interface TimelineDiaProps {
  registros: RegistroFichaje[]
  fecha: string
  empleadoNombre?: string
  className?: string
}

interface BloqueTiempo {
  tipo: "trabajo" | "pausa" | "fuera"
  inicio: Date
  fin: Date
  tipoPausa?: TipoPausa
  notas?: string
}

export function TimelineDia({ registros, fecha, empleadoNombre, className }: TimelineDiaProps) {
  const bloques = useMemo(() => {
    if (registros.length === 0) return []

    const sortedRegistros = registros
      .filter(r => r.timestamp.startsWith(fecha))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    if (sortedRegistros.length === 0) return []

    const bloquesCalculados: BloqueTiempo[] = []
    let estadoActual: "fuera" | "trabajando" | "en_pausa" = "fuera"
    let inicioBloque: Date | null = null
    let tipoPausaActual: TipoPausa | undefined

    // Añadir bloque inicial "fuera" desde las 7:00 hasta la primera entrada
    const primerRegistro = sortedRegistros[0]
    const inicio7am = new Date(fecha + "T07:00:00")
    const primerTiempo = new Date(primerRegistro.timestamp)

    if (primerTiempo > inicio7am) {
      bloquesCalculados.push({
        tipo: "fuera",
        inicio: inicio7am,
        fin: primerTiempo
      })
    }

    for (const registro of sortedRegistros) {
      const tiempoRegistro = new Date(registro.timestamp)

      if (registro.tipo === "entrada") {
        // Cambiar a trabajando
        if (estadoActual === "en_pausa" && inicioBloque) {
          // Finalizar pausa
          bloquesCalculados.push({
            tipo: "pausa",
            inicio: inicioBloque,
            fin: tiempoRegistro,
            tipoPausa: tipoPausaActual
          })
        }
        estadoActual = "trabajando"
        inicioBloque = tiempoRegistro
      } else if (registro.tipo === "salida") {
        // Finalizar trabajo
        if (estadoActual === "trabajando" && inicioBloque) {
          bloquesCalculados.push({
            tipo: "trabajo",
            inicio: inicioBloque,
            fin: tiempoRegistro
          })
        }
        estadoActual = "fuera"
        inicioBloque = tiempoRegistro
      } else if (registro.tipo === "pausa_inicio") {
        // Finalizar trabajo e iniciar pausa
        if (estadoActual === "trabajando" && inicioBloque) {
          bloquesCalculados.push({
            tipo: "trabajo",
            inicio: inicioBloque,
            fin: tiempoRegistro
          })
        }
        estadoActual = "en_pausa"
        inicioBloque = tiempoRegistro
        tipoPausaActual = registro.tipo_pausa || "otro"
      } else if (registro.tipo === "pausa_fin") {
        // Finalizar pausa e iniciar trabajo
        if (estadoActual === "en_pausa" && inicioBloque) {
          bloquesCalculados.push({
            tipo: "pausa",
            inicio: inicioBloque,
            fin: tiempoRegistro,
            tipoPausa: tipoPausaActual
          })
        }
        estadoActual = "trabajando"
        inicioBloque = tiempoRegistro
      }
    }

    // Si hay un bloque abierto al final del día, cerrarlo a las 22:00
    const fin10pm = new Date(fecha + "T22:00:00")
    if (inicioBloque && estadoActual !== "fuera") {
      const tipoBloque = estadoActual === "trabajando" ? "trabajo" : "pausa"
      bloquesCalculados.push({
        tipo: tipoBloque,
        inicio: inicioBloque,
        fin: fin10pm,
        tipoPausa: estadoActual === "en_pausa" ? tipoPausaActual : undefined
      })
    }

    return bloquesCalculados
  }, [registros, fecha])

  const estadisticas = useMemo(() => {
    let tiempoTrabajo = 0
    let tiempoPausa = 0

    bloques.forEach(bloque => {
      const duracion = bloque.fin.getTime() - bloque.inicio.getTime()
      if (bloque.tipo === "trabajo") {
        tiempoTrabajo += duracion
      } else if (bloque.tipo === "pausa") {
        tiempoPausa += duracion
      }
    })

    return {
      horasTrabajadas: Math.round(tiempoTrabajo / (1000 * 60)),
      minutosConPausa: Math.round((tiempoTrabajo + tiempoPausa) / (1000 * 60)),
      minutosPausa: Math.round(tiempoPausa / (1000 * 60)),
      horasNetas: Math.round(tiempoTrabajo / (1000 * 60))
    }
  }, [bloques])

  const formatTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas}h ${mins}m`
  }

  const getTipoPausaLabel = (tipo?: TipoPausa) => {
    switch (tipo) {
      case "cafe": return "Café"
      case "comida": return "Comida"
      case "personal": return "Personal"
      case "otro": return "Otro"
      default: return "Pausa"
    }
  }

  const getColorBloque = (tipo: string, tipoPausa?: TipoPausa) => {
    switch (tipo) {
      case "trabajo": return "bg-green-500"
      case "pausa":
        switch (tipoPausa) {
          case "cafe": return "bg-yellow-500"
          case "comida": return "bg-orange-500"
          case "personal": return "bg-purple-500"
          default: return "bg-yellow-400"
        }
      default: return "bg-gray-200"
    }
  }

  // Rango de tiempo para mostrar (7:00 a 22:00)
  const inicioRango = new Date(fecha + "T07:00:00")
  const finRango = new Date(fecha + "T22:00:00")
  const duracionTotal = finRango.getTime() - inicioRango.getTime()

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Timeline del día
          {empleadoNombre && (
            <Badge variant="outline" className="ml-2">
              {empleadoNombre}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas resumen */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="font-semibold text-green-700">
              {formatTiempo(estadisticas.horasNetas)}
            </p>
            <p className="text-green-600 text-xs">Trabajadas</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <p className="font-semibold text-yellow-700">
              {formatTiempo(estadisticas.minutosPausa)}
            </p>
            <p className="text-yellow-600 text-xs">Pausa</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="font-semibold text-blue-700">
              {formatTiempo(estadisticas.minutosConPausa)}
            </p>
            <p className="text-blue-600 text-xs">Total</p>
          </div>
        </div>

        {/* Timeline visual */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>07:00</span>
            <span>15:00</span>
            <span>22:00</span>
          </div>

          <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
            {bloques.map((bloque, index) => {
              const inicioRelativo = (bloque.inicio.getTime() - inicioRango.getTime()) / duracionTotal
              const duracionRelativa = (bloque.fin.getTime() - bloque.inicio.getTime()) / duracionTotal
              const leftPercentage = Math.max(0, Math.min(100, inicioRelativo * 100))
              const widthPercentage = Math.max(0, Math.min(100 - leftPercentage, duracionRelativa * 100))

              return (
                <div
                  key={index}
                  className={`absolute h-full ${getColorBloque(bloque.tipo, bloque.tipoPausa)} hover:opacity-80 transition-opacity group`}
                  style={{
                    left: `${leftPercentage}%`,
                    width: `${widthPercentage}%`,
                  }}
                  title={`${bloque.tipo === "trabajo" ? "Trabajo" :
                    bloque.tipo === "pausa" ? getTipoPausaLabel(bloque.tipoPausa) : "Fuera"}: ${
                    bloque.inicio.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
                  } - ${
                    bloque.fin.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
                  }`}
                >
                  {/* Tooltip visible en hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {bloque.tipo === "trabajo" ? "Trabajo" :
                     bloque.tipo === "pausa" ? getTipoPausaLabel(bloque.tipoPausa) : "Fuera"}
                    <br />
                    {bloque.inicio.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} -
                    {bloque.fin.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Trabajo</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Café</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Comida</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Personal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Fuera</span>
            </div>
          </div>
        </div>

        {/* Lista de registros */}
        {registros.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Registros del día</h4>
            <div className="space-y-1">
              {registros
                .filter(r => r.timestamp.startsWith(fecha))
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((registro) => (
                  <div key={registro.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {registro.tipo === "entrada" && <User className="h-3 w-3 text-green-600" />}
                      {registro.tipo === "salida" && <User className="h-3 w-3 text-red-600" />}
                      {registro.tipo.startsWith("pausa") && <Coffee className="h-3 w-3 text-yellow-600" />}
                      <span>
                        {registro.tipo === "entrada" && "Entrada"}
                        {registro.tipo === "salida" && "Salida"}
                        {registro.tipo === "pausa_inicio" && `Inicio pausa (${getTipoPausaLabel(registro.tipo_pausa ?? undefined)})`}
                        {registro.tipo === "pausa_fin" && "Fin pausa"}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(registro.timestamp).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}