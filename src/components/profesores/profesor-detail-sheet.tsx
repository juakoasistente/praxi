"use client"

import { Clock, Phone, Mail, MapPin, Calendar, GraduationCap, Edit, UserX, UserCheck } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Profesor } from "./types"
import { TIPO_CLASE_LABELS, DIA_LABELS, DIAS_SEMANA } from "./types"
import { MOCK_SEDES } from "@/components/sedes/mock-data"
import { cn } from "@/lib/utils"

interface ProfesorDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profesor: Profesor | null
  onEdit?: (profesor: Profesor) => void
  onToggleActive?: (profesor: Profesor) => void
}

// Colors for each sede
const SEDE_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-red-500",
]

// Generate hours from 7:00 to 22:00
const SCHEDULE_HOURS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 7
  return `${hour.toString().padStart(2, "0")}:00`
})

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function getTimePosition(time: string): number {
  const startMinutes = timeToMinutes("07:00")
  const timeMinutes = timeToMinutes(time)
  const totalMinutes = timeToMinutes("22:00") - startMinutes
  return ((timeMinutes - startMinutes) / totalMinutes) * 100
}

function getTimeWidth(startTime: string, endTime: string): number {
  const startPos = getTimePosition(startTime)
  const endPos = getTimePosition(endTime)
  return endPos - startPos
}

function getCurrentTimePosition(): number {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  return getTimePosition(currentTime)
}

export function ProfesorDetailSheet({
  open,
  onOpenChange,
  profesor,
  onEdit,
  onToggleActive,
}: ProfesorDetailSheetProps) {
  if (!profesor) return null

  const sedesAsignadas = MOCK_SEDES.filter(sede => profesor.sedes.includes(sede.id))
  const totalHorasSemanales = profesor.horario.reduce((total, franja) => {
    const start = timeToMinutes(franja.hora_inicio)
    const end = timeToMinutes(franja.hora_fin)
    return total + (end - start) / 60
  }, 0)

  const isToday = (dia: string) => {
    const today = new Date().getDay()
    const dayMap = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6 }
    return dayMap[dia as keyof typeof dayMap] === today
  }

  const currentTime = getCurrentTimePosition()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">
                {profesor.nombre} {profesor.apellidos}
              </SheetTitle>
              <SheetDescription>
                Detalles del profesor
              </SheetDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">
                {TIPO_CLASE_LABELS[profesor.tipo_clase]}
              </Badge>
              <Badge
                className={cn(
                  "border-0",
                  profesor.activo
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {profesor.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Información de contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profesor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profesor.telefono}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Permisos habilitados
                </div>
                <div className="flex flex-wrap gap-1">
                  {profesor.permisos_habilitados.map((permiso) => (
                    <Badge key={permiso} variant="secondary" className="text-xs">
                      {permiso}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Sedes asignadas
                </div>
                <div className="flex flex-wrap gap-1">
                  {sedesAsignadas.map((sede, index) => (
                    <Badge
                      key={sede.id}
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: `var(--tw-${SEDE_COLORS[index % SEDE_COLORS.length].replace('bg-', '')})`,
                        color: `var(--tw-${SEDE_COLORS[index % SEDE_COLORS.length].replace('bg-', '')})`
                      }}
                    >
                      {sede.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Horario semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="font-medium">Leyenda:</span>
                {sedesAsignadas.map((sede, index) => (
                  <div key={sede.id} className="flex items-center gap-1">
                    <div className={cn("w-3 h-3 rounded-sm", SEDE_COLORS[index % SEDE_COLORS.length])} />
                    <span>{sede.nombre}</span>
                  </div>
                ))}
              </div>

              {/* Schedule Grid */}
              <div className="space-y-2">
                {/* Hours header */}
                <div className="grid grid-cols-[80px_1fr] gap-2">
                  <div></div>
                  <div className="relative h-6">
                    {SCHEDULE_HOURS.filter((_, i) => i % 2 === 0).map((hour, i) => (
                      <div
                        key={hour}
                        className="absolute text-xs text-muted-foreground"
                        style={{ left: `${(i * 2) * (100 / 15)}%` }}
                      >
                        {hour}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Days rows */}
                {DIAS_SEMANA.map((dia) => {
                  const dayFranjas = profesor.horario.filter(f => f.dia === dia)
                  const todayClass = isToday(dia) ? "bg-blue-50 dark:bg-blue-950/20" : ""

                  return (
                    <div key={dia} className={cn("grid grid-cols-[80px_1fr] gap-2 p-2 rounded", todayClass)}>
                      <div className="text-sm font-medium py-2">
                        {DIA_LABELS[dia]}
                      </div>
                      <div className="relative h-8 bg-gray-50 dark:bg-gray-900 rounded border">
                        {/* Franjas */}
                        {dayFranjas.map((franja) => {
                          const sedeIndex = sedesAsignadas.findIndex(s => s.id === franja.sede_id)
                          const color = SEDE_COLORS[sedeIndex % SEDE_COLORS.length]
                          const left = getTimePosition(franja.hora_inicio)
                          const width = getTimeWidth(franja.hora_inicio, franja.hora_fin)

                          return (
                            <div
                              key={franja.id}
                              className={cn(
                                "absolute top-1 bottom-1 rounded text-white text-xs flex items-center justify-center font-medium",
                                color
                              )}
                              style={{
                                left: `${left}%`,
                                width: `${width}%`,
                              }}
                              title={`${franja.hora_inicio} - ${franja.hora_fin} (${sedesAsignadas.find(s => s.id === franja.sede_id)?.nombre})`}
                            >
                              <span className="truncate px-1">
                                {franja.hora_inicio}-{franja.hora_fin}
                              </span>
                            </div>
                          )
                        })}

                        {/* Current time indicator */}
                        {isToday(dia) && currentTime >= 0 && currentTime <= 100 && (
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                            style={{ left: `${currentTime}%` }}
                            title="Hora actual"
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Horas semanales</p>
                    <p className="text-2xl font-bold">{totalHorasSemanales}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total franjas</p>
                    <p className="text-2xl font-bold">{profesor.horario.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {onEdit && (
              <Button onClick={() => onEdit(profesor)} className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            {onToggleActive && (
              <Button
                variant={profesor.activo ? "destructive" : "default"}
                onClick={() => onToggleActive(profesor)}
                className="flex-1"
              >
                {profesor.activo ? (
                  <UserX className="h-4 w-4 mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                {profesor.activo ? "Desactivar" : "Activar"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}