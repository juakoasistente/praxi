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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import type { Profesor, TipoClaseProfesor, DiaSemana, FranjaHoraria } from "./types"
import { TIPO_CLASE_LABELS, DIAS_SEMANA, DIA_LABELS } from "./types"
import { MOCK_SEDES } from "@/components/sedes/mock-data"
import { profesorSchema } from "@/lib/validations/profesor"

function generateTimeOptions(): string[] {
  const options: string[] = []
  for (let h = 7; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break
      options.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`)
    }
  }
  return options
}

const TIME_OPTIONS = generateTimeOptions()
const ALL_PERMISOS = ["AM", "A1", "A2", "A", "B", "C", "D"]

type ProfesorFormData = Omit<Profesor, "id">

const EMPTY_FORM: ProfesorFormData = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  permisos_habilitados: ["B"],
  activo: true,
  sedes: [],
  tipo_clase: "practico",
  horario: [],
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

  function toggleTodosPermisos() {
    const allSelected = ALL_PERMISOS.every((p) => form.permisos_habilitados.includes(p))
    setForm((prev) => ({
      ...prev,
      permisos_habilitados: allSelected ? [] : [...ALL_PERMISOS],
    }))
    clearError("permisos_habilitados")
  }

  function addFranja() {
    const newFranja: FranjaHoraria = {
      id: String(Date.now()) + Math.random(),
      dia: "lunes",
      sede_id: MOCK_SEDES[0].id,
      hora_inicio: "09:00",
      hora_fin: "14:00",
    }
    setForm((prev) => ({
      ...prev,
      horario: [...prev.horario, newFranja],
    }))
  }

  function removeFranja(id: string) {
    setForm((prev) => ({
      ...prev,
      horario: prev.horario.filter((h) => h.id !== id),
    }))
  }

  function updateFranja(id: string, field: keyof FranjaHoraria, value: string) {
    setForm((prev) => ({
      ...prev,
      horario: prev.horario.map((h) =>
        h.id === id ? { ...h, [field]: value } : h
      ),
    }))
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
            <Label>Tipo de clase *</Label>
            <RadioGroup
              value={form.tipo_clase}
              onValueChange={(value) => {
                setForm({ ...form, tipo_clase: value as TipoClaseProfesor })
                clearError("tipo_clase")
              }}
              className="flex gap-6"
            >
              {Object.entries(TIPO_CLASE_LABELS).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`tipo-${value}`} />
                  <Label htmlFor={`tipo-${value}`} className="text-sm font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.tipo_clase && <p className="text-xs text-destructive mt-1">{errors.tipo_clase}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Permisos habilitados *</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="todos-permisos"
                  checked={ALL_PERMISOS.every((p) => form.permisos_habilitados.includes(p))}
                  onCheckedChange={toggleTodosPermisos}
                />
                <Label htmlFor="todos-permisos" className="text-xs text-muted-foreground cursor-pointer">
                  Todos
                </Label>
              </div>
            </div>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Horario de prácticas</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFranja}
                className="text-xs"
              >
                + Añadir franja
              </Button>
            </div>
            {form.horario.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay horario definido</p>
            ) : (
              <div className="space-y-2">
                {form.horario.map((franja) => {
                  const isValidTime = franja.hora_fin > franja.hora_inicio
                  return (
                    <div key={franja.id} className="flex flex-wrap gap-2 items-center p-3 border rounded-lg">
                      <div className="flex-1 min-w-20">
                        <Select
                          value={franja.dia}
                          onValueChange={(value) => value && updateFranja(franja.id, "dia", value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DIAS_SEMANA.map((dia) => (
                              <SelectItem key={dia} value={dia}>
                                {DIA_LABELS[dia]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-32">
                        <Select
                          value={franja.sede_id}
                          onValueChange={(value) => value && updateFranja(franja.id, "sede_id", value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_SEDES.filter(s => s.activa).map((sede) => (
                              <SelectItem key={sede.id} value={sede.id}>
                                {sede.nombre.replace(" - ", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-20">
                        <Select
                          value={franja.hora_inicio}
                          onValueChange={(value) => value && updateFranja(franja.id, "hora_inicio", value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-20">
                        <Select
                          value={franja.hora_fin}
                          onValueChange={(value) => value && updateFranja(franja.id, "hora_fin", value)}
                        >
                          <SelectTrigger className={`h-8 text-xs ${!isValidTime ? "border-red-500" : ""}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFranja(franja.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )
                })}
              </div>
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
