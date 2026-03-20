"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { autoescuelaSchema } from "@/lib/validations/configuracion"
import type { Autoescuela } from "@/lib/services/configuracion"
import { updateAutoescuela } from "@/lib/services/configuracion"

interface AutoescuelaFormProps {
  autoescuela: Autoescuela
  onUpdate: (data: Autoescuela) => void
}

export function AutoescuelaForm({ autoescuela, onUpdate }: AutoescuelaFormProps) {
  const [form, setForm] = React.useState({
    nombre: autoescuela.nombre,
    direccion: autoescuela.direccion ?? "",
    telefono: autoescuela.telefono ?? "",
    email: autoescuela.email ?? "",
    cif: autoescuela.cif ?? "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [saving, setSaving] = React.useState(false)

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = autoescuelaSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    try {
      const updated = await updateAutoescuela(autoescuela.id, {
        nombre: form.nombre,
        direccion: form.direccion || null,
        telefono: form.telefono || null,
        email: form.email || null,
        cif: form.cif || null,
      })
      onUpdate(updated)
      toast.success("Datos de la autoescuela actualizados")
    } catch {
      toast.error("Error al actualizar los datos")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={(e) => {
              setForm({ ...form, nombre: e.target.value })
              clearError("nombre")
            }}
          />
          {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cif">CIF</Label>
          <Input
            id="cif"
            value={form.cif}
            placeholder="B12345678"
            onChange={(e) => {
              setForm({ ...form, cif: e.target.value.toUpperCase() })
              clearError("cif")
            }}
          />
          {errors.cif && <p className="text-xs text-destructive">{errors.cif}</p>}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={form.direccion}
            onChange={(e) => {
              setForm({ ...form, direccion: e.target.value })
              clearError("direccion")
            }}
          />
          {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={form.telefono}
            onChange={(e) => {
              setForm({ ...form, telefono: e.target.value })
              clearError("telefono")
            }}
          />
          {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              clearError("email")
            }}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
}
