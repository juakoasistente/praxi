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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CosteVehiculo, CategoriaCoste } from "./types"
import { CATEGORIAS_COSTE, CATEGORIA_COSTE_LABELS } from "./types"
import { costeVehiculoSchema } from "@/lib/validations/coste-vehiculo"

type CosteFormData = Omit<CosteVehiculo, "id" | "vehiculo_id">

const EMPTY_FORM: CosteFormData = {
  concepto: "",
  importe: 0,
  fecha: new Date().toISOString().split("T")[0],
  categoria: "mantenimiento",
}

interface CosteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: CosteFormData) => void
}

export function CosteFormDialog({
  open,
  onOpenChange,
  onSave,
}: CosteFormDialogProps) {
  const [form, setForm] = React.useState<CosteFormData>(EMPTY_FORM)
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
    const result = costeVehiculoSchema.safeParse(form)
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
          <DialogTitle>Nuevo coste</DialogTitle>
          <DialogDescription>
            Registra un nuevo coste para este vehículo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="concepto">Concepto *</Label>
            <Input
              id="concepto"
              placeholder="Ej: Cambio de aceite"
              value={form.concepto}
              onChange={(e) => {
                setForm({ ...form, concepto: e.target.value })
                clearError("concepto")
              }}
            />
            {errors.concepto && <p className="text-xs text-destructive mt-1">{errors.concepto}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="importe">Importe (€) *</Label>
              <Input
                id="importe"
                type="number"
                min={0}
                step={0.01}
                value={form.importe}
                onChange={(e) => {
                  setForm({ ...form, importe: Number(e.target.value) })
                  clearError("importe")
                }}
              />
              {errors.importe && <p className="text-xs text-destructive mt-1">{errors.importe}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={form.fecha}
                onChange={(e) => {
                  setForm({ ...form, fecha: e.target.value })
                  clearError("fecha")
                }}
              />
              {errors.fecha && <p className="text-xs text-destructive mt-1">{errors.fecha}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Categoría *</Label>
            <Select
              value={form.categoria}
              onValueChange={(val) =>
                val && setForm({ ...form, categoria: val as CategoriaCoste })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_COSTE.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORIA_COSTE_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">Registrar coste</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
