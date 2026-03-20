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
import { Combobox } from "@/components/ui/combobox"
import { MOCK_ALUMNOS } from "@/components/alumnos/mock-data"
import { PERMISOS } from "@/components/alumnos/types"
import { generarContratoHTML } from "./contrato-template"
import type { Contrato } from "./types"

interface ContratoFormData {
  alumno_id: string
  tipo_permiso: string
  importe_matricula: number
  importe_clases: number
}

const EMPTY_FORM: ContratoFormData = {
  alumno_id: "",
  tipo_permiso: "B",
  importe_matricula: 200,
  importe_clases: 850,
}

interface ContratoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (contrato: Omit<Contrato, "id">) => void
}

export function ContratoFormDialog({ open, onOpenChange, onSave }: ContratoFormDialogProps) {
  const [form, setForm] = React.useState<ContratoFormData>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setErrors({})
    }
  }, [open])

  const alumnoOptions = MOCK_ALUMNOS.map((a) => ({
    value: a.id,
    label: `${a.nombre} ${a.apellidos}`,
    sublabel: a.dni,
  }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!form.alumno_id) newErrors.alumno_id = "Selecciona un alumno"
    if (!form.tipo_permiso) newErrors.tipo_permiso = "Selecciona un permiso"
    if (form.importe_matricula < 0) newErrors.importe_matricula = "Importe no válido"
    if (form.importe_clases < 0) newErrors.importe_clases = "Importe no válido"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const alumno = MOCK_ALUMNOS.find((a) => a.id === form.alumno_id)
    if (!alumno) return

    const total = form.importe_matricula + form.importe_clases
    const contenido = generarContratoHTML({
      autoescuela_nombre: "Autoescuela Praxi",
      autoescuela_cif: "B12345678",
      autoescuela_direccion: "Calle Mayor 15, 28001 Madrid",
      alumno_nombre: `${alumno.nombre} ${alumno.apellidos}`,
      alumno_dni: alumno.dni,
      permiso: form.tipo_permiso,
      importe_matricula: form.importe_matricula,
      importe_clases: form.importe_clases,
      total,
      fecha: new Date().toISOString().split("T")[0],
    })

    onSave({
      alumno_id: form.alumno_id,
      alumno_nombre: `${alumno.nombre} ${alumno.apellidos}`,
      tipo_permiso: form.tipo_permiso,
      fecha_creacion: new Date().toISOString().split("T")[0],
      fecha_firma: null,
      estado: "borrador",
      contenido,
      firma_alumno: null,
      firma_autoescuela: false,
      importe_matricula: form.importe_matricula,
      importe_clases: form.importe_clases,
      total,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo contrato</DialogTitle>
          <DialogDescription>
            Crea un contrato de matrícula para un alumno.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Alumno *</Label>
            <Combobox
              options={alumnoOptions}
              value={form.alumno_id}
              onValueChange={(val) => {
                setForm({ ...form, alumno_id: val })
                if (errors.alumno_id) {
                  setErrors((prev) => { const n = { ...prev }; delete n.alumno_id; return n })
                }
              }}
              placeholder="Seleccionar alumno..."
              searchPlaceholder="Buscar alumno..."
            />
            {errors.alumno_id && <p className="text-xs text-destructive mt-1">{errors.alumno_id}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Tipo de permiso *</Label>
            <Select
              value={form.tipo_permiso}
              onValueChange={(val) => val && setForm({ ...form, tipo_permiso: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERMISOS.map((p) => (
                  <SelectItem key={p} value={p}>Permiso {p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipo_permiso && <p className="text-xs text-destructive mt-1">{errors.tipo_permiso}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="importe_matricula">Importe matrícula (€) *</Label>
              <Input
                id="importe_matricula"
                type="number"
                min={0}
                step={0.01}
                value={form.importe_matricula}
                onChange={(e) => setForm({ ...form, importe_matricula: parseFloat(e.target.value) || 0 })}
              />
              {errors.importe_matricula && <p className="text-xs text-destructive mt-1">{errors.importe_matricula}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="importe_clases">Importe clases (€) *</Label>
              <Input
                id="importe_clases"
                type="number"
                min={0}
                step={0.01}
                value={form.importe_clases}
                onChange={(e) => setForm({ ...form, importe_clases: parseFloat(e.target.value) || 0 })}
              />
              {errors.importe_clases && <p className="text-xs text-destructive mt-1">{errors.importe_clases}</p>}
            </div>
          </div>
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm font-medium">
              Total: {(form.importe_matricula + form.importe_clases).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </p>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">Crear contrato</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
