"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { MOCK_ALUMNOS } from "@/components/alumnos/mock-data"
import { MOCK_VEHICULOS } from "@/components/vehiculos/mock-data"
import { MOCK_PROFESORES } from "@/components/profesores/mock-data"
import { MOCK_SEDES } from "@/components/sedes/mock-data"
import { type Clase, MOCK_CLASES } from "./mock-data"
import { DisponibilidadProfesor } from "./disponibilidad-profesor"
import type { Profesor } from "@/components/profesores/types"

const ALUMNO_OPTIONS = MOCK_ALUMNOS.map((a) => ({
  value: a.id,
  label: `${a.nombre} ${a.apellidos}`,
  sublabel: a.dni,
}))

const VEHICULO_OPTIONS = MOCK_VEHICULOS
  .filter((v) => v.estado !== "baja")
  .map((v) => ({
    value: v.id,
    label: `${v.marca} ${v.modelo}`,
    sublabel: v.matricula,
  }))

function getDayOfWeekFromDate(dateString: string): string {
  const date = new Date(dateString)
  const dayMap = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
  return dayMap[date.getDay()]
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function getProfesoresDisponibles(
  fecha: string,
  horaInicio: string,
  horaFin: string,
  profesores: Profesor[]
): {
  profesor: Profesor
  disponible: boolean
  franja: any | null
  conflicto: string | null
}[] {
  if (!fecha || !horaInicio || !horaFin) return []

  const dayOfWeek = getDayOfWeekFromDate(fecha)
  const selectedStart = timeToMinutes(horaInicio)
  const selectedEnd = timeToMinutes(horaFin)

  return profesores
    .filter(p => p.activo)
    .map(profesor => {
      // Check if professor has a franja for this day
      const franja = profesor.horario.find(f => f.dia === dayOfWeek)

      if (!franja) {
        return {
          profesor,
          disponible: false,
          franja: null,
          conflicto: "No trabaja este día"
        }
      }

      // Check if selected time is within franja
      const franjaStart = timeToMinutes(franja.hora_inicio)
      const franjaEnd = timeToMinutes(franja.hora_fin)
      const withinFranja = selectedStart >= franjaStart && selectedEnd <= franjaEnd

      if (!withinFranja) {
        return {
          profesor,
          disponible: false,
          franja,
          conflicto: `Horario: ${franja.hora_inicio}-${franja.hora_fin}`
        }
      }

      // Check for conflicts with existing classes
      const existingClasses = MOCK_CLASES.filter(
        c => c.profesor_id === profesor.id &&
            c.fecha === fecha &&
            c.estado !== "cancelada"
      )

      const hasConflict = existingClasses.some(clase => {
        const claseStart = timeToMinutes(clase.hora_inicio)
        const claseEnd = timeToMinutes(clase.hora_fin)
        return (selectedStart < claseEnd && selectedEnd > claseStart)
      })

      if (hasConflict) {
        const conflictingClass = existingClasses.find(clase => {
          const claseStart = timeToMinutes(clase.hora_inicio)
          const claseEnd = timeToMinutes(clase.hora_fin)
          return (selectedStart < claseEnd && selectedEnd > claseStart)
        })

        return {
          profesor,
          disponible: false,
          franja,
          conflicto: conflictingClass
            ? `Clase con ${conflictingClass.alumno_nombre} ${conflictingClass.hora_inicio}-${conflictingClass.hora_fin}`
            : "Tiene otra clase programada"
        }
      }

      return {
        profesor,
        disponible: true,
        franja,
        conflicto: null
      }
    })
}

interface NuevaClaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profesorId?: string // Now optional - can select any professor
  prefillFecha?: string
  prefillHora?: string
  onAdd: (clase: Clase) => void
}

