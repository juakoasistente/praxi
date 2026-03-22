"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"
import type { Profesor } from "@/components/profesores/types"
import type { Clase } from "./mock-data"
import { cn } from "@/lib/utils"

interface DisponibilidadProfesorProps {
  profesor: Profesor
  fecha: string // YYYY-MM-DD
  horaInicio: string // HH:MM
  horaFin: string // HH:MM
  clases: Clase[] // Existing classes for this professor
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function getTimePosition(time: string, startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime)
  const timeMinutes = timeToMinutes(time)
  const totalMinutes = timeToMinutes(endTime) - startMinutes
  return ((timeMinutes - startMinutes) / totalMinutes) * 100
}

function getTimeWidth(startTime: string, endTime: string, rangeStart: string, rangeEnd: string): number {
  const start = Math.max(timeToMinutes(startTime), timeToMinutes(rangeStart))
  const end = Math.min(timeToMinutes(endTime), timeToMinutes(rangeEnd))
  const totalMinutes = timeToMinutes(rangeEnd) - timeToMinutes(rangeStart)
  return Math.max(0, (end - start) / totalMinutes * 100)
}

function getDayOfWeekFromDate(dateString: string): string {
  const date = new Date(dateString)
  const dayMap = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
  return dayMap[date.getDay()]
}

function formatTime(time: string): string {
  return time.slice(0, 5) // Remove seconds if present
}

export function DisponibilidadProfesor({
  profesor,
  fecha,
  horaInicio,
  horaFin,
  clases,
}: DisponibilidadProfesorProps) {
  const dayOfWeek = getDayOfWeekFromDate(fecha)

  // Get the franja for this day
  const franja = profesor.horario.find(f => f.dia === dayOfWeek)

  if (!franja) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">No disponible este día</span>
          </div>
          <p className="text-xs text-red-600 dark:text-red-500 mt-1">
            {profesor.nombre} no tiene horario configurado para este día de la semana.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Get classes for this professor on this date
  const profesorClasses = clases.filter(
    c => c.profesor_id === profesor.id &&
        c.fecha === fecha &&
        c.estado !== "cancelada"
  )

  // Check for conflicts with the selected time range
  const hasConflict = profesorClasses.some(clase => {
    const claseStart = timeToMinutes(clase.hora_inicio)
    const claseEnd = timeToMinutes(clase.hora_fin)
    const selectedStart = timeToMinutes(horaInicio)
    const selectedEnd = timeToMinutes(horaFin)

    return (selectedStart < claseEnd && selectedEnd > claseStart)
  })

  // Check if selected time is within the franja
  const selectedStart = timeToMinutes(horaInicio)
  const selectedEnd = timeToMinutes(horaFin)
  const franjaStart = timeToMinutes(franja.hora_inicio)
  const franjaEnd = timeToMinutes(franja.hora_fin)

  const withinFranja = selectedStart >= franjaStart && selectedEnd <= franjaEnd

  const conflictingClass = hasConflict
    ? profesorClasses.find(clase => {
        const claseStart = timeToMinutes(clase.hora_inicio)
        const claseEnd = timeToMinutes(clase.hora_fin)
        return (selectedStart < claseEnd && selectedEnd > claseStart)
      })
    : null

  const statusColor = hasConflict
    ? "border-red-200 bg-red-50 dark:bg-red-950/20"
    : !withinFranja
    ? "border-amber-200 bg-amber-50 dark:bg-amber-950/20"
    : "border-green-200 bg-green-50 dark:bg-green-950/20"

  const statusIcon = hasConflict || !withinFranja
    ? <AlertTriangle className="h-4 w-4" />
    : <Clock className="h-4 w-4" />

  const statusText = hasConflict
    ? "Conflicto detectado"
    : !withinFranja
    ? "Fuera del horario"
    : "Disponible"

  const statusTextColor = hasConflict
    ? "text-red-700 dark:text-red-400"
    : !withinFranja
    ? "text-amber-700 dark:text-amber-400"
    : "text-green-700 dark:text-green-400"

  const detailText = hasConflict && conflictingClass
    ? `Tiene clase con ${conflictingClass.alumno_nombre} ${conflictingClass.alumno_apellidos} de ${formatTime(conflictingClass.hora_inicio)} a ${formatTime(conflictingClass.hora_fin)}`
    : !withinFranja
    ? `Horario disponible: ${formatTime(franja.hora_inicio)} - ${formatTime(franja.hora_fin)}`
    : `Disponible de ${formatTime(franja.hora_inicio)} a ${formatTime(franja.hora_fin)}`

  return (
    <Card className={statusColor}>
      <CardContent className="p-3 space-y-3">
        <div className={cn("flex items-center gap-2", statusTextColor)}>
          {statusIcon}
          <span className="text-sm font-medium">{statusText}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {profesor.nombre}
          </Badge>
        </div>

        <p className={cn("text-xs", statusTextColor.replace("700", "600").replace("400", "500"))}>
          {detailText}
        </p>

        {/* Mini Timeline */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(franja.hora_inicio)}</span>
            <span>{formatTime(franja.hora_fin)}</span>
          </div>

          <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded">
            {/* Existing classes */}
            {profesorClasses.map((clase, index) => {
              const left = getTimePosition(clase.hora_inicio, franja.hora_inicio, franja.hora_fin)
              const width = getTimeWidth(clase.hora_inicio, clase.hora_fin, franja.hora_inicio, franja.hora_fin)

              return (
                <div
                  key={`${clase.id}-${index}`}
                  className="absolute top-0.5 bottom-0.5 bg-red-500 rounded text-white text-xs flex items-center justify-center"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                  }}
                  title={`Clase con ${clase.alumno_nombre} ${clase.alumno_apellidos} (${formatTime(clase.hora_inicio)}-${formatTime(clase.hora_fin)})`}
                >
                  <span className="truncate px-1">Ocupado</span>
                </div>
              )
            })}

            {/* Selected time range */}
            {withinFranja && (
              <div
                className={cn(
                  "absolute top-0.5 bottom-0.5 rounded border-2",
                  hasConflict
                    ? "bg-red-500/20 border-red-500"
                    : "bg-blue-500/30 border-blue-500"
                )}
                style={{
                  left: `${getTimePosition(horaInicio, franja.hora_inicio, franja.hora_fin)}%`,
                  width: `${getTimeWidth(horaInicio, horaFin, franja.hora_inicio, franja.hora_fin)}%`,
                }}
                title={`Horario seleccionado: ${formatTime(horaInicio)}-${formatTime(horaFin)}`}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}