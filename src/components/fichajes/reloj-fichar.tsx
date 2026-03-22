"use client"

import { useState, useEffect } from "react"
import { Clock, Play, Square, Coffee, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TipoPausa, EstadoEmpleado, TipoRegistro } from "./types"

interface RelojFicharProps {
  estadoActual: EstadoEmpleado
  horaEntrada?: string
  horaPausa?: string
  tipoPausa?: TipoPausa
  onFichar: (tipo: TipoRegistro, tipoPausa?: TipoPausa) => void
}

export function RelojFichar({
  estadoActual,
  horaEntrada,
  horaPausa,
  tipoPausa,
  onFichar
}: RelojFicharProps) {
  const [horaActual, setHoraActual] = useState(new Date())
  const [mostrarSelectorPausa, setMostrarSelectorPausa] = useState(false)
  const [pausaSeleccionada, setPausaSeleccionada] = useState<TipoPausa>("cafe")

  useEffect(() => {
    const interval = setInterval(() => setHoraActual(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusText = () => {
    switch (estadoActual) {
      case "fuera":
        return "Fuera"
      case "trabajando":
        return horaEntrada ? `Trabajando desde las ${horaEntrada}` : "Trabajando"
      case "en_pausa":
        return horaPausa
          ? `En pausa (${getTipoPausaLabel(tipoPausa)}) desde las ${horaPausa}`
          : "En pausa"
      default:
        return "Desconocido"
    }
  }

  const getTipoPausaLabel = (tipo?: TipoPausa) => {
    switch (tipo) {
      case "cafe": return "café"
      case "comida": return "comida"
      case "personal": return "personal"
      case "otro": return "otro"
      default: return "pausa"
    }
  }

  const getStatusColor = () => {
    switch (estadoActual) {
      case "fuera": return "bg-red-100 text-red-700 border-red-200"
      case "trabajando": return "bg-green-100 text-green-700 border-green-200"
      case "en_pausa": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleFicharEntrada = () => {
    onFichar("entrada")
  }

  const handleFicharSalida = () => {
    onFichar("salida")
  }

  const handleIniciarPausa = () => {
    if (mostrarSelectorPausa) {
      onFichar("pausa_inicio", pausaSeleccionada)
      setMostrarSelectorPausa(false)
    } else {
      setMostrarSelectorPausa(true)
    }
  }

  const handleFinalizarPausa = () => {
    onFichar("pausa_fin")
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="py-8">
        {/* Reloj Digital */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">Hora actual</p>
          </div>
          <p className="text-6xl md:text-7xl font-bold tabular-nums tracking-tight text-primary mb-2">
            {horaActual.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {horaActual.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Estado Actual */}
        <div className="text-center mb-6">
          <Badge className={`text-sm px-3 py-1 ${getStatusColor()}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              estadoActual === "fuera" ? "bg-red-500" :
              estadoActual === "trabajando" ? "bg-green-500" : "bg-yellow-500"
            }`} />
            {getStatusText()}
          </Badge>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {estadoActual === "fuera" && (
            <Button
              size="lg"
              className="h-16 min-w-48 text-lg font-semibold bg-green-600 hover:bg-green-700"
              onClick={handleFicharEntrada}
            >
              <Play className="mr-2 size-6" />
              Fichar entrada
            </Button>
          )}

          {estadoActual === "trabajando" && (
            <>
              <Button
                size="lg"
                variant="outline"
                className="h-16 min-w-40 text-lg font-semibold border-yellow-300 hover:bg-yellow-50"
                onClick={handleIniciarPausa}
              >
                <Coffee className="mr-2 size-6" />
                Iniciar pausa
              </Button>
              <Button
                size="lg"
                className="h-16 min-w-40 text-lg font-semibold bg-red-600 hover:bg-red-700"
                onClick={handleFicharSalida}
              >
                <Square className="mr-2 size-6" />
                Fichar salida
              </Button>
            </>
          )}

          {estadoActual === "en_pausa" && (
            <Button
              size="lg"
              className="h-16 min-w-48 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
              onClick={handleFinalizarPausa}
            >
              <Pause className="mr-2 size-6" />
              Finalizar pausa
            </Button>
          )}
        </div>

        {/* Selector de tipo de pausa */}
        {mostrarSelectorPausa && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium mb-2 text-center">Tipo de pausa:</p>
            <div className="flex gap-2 justify-center mb-3">
              <Select value={pausaSeleccionada} onValueChange={(value) => setPausaSeleccionada(value as TipoPausa)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="comida">Comida</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                onClick={handleIniciarPausa}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Confirmar pausa
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMostrarSelectorPausa(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}