export function NuevaClaseDialog({
  open,
  onOpenChange,
  profesorId,
  prefillFecha,
  prefillHora,
  onAdd,
}: NuevaClaseDialogProps) {
  const [selectedProfesorId, setSelectedProfesorId] = useState(profesorId ?? "")
  const [alumnoId, setAlumnoId] = useState("")
  const [vehiculoId, setVehiculoId] = useState("")
  const [fecha, setFecha] = useState(prefillFecha ?? "")
  const [horaInicio, setHoraInicio] = useState(prefillHora ?? "")
  const [horaFin, setHoraFin] = useState("")
  const [notas, setNotas] = useState("")

  // Calculate available professors based on date/time selection
  const availableProfesores = getProfesoresDisponibles(
    fecha,
    horaInicio,
    horaFin,
    MOCK_PROFESORES
  )

  // Get vehicles from the selected professor's sede
  const selectedProfesor = MOCK_PROFESORES.find(p => p.id === selectedProfesorId)
  const profesorSedes = selectedProfesor?.sedes ?? []
  const filteredVehiculos = MOCK_VEHICULOS.filter(v =>
    v.estado !== "baja" && v.sede_id && profesorSedes.includes(v.sede_id)
  )

  const vehiculoOptionsFiltered = filteredVehiculos.map(v => ({
    value: v.id,
    label: `${v.marca} ${v.modelo}`,
    sublabel: v.matricula,
  }))

  // Reset form when dialog opens with new prefills
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedProfesorId(profesorId ?? "")
      setFecha(prefillFecha ?? "")
      setHoraInicio(prefillHora ?? "")
      if (prefillHora) {
        const h = parseInt(prefillHora.split(":")[0])
        setHoraFin(`${String(h + 1).padStart(2, "0")}:00`)
      } else {
        setHoraFin("")
      }
      setAlumnoId("")
      setVehiculoId("")
      setNotas("")
    }
    onOpenChange(isOpen)
  }

  const canSubmit = selectedProfesorId && alumnoId && vehiculoId && fecha && horaInicio && horaFin
  const selectedProfessorAvailability = availableProfesores.find(a => a.profesor.id === selectedProfesorId)
  const isProfessorAvailable = selectedProfessorAvailability?.disponible ?? false

  const handleSubmit = () => {
    if (!canSubmit || !isProfessorAvailable) return
    const alumno = MOCK_ALUMNOS.find((a) => a.id === alumnoId)!
    const profesor = MOCK_PROFESORES.find((p) => p.id === selectedProfesorId)!
    const franja = selectedProfessorAvailability?.franja

    const newClase: Clase = {
      id: `c_new_${Date.now()}`,
      profesor_id: selectedProfesorId,
      alumno_id: alumnoId,
      alumno_nombre: alumno.nombre,
      alumno_apellidos: alumno.apellidos,
      vehiculo_id: vehiculoId,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      estado: "programada",
      notas: notas || null,
      sede_id: franja?.sede_id || alumno.sede_id,
    }
    onAdd(newClase)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva clase</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hora-inicio">Hora inicio</Label>
              <Input id="hora-inicio" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hora-fin">Hora fin</Label>
              <Input id="hora-fin" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
            </div>
          </div>

          {/* Professor Selection with Availability */}
          {fecha && horaInicio && horaFin && (
            <div className="grid gap-2">
              <Label>Profesor disponible</Label>
              {availableProfesores.length > 0 ? (
                <div className="space-y-2">
                  {availableProfesores.map(({ profesor, disponible, conflicto }) => (
                    <div
                      key={profesor.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedProfesorId === profesor.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                          : disponible
                          ? "border-green-200 bg-green-50 dark:bg-green-950/20 hover:border-green-300"
                          : "border-red-200 bg-red-50 dark:bg-red-950/20"
                      }`}
                      onClick={() => {
                        if (disponible) {
                          setSelectedProfesorId(profesor.id)
                          setVehiculoId("") // Reset vehicle when changing professor
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              disponible ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <span className="font-medium">
                            {profesor.nombre} {profesor.apellidos}
                          </span>
                          {selectedProfesorId === profesor.id && (
                            <div className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                              Seleccionado
                            </div>
                          )}
                        </div>
                      </div>
                      {conflicto && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{conflicto}</p>
                      )}
                      {disponible && profesor.horario.find(f => f.dia === getDayOfWeekFromDate(fecha)) && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Disponible - {MOCK_SEDES.find(s => s.id === profesor.horario.find(f => f.dia === getDayOfWeekFromDate(fecha))?.sede_id)?.nombre || "Sede"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3 border border-dashed rounded-lg text-center">
                  Selecciona fecha y horario para ver profesores disponibles
                </p>
              )}
            </div>
          )}

          {/* Availability Detail for Selected Professor */}
          {selectedProfesorId && fecha && horaInicio && horaFin && selectedProfesor && (
            <DisponibilidadProfesor
              profesor={selectedProfesor}
              fecha={fecha}
              horaInicio={horaInicio}
              horaFin={horaFin}
              clases={MOCK_CLASES}
            />
          )}

          <div className="grid gap-2">
            <Label>Alumno</Label>
            <Combobox
              options={ALUMNO_OPTIONS}
              value={alumnoId}
              onValueChange={setAlumnoId}
              placeholder="Seleccionar alumno"
              searchPlaceholder="Buscar alumno..."
              emptyMessage="No se encontró ningún alumno."
            />
          </div>

          <div className="grid gap-2">
            <Label>Vehículo {selectedProfesor && `(${MOCK_SEDES.find(s => selectedProfesor.sedes.includes(s.id))?.nombre || "disponibles"})`}</Label>
            <Combobox
              options={vehiculoOptionsFiltered.length > 0 ? vehiculoOptionsFiltered : VEHICULO_OPTIONS}
              value={vehiculoId}
              onValueChange={setVehiculoId}
              placeholder="Seleccionar vehículo"
              searchPlaceholder="Buscar vehículo..."
              emptyMessage="No se encontró ningún vehículo."
              disabled={!selectedProfesorId}
            />
            {selectedProfesor && vehiculoOptionsFiltered.length === 0 && (
              <p className="text-sm text-amber-600">
                No hay vehículos disponibles en las sedes del profesor. Mostrando todos los vehículos.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notas">Notas (opcional)</Label>
            <Input id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Observaciones..." />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || !isProfessorAvailable}
          >
            {!canSubmit
              ? "Completa todos los campos"
              : !isProfessorAvailable
              ? "Profesor no disponible"
              : "Crear clase"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
