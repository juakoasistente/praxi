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
              required
              placeholder="Ej: Cambio de aceite"
              value={form.concepto}
              onChange={(e) =>
                setForm({ ...form, concepto: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="importe">Importe (€) *</Label>
              <Input
                id="importe"
                type="number"
                required
                min={0}
                step={0.01}
                value={form.importe}
                onChange={(e) =>
                  setForm({ ...form, importe: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                required
                value={form.fecha}
                onChange={(e) =>
                  setForm({ ...form, fecha: e.target.value })
                }
              />
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
