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
import type { Vehiculo, TipoVehiculo, EstadoVehiculo } from "./types"
import { TIPOS, TIPO_LABELS, ESTADOS, ESTADO_LABELS } from "./types"
import { vehiculoSchema } from "@/lib/validations/vehiculo"

type VehiculoFormData = Omit<Vehiculo, "id">

const EMPTY_FORM: VehiculoFormData = {
  marca: "",
  modelo: "",
  matricula: "",
  tipo: "turismo",
  año: new Date().getFullYear(),
  km_actuales: 0,
  fecha_adquisicion: new Date().toISOString().split("T")[0],
  precio_adquisicion: 0,
  estado: "activo",
  notas: null,
}

interface VehiculoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehiculo?: Vehiculo | null
  onSave: (data: VehiculoFormData) => void
}

export function VehiculoFormDialog({
  open,
  onOpenChange,
  vehiculo,
  onSave,
}: VehiculoFormDialogProps) {
  const [form, setForm] = React.useState<VehiculoFormData>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const isEditing = !!vehiculo

  React.useEffect(() => {
    if (vehiculo) {
      const { id: _, ...rest } = vehiculo
      setForm(rest)
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [vehiculo, open])

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
    const result = vehiculoSchema.safeParse(form)
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar vehículo" : "Nuevo vehículo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del vehículo."
              : "Rellena los datos para registrar un nuevo vehículo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="marca">Marca *</Label>
              <Input
                id="marca"
                value={form.marca}
                onChange={(e) => {
                  setForm({ ...form, marca: e.target.value })
                  clearError("marca")
                }}
              />
              {errors.marca && <p className="text-xs text-destructive mt-1">{errors.marca}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                value={form.modelo}
                onChange={(e) => {
                  setForm({ ...form, modelo: e.target.value })
                  clearError("modelo")
                }}
              />
              {errors.modelo && <p className="text-xs text-destructive mt-1">{errors.modelo}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                placeholder="1234 BCD"
                value={form.matricula}
                onChange={(e) => {
                  setForm({ ...form, matricula: e.target.value })
                  clearError("matricula")
                }}
              />
              {errors.matricula && <p className="text-xs text-destructive mt-1">{errors.matricula}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Tipo *</Label>
              <Select
                value={form.tipo}
                onValueChange={(val) =>
                  val && setForm({ ...form, tipo: val as TipoVehiculo })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TIPO_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="año">Año *</Label>
              <Input
                id="año"
                type="number"
                min={1990}
                max={2030}
                value={form.año}
                onChange={(e) => {
                  setForm({ ...form, año: Number(e.target.value) })
                  clearError("año")
                }}
              />
              {errors.año && <p className="text-xs text-destructive mt-1">{errors.año}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="km_actuales">Km actuales *</Label>
              <Input
                id="km_actuales"
                type="number"
                min={0}
                value={form.km_actuales}
                onChange={(e) => {
                  setForm({ ...form, km_actuales: Number(e.target.value) })
                  clearError("km_actuales")
                }}
              />
              {errors.km_actuales && <p className="text-xs text-destructive mt-1">{errors.km_actuales}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha_adquisicion">Fecha de adquisición *</Label>
              <Input
                id="fecha_adquisicion"
                type="date"
                value={form.fecha_adquisicion}
                onChange={(e) => {
                  setForm({ ...form, fecha_adquisicion: e.target.value })
                  clearError("fecha_adquisicion")
                }}
              />
              {errors.fecha_adquisicion && <p className="text-xs text-destructive mt-1">{errors.fecha_adquisicion}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="precio_adquisicion">Precio adquisición (€) *</Label>
              <Input
                id="precio_adquisicion"
                type="number"
                min={0}
                step={0.01}
                value={form.precio_adquisicion}
                onChange={(e) => {
                  setForm({ ...form, precio_adquisicion: Number(e.target.value) })
                  clearError("precio_adquisicion")
                }}
              />
              {errors.precio_adquisicion && <p className="text-xs text-destructive mt-1">{errors.precio_adquisicion}</p>}
            </div>
          </div>
          {isEditing && (
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select
                value={form.estado}
                onValueChange={(val) =>
                  val && setForm({ ...form, estado: val as EstadoVehiculo })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((e) => (
                    <SelectItem key={e} value={e}>
                      {ESTADO_LABELS[e]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="notas">Notas</Label>
            <textarea
              id="notas"
              className="flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              value={form.notas ?? ""}
              onChange={(e) =>
                setForm({ ...form, notas: e.target.value || null })
              }
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Guardar cambios" : "Registrar vehículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
