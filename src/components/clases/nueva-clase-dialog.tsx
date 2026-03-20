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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALUMNOS_CLASES, VEHICULOS, type Clase } from "./mock-data"

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
    const alumno = ALUMNOS_CLASES.find((a) => a.id === alumnoId)!
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
    }
    onAdd(newClase)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva clase</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="alumno">Alumno</Label>
            <Select value={alumnoId} onValueChange={(v) => v && setAlumnoId(v)}>
              <SelectTrigger id="alumno">
                <SelectValue placeholder="Seleccionar alumno" />
              </SelectTrigger>
              <SelectContent>
                {ALUMNOS_CLASES.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.nombre} {a.apellidos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vehiculo">Vehículo</Label>
            <Select value={vehiculoId} onValueChange={(v) => v && setVehiculoId(v)}>
              <SelectTrigger id="vehiculo">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                {VEHICULOS.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.modelo} — {v.matricula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
