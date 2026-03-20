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
import { Badge } from "@/components/ui/badge"
import type { Profesor } from "./types"
import { profesorSchema } from "@/lib/validations/profesor"

const ALL_PERMISOS = ["AM", "A1", "A2", "A", "B", "C", "D"]

type ProfesorFormData = Omit<Profesor, "id">

const EMPTY_FORM: ProfesorFormData = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  permisos_habilitados: ["B"],
  activo: true,
}

interface ProfesorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profesor?: Profesor | null
  onSave: (data: ProfesorFormData) => void
}

export function ProfesorFormDialog({
  open,
  onOpenChange,
  profesor,
  onSave,
}: ProfesorFormDialogProps) {
  const [form, setForm] = React.useState<ProfesorFormData>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const isEditing = !!profesor

  React.useEffect(() => {
    if (profesor) {
      const { id: _, ...rest } = profesor
      setForm(rest)
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [profesor, open])

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function togglePermiso(permiso: string) {
    setForm((prev) => ({
      ...prev,
      permisos_habilitados: prev.permisos_habilitados.includes(permiso)
        ? prev.permisos_habilitados.filter((p) => p !== permiso)
        : [...prev.permisos_habilitados, permiso],
    }))
    clearError("permisos_habilitados")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = profesorSchema.safeParse(form)
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
          <DialogTitle>
            {isEditing ? "Editar profesor" : "Nuevo profesor"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del profesor."
              : "Añade un nuevo profesor a la autoescuela."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prof-nombre">Nombre *</Label>
              <Input
                id="prof-nombre"
                value={form.nombre}
                onChange={(e) => {
                  setForm({ ...form, nombre: e.target.value })
                  clearError("nombre")
                }}
              />
              {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-apellidos">Apellidos *</Label>
              <Input
                id="prof-apellidos"
                value={form.apellidos}
                onChange={(e) => {
                  setForm({ ...form, apellidos: e.target.value })
                  clearError("apellidos")
                }}
              />
              {errors.apellidos && <p className="text-xs text-destructive mt-1">{errors.apellidos}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prof-email">Email *</Label>
            <Input
              id="prof-email"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value })
                clearError("email")
              }}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prof-telefono">Teléfono *</Label>
            <Input
              id="prof-telefono"
              placeholder="611 222 333"
              value={form.telefono}
              onChange={(e) => {
                setForm({ ...form, telefono: e.target.value })
                clearError("telefono")
              }}
            />
            {errors.telefono && <p className="text-xs text-destructive mt-1">{errors.telefono}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Permisos habilitados *</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_PERMISOS.map((p) => {
                const selected = form.permisos_habilitados.includes(p)
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePermiso(p)}
                    className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
            {errors.permisos_habilitados && (
              <p className="text-xs text-destructive mt-1">
                {errors.permisos_habilitados}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Guardar cambios" : "Añadir profesor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
