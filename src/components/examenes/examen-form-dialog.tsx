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
import { Combobox } from "@/components/ui/combobox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Examen, TipoExamen, ResultadoExamen } from "./types"
import { TIPOS_EXAMEN, TIPO_LABELS, RESULTADOS, RESULTADO_LABELS } from "./types"
import { examenSchema } from "@/lib/validations/examen"
import { MOCK_ALUMNOS } from "@/components/alumnos/mock-data"

const ALUMNO_OPTIONS = MOCK_ALUMNOS.map((a) => ({
  value: a.id,
  label: `${a.nombre} ${a.apellidos}`,
  sublabel: a.dni,
}))

type ExamenFormData = Omit<Examen, "id">

const EMPTY_FORM: ExamenFormData = {
  alumno_id: "",
  alumno_nombre: "",
  tipo: "teorico",
  fecha: new Date().toISOString().split("T")[0],
  hora: null,
  convocatoria: null,
  intento: 1,
  resultado: "pendiente",
  centro_examen: null,
  notas: null,
}

interface ExamenFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  examen?: Examen | null
  onSave: (data: ExamenFormData) => void
}

export function ExamenFormDialog({
  open,
  onOpenChange,
  examen,
  onSave,
}: ExamenFormDialogProps) {
  const [form, setForm] = React.useState<ExamenFormData>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const isEditing = !!examen

  React.useEffect(() => {
    if (examen) {
      const { id: _, ...rest } = examen
      setForm(rest)
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [examen, open])

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
    const result = examenSchema.safeParse(form)
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar examen" : "Nuevo examen"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del examen."
              : "Registra una nueva presentación a examen."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Alumno *</Label>
            <Combobox
              options={ALUMNO_OPTIONS}
              value={form.alumno_id}
              onValueChange={(id) => {
                const alumno = ALUMNO_OPTIONS.find((a) => a.value === id)
                setForm({
                  ...form,
                  alumno_id: id,
                  alumno_nombre: alumno?.label ?? "",
                })
                clearError("alumno_nombre")
              }}
              placeholder="Seleccionar alumno"
              searchPlaceholder="Buscar alumno..."
              emptyMessage="No se encontró ningún alumno."
            />
            {errors.alumno_nombre && <p className="text-xs text-destructive mt-1">{errors.alumno_nombre}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo *</Label>
              <Select
                value={form.tipo}
                onValueChange={(val) =>
                  val && setForm({ ...form, tipo: val as TipoExamen })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_EXAMEN.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TIPO_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="intento">Intento *</Label>
              <Input
                id="intento"
                type="number"
                min={1}
                value={form.intento}
                onChange={(e) => {
                  setForm({ ...form, intento: Number(e.target.value) })
                  clearError("intento")
                }}
              />
              {errors.intento && <p className="text-xs text-destructive mt-1">{errors.intento}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1.5">
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={form.hora ?? ""}
                onChange={(e) =>
                  setForm({ ...form, hora: e.target.value || null })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="convocatoria">Convocatoria</Label>
            <Input
              id="convocatoria"
              placeholder="Ej: Marzo 2026 - Teórico"
              value={form.convocatoria ?? ""}
              onChange={(e) =>
                setForm({ ...form, convocatoria: e.target.value || null })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Resultado *</Label>
              <Select
                value={form.resultado}
                onValueChange={(val) =>
                  val && setForm({ ...form, resultado: val as ResultadoExamen })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESULTADOS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {RESULTADO_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="centro_examen">Centro de examen</Label>
              <Input
                id="centro_examen"
                placeholder="Ej: DGT Madrid"
                value={form.centro_examen ?? ""}
                onChange={(e) =>
                  setForm({ ...form, centro_examen: e.target.value || null })
                }
              />
            </div>
          </div>
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
              {isEditing ? "Guardar cambios" : "Registrar examen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
