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
import { incidenciaSchema } from "@/lib/validations/incidencia"

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
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setErrors({})
    }
  }, [open])

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = incidenciaSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
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
              placeholder="Ej: Pinchazo en rueda delantera"
              value={form.descripcion}
              onChange={(e) => {
                setForm({ ...form, descripcion: e.target.value })
                clearError("descripcion")
              }}
            />
            {errors.descripcion && <p className="text-xs text-destructive mt-1">{errors.descripcion}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha-incidencia">Fecha *</Label>
              <Input
                id="fecha-incidencia"
                type="date"
                value={form.fecha}
                onChange={(e) => {
                  setForm({ ...form, fecha: e.target.value })
                  clearError("fecha")
                }}
              />
              {errors.fecha && <p className="text-xs text-destructive mt-1">{errors.fecha}</p>}
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
