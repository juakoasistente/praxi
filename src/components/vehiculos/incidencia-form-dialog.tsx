"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { IncidenciaVehiculo, TipoIncidencia } from "./types"
import { TIPOS_INCIDENCIA, TIPO_INCIDENCIA_LABELS } from "./types"

type IncidenciaFormData = Omit<IncidenciaVehiculo, "id" | "vehiculo_id">

const EMPTY_FORM: IncidenciaFormData = {
  descripcion: "",
  fecha: new Date().toISOString().split("T")[0],
  tipo: "otro",
}

interface IncidenciaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: IncidenciaFormData) => void
}

export function IncidenciaFormDialog({
  open,
  onOpenChange,
  onSave,
}: IncidenciaFormDialogProps) {
  const [form, setForm] = React.useState<IncidenciaFormData>(EMPTY_FORM)

  React.useEffect(() => {
    if (open) setForm(EMPTY_FORM)
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva incidencia</DialogTitle>
          <DialogDescription>
            Registra una incidencia para este vehículo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              required
              placeholder="Ej: Pinchazo en rueda delantera"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha-incidencia">Fecha *</Label>
              <Input
                id="fecha-incidencia"
                type="date"
                required
                value={form.fecha}
                onChange={(e) =>
                  setForm({ ...form, fecha: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo *</Label>
              <Select
                value={form.tipo}
                onValueChange={(val) =>
                  val && setForm({ ...form, tipo: val as TipoIncidencia })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_INCIDENCIA.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TIPO_INCIDENCIA_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">Registrar incidencia</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
