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
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
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
  primer_apellido: "",
  segundo_apellido: "",
  sexo: "hombre" as const,
  dni: "",
  direccion: "",
  codigo_postal: "",
  poblacion: "",
  municipio: "",
  provincia: "",
  telefono_fijo: "",
  telefono_movil: "",
  email: "",
  vehiculo_asignado: "",
  fecha_permiso_a: "",
  permitir_solapamiento: true,
  observaciones: "",
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
      // Handle legacy fields for backward compatibility
      const formData = {
        ...rest,
        // If new fields don't exist, try to populate from legacy fields
        primer_apellido: rest.primer_apellido || (rest.apellidos?.split(' ')[0] ?? ''),
        segundo_apellido: rest.segundo_apellido || (rest.apellidos?.split(' ').slice(1).join(' ') ?? ''),
        telefono_movil: rest.telefono_movil || rest.telefono || '',
        telefono_fijo: rest.telefono_fijo || '',
        sexo: rest.sexo || 'hombre' as const,
        dni: rest.dni || '',
        direccion: rest.direccion || '',
        codigo_postal: rest.codigo_postal || '',
        poblacion: rest.poblacion || '',
        municipio: rest.municipio || '',
        provincia: rest.provincia || '',
        vehiculo_asignado: rest.vehiculo_asignado || '',
        fecha_permiso_a: rest.fecha_permiso_a || '',
        permitir_solapamiento: rest.permitir_solapamiento ?? true,
        observaciones: rest.observaciones || '',
      }
      setForm(formData)
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
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
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
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Datos personales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos personales</h3>
            <div className="grid grid-cols-3 gap-3">
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
                <Label htmlFor="prof-primer-apellido">Primer apellido *</Label>
                <Input
                  id="prof-primer-apellido"
                  value={form.primer_apellido}
                  onChange={(e) => {
                    setForm({ ...form, primer_apellido: e.target.value })
                    clearError("primer_apellido")
                  }}
                />
                {errors.primer_apellido && <p className="text-xs text-destructive mt-1">{errors.primer_apellido}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-segundo-apellido">Segundo apellido</Label>
                <Input
                  id="prof-segundo-apellido"
                  value={form.segundo_apellido}
                  onChange={(e) => {
                    setForm({ ...form, segundo_apellido: e.target.value })
                    clearError("segundo_apellido")
                  }}
                />
                {errors.segundo_apellido && <p className="text-xs text-destructive mt-1">{errors.segundo_apellido}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Sexo *</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sexo-hombre"
                      checked={form.sexo === "hombre"}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setForm({ ...form, sexo: "hombre" })
                          clearError("sexo")
                        }
                      }}
                    />
                    <Label htmlFor="sexo-hombre" className="text-sm font-normal cursor-pointer">
                      Hombre
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sexo-mujer"
                      checked={form.sexo === "mujer"}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setForm({ ...form, sexo: "mujer" })
                          clearError("sexo")
                        }
                      }}
                    />
                    <Label htmlFor="sexo-mujer" className="text-sm font-normal cursor-pointer">
                      Mujer
                    </Label>
                  </div>
                </div>
                {errors.sexo && <p className="text-xs text-destructive mt-1">{errors.sexo}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-dni">DNI *</Label>
                <Input
                  id="prof-dni"
                  placeholder="12345678X"
                  value={form.dni}
                  onChange={(e) => {
                    setForm({ ...form, dni: e.target.value })
                    clearError("dni")
                  }}
                />
                {errors.dni && <p className="text-xs text-destructive mt-1">{errors.dni}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contacto</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-telefono-fijo">Teléfono fijo</Label>
                <Input
                  id="prof-telefono-fijo"
                  placeholder="91 123 4567"
                  value={form.telefono_fijo}
                  onChange={(e) => {
                    setForm({ ...form, telefono_fijo: e.target.value })
                    clearError("telefono_fijo")
                  }}
                />
                {errors.telefono_fijo && <p className="text-xs text-destructive mt-1">{errors.telefono_fijo}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-telefono-movil">Teléfono móvil *</Label>
                <Input
                  id="prof-telefono-movil"
                  placeholder="611 222 333"
                  value={form.telefono_movil}
                  onChange={(e) => {
                    setForm({ ...form, telefono_movil: e.target.value })
                    clearError("telefono_movil")
                  }}
                />
                {errors.telefono_movil && <p className="text-xs text-destructive mt-1">{errors.telefono_movil}</p>}
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
          </div>

          <Separator />

          {/* Domicilio */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Domicilio</h3>
            <div className="space-y-1.5">
              <Label htmlFor="prof-direccion">Dirección *</Label>
              <Input
                id="prof-direccion"
                placeholder="Calle, número, piso, puerta"
                value={form.direccion}
                onChange={(e) => {
                  setForm({ ...form, direccion: e.target.value })
                  clearError("direccion")
                }}
              />
              {errors.direccion && <p className="text-xs text-destructive mt-1">{errors.direccion}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-codigo-postal">Código postal *</Label>
                <Input
                  id="prof-codigo-postal"
                  placeholder="28001"
                  value={form.codigo_postal}
                  onChange={(e) => {
                    setForm({ ...form, codigo_postal: e.target.value })
                    clearError("codigo_postal")
                  }}
                />
                {errors.codigo_postal && <p className="text-xs text-destructive mt-1">{errors.codigo_postal}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-poblacion">Población *</Label>
                <Input
                  id="prof-poblacion"
                  value={form.poblacion}
                  onChange={(e) => {
                    setForm({ ...form, poblacion: e.target.value })
                    clearError("poblacion")
                  }}
                />
                {errors.poblacion && <p className="text-xs text-destructive mt-1">{errors.poblacion}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-municipio">Municipio *</Label>
                <Input
                  id="prof-municipio"
                  value={form.municipio}
                  onChange={(e) => {
                    setForm({ ...form, municipio: e.target.value })
                    clearError("municipio")
                  }}
                />
                {errors.municipio && <p className="text-xs text-destructive mt-1">{errors.municipio}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-provincia">Provincia *</Label>
                <Input
                  id="prof-provincia"
                  value={form.provincia}
                  onChange={(e) => {
                    setForm({ ...form, provincia: e.target.value })
                    clearError("provincia")
                  }}
                />
                {errors.provincia && <p className="text-xs text-destructive mt-1">{errors.provincia}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Profesional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos profesionales</h3>
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-fecha-permiso">Fecha Permiso A</Label>
                <Input
                  id="prof-fecha-permiso"
                  type="date"
                  value={form.fecha_permiso_a}
                  onChange={(e) => {
                    setForm({ ...form, fecha_permiso_a: e.target.value })
                    clearError("fecha_permiso_a")
                  }}
                />
                {errors.fecha_permiso_a && <p className="text-xs text-destructive mt-1">{errors.fecha_permiso_a}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-vehiculo">Vehículo asignado</Label>
                <Select
                  value={form.vehiculo_asignado || ""}
                  onValueChange={(value) => {
                    setForm({ ...form, vehiculo_asignado: value || undefined })
                    clearError("vehiculo_asignado")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin vehículo asignado</SelectItem>
                    <SelectItem value="vehiculo_1">Ford Focus - 1234ABC</SelectItem>
                    <SelectItem value="vehiculo_2">Seat Ibiza - 5678DEF</SelectItem>
                    <SelectItem value="vehiculo_3">Volkswagen Polo - 9012GHI</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vehiculo_asignado && <p className="text-xs text-destructive mt-1">{errors.vehiculo_asignado}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Permitir solapamiento</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="solapamiento-si"
                    checked={form.permitir_solapamiento === true}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setForm({ ...form, permitir_solapamiento: true })
                        clearError("permitir_solapamiento")
                      }
                    }}
                  />
                  <Label htmlFor="solapamiento-si" className="text-sm font-normal cursor-pointer">
                    Sí
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="solapamiento-no"
                    checked={form.permitir_solapamiento === false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setForm({ ...form, permitir_solapamiento: false })
                        clearError("permitir_solapamiento")
                      }
                    }}
                  />
                  <Label htmlFor="solapamiento-no" className="text-sm font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Si está a No, el profesor no puede estar el mismo día a la misma hora en dos clases prácticas diferentes
              </p>
              {errors.permitir_solapamiento && <p className="text-xs text-destructive mt-1">{errors.permitir_solapamiento}</p>}
            </div>
          </div>

          <Separator />

          {/* Horario */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Horario de prácticas</h3>
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

          <Separator />

          {/* Observaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Observaciones</h3>
            <div className="space-y-1.5">
              <Label htmlFor="prof-observaciones">Observaciones</Label>
              <Textarea
                id="prof-observaciones"
                placeholder="Notas adicionales sobre el profesor..."
                rows={3}
                value={form.observaciones}
                onChange={(e) => {
                  setForm({ ...form, observaciones: e.target.value })
                  clearError("observaciones")
                }}
              />
              {errors.observaciones && <p className="text-xs text-destructive mt-1">{errors.observaciones}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Foto del profesor</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Próximamente: subir foto</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Firma del profesor</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Próximamente: capturar firma</p>
                </div>
              </div>
            </div>
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
