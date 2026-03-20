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
  const isEditing = !!vehiculo

  React.useEffect(() => {
    if (vehiculo) {
      const { id: _, ...rest } = vehiculo
      setForm(rest)
    } else {
      setForm(EMPTY_FORM)
    }
  }, [vehiculo, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
                required
                value={form.marca}
                onChange={(e) =>
                  setForm({ ...form, marca: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                required
                value={form.modelo}
                onChange={(e) =>
                  setForm({ ...form, modelo: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                required
                placeholder="1234 BCD"
                value={form.matricula}
                onChange={(e) =>
                  setForm({ ...form, matricula: e.target.value })
                }
              />
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
                required
                min={1990}
                max={2030}
                value={form.año}
                onChange={(e) =>
                  setForm({ ...form, año: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="km_actuales">Km actuales *</Label>
              <Input
                id="km_actuales"
                type="number"
                required
                min={0}
                value={form.km_actuales}
                onChange={(e) =>
                  setForm({ ...form, km_actuales: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha_adquisicion">Fecha de adquisición *</Label>
              <Input
                id="fecha_adquisicion"
                type="date"
                required
                value={form.fecha_adquisicion}
                onChange={(e) =>
                  setForm({ ...form, fecha_adquisicion: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="precio_adquisicion">Precio adquisición (€) *</Label>
              <Input
                id="precio_adquisicion"
                type="number"
                required
                min={0}
                step={0.01}
                value={form.precio_adquisicion}
                onChange={(e) =>
                  setForm({ ...form, precio_adquisicion: Number(e.target.value) })
                }
              />
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
