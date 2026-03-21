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
import { type Clase } from "./mock-data"

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

interface NuevaClaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profesorId: string
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
  const [alumnoId, setAlumnoId] = useState("")
  const [vehiculoId, setVehiculoId] = useState("")
  const [fecha, setFecha] = useState(prefillFecha ?? "")
  const [horaInicio, setHoraInicio] = useState(prefillHora ?? "")
  const [horaFin, setHoraFin] = useState("")
  const [notas, setNotas] = useState("")

  // Reset form when dialog opens with new prefills
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
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

  const canSubmit = alumnoId && vehiculoId && fecha && horaInicio && horaFin

  const handleSubmit = () => {
    if (!canSubmit) return
    const alumno = MOCK_ALUMNOS.find((a) => a.id === alumnoId)!
    const newClase: Clase = {
      id: `c_new_${Date.now()}`,
      profesor_id: profesorId,
      alumno_id: alumnoId,
      alumno_nombre: alumno.nombre,
      alumno_apellidos: alumno.apellidos,
      vehiculo_id: vehiculoId,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      estado: "programada",
      notas: notas || null,
      sede_id: alumno.sede_id,
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
            <Label>Vehículo</Label>
            <Combobox
              options={VEHICULO_OPTIONS}
              value={vehiculoId}
              onValueChange={setVehiculoId}
              placeholder="Seleccionar vehículo"
              searchPlaceholder="Buscar vehículo..."
              emptyMessage="No se encontró ningún vehículo."
            />
          </div>

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

          <div className="grid gap-2">
            <Label htmlFor="notas">Notas (opcional)</Label>
            <Input id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Observaciones..." />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Crear clase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
