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
import type { Alumno, PermisoType, EstadoAlumno } from "./types"
import { PERMISOS, ESTADOS, ESTADO_LABELS } from "./types"

type AlumnoFormData = Omit<Alumno, "id">

const EMPTY_FORM: AlumnoFormData = {
  nombre: "",
  apellidos: "",
  dni: "",
  email: null,
  telefono: "",
  fecha_nacimiento: "",
  direccion: null,
  permiso: "B",
  estado: "matriculado",
  fecha_matricula: new Date().toISOString().split("T")[0],
  notas: null,
}

interface AlumnoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumno?: Alumno | null
  onSave: (data: AlumnoFormData) => void
}

export function AlumnoFormDialog({
  open,
  onOpenChange,
  alumno,
  onSave,
}: AlumnoFormDialogProps) {
  const [form, setForm] = React.useState<AlumnoFormData>(EMPTY_FORM)
  const isEditing = !!alumno

  React.useEffect(() => {
    if (alumno) {
      const { id: _, ...rest } = alumno
      setForm(rest)
    } else {
      setForm(EMPTY_FORM)
    }
  }, [alumno, open])

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
            {isEditing ? "Editar alumno" : "Nuevo alumno"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del alumno."
              : "Rellena los datos para matricular un nuevo alumno."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input
                id="apellidos"
                required
                value={form.apellidos}
                onChange={(e) =>
                  setForm({ ...form, apellidos: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                required
                placeholder="12345678A"
                value={form.dni}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                required
                placeholder="612 345 678"
                value={form.telefono}
                onChange={(e) =>
                  setForm({ ...form, telefono: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email ?? ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value || null })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                required
                value={form.fecha_nacimiento}
                onChange={(e) =>
                  setForm({ ...form, fecha_nacimiento: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fecha_matricula">Fecha de matrícula *</Label>
              <Input
                id="fecha_matricula"
                type="date"
                required
                value={form.fecha_matricula}
                onChange={(e) =>
                  setForm({ ...form, fecha_matricula: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={form.direccion ?? ""}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value || null })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Permiso *</Label>
              <Select
                value={form.permiso}
                onValueChange={(val) =>
                  val && setForm({ ...form, permiso: val as PermisoType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERMISOS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEditing && (
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Select
                  value={form.estado}
                  onValueChange={(val) =>
                    val && setForm({ ...form, estado: val as EstadoAlumno })
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
              {isEditing ? "Guardar cambios" : "Matricular alumno"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
