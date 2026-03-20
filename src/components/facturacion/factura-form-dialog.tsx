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
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import type {
  Factura,
  LineaFactura,
  EstadoFactura,
  MetodoPago,
  ConceptoFactura,
} from "./types"
import {
  ESTADOS_FACTURA,
  ESTADO_FACTURA_LABELS,
  METODOS_PAGO,
  METODO_PAGO_LABELS,
  CONCEPTOS,
  CONCEPTO_LABELS,
} from "./types"
import { facturaSchema } from "@/lib/validations/factura"

type FacturaFormData = Omit<Factura, "id">

const EMPTY_LINEA: Omit<LineaFactura, "id"> = {
  concepto: "matricula",
  descripcion: "",
  cantidad: 1,
  precio_unitario: 0,
  subtotal: 0,
}

const EMPTY_FORM: FacturaFormData = {
  numero: "",
  alumno_id: "",
  alumno_nombre: "",
  fecha_emision: new Date().toISOString().split("T")[0],
  fecha_vencimiento: "",
  lineas: [],
  total: 0,
  estado: "pendiente",
  metodo_pago: null,
  fecha_pago: null,
  notas: null,
}

interface FacturaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  factura?: Factura | null
  onSave: (data: FacturaFormData) => void
  nextNumero: string
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

export function FacturaFormDialog({
  open,
  onOpenChange,
  factura,
  onSave,
  nextNumero,
}: FacturaFormDialogProps) {
  const [form, setForm] = React.useState<FacturaFormData>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const isEditing = !!factura

  React.useEffect(() => {
    if (factura) {
      const { id: _, ...rest } = factura
      setForm(rest)
    } else {
      setForm({ ...EMPTY_FORM, numero: nextNumero })
    }
    setErrors({})
  }, [factura, open, nextNumero])

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function updateLinea(index: number, updates: Partial<LineaFactura>) {
    const newLineas = form.lineas.map((l, i) => {
      if (i !== index) return l
      const updated = { ...l, ...updates }
      updated.subtotal = updated.cantidad * updated.precio_unitario
      return updated
    })
    const total = newLineas.reduce((sum, l) => sum + l.subtotal, 0)
    setForm({ ...form, lineas: newLineas, total })
    clearError("lineas")
  }

  function addLinea() {
    const newLinea: LineaFactura = {
      ...EMPTY_LINEA,
      id: String(Date.now()),
    }
    setForm({ ...form, lineas: [...form.lineas, newLinea] })
    clearError("lineas")
  }

  function removeLinea(index: number) {
    const newLineas = form.lineas.filter((_, i) => i !== index)
    const total = newLineas.reduce((sum, l) => sum + l.subtotal, 0)
    setForm({ ...form, lineas: newLineas, total })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = facturaSchema.safeParse(form)
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar factura" : "Nueva factura"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la factura."
              : "Crea una nueva factura para un alumno."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="numero">Nº Factura</Label>
              <Input
                id="numero"
                value={form.numero}
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alumno_nombre">Alumno *</Label>
              <Input
                id="alumno_nombre"
                placeholder="Nombre del alumno"
                value={form.alumno_nombre}
                onChange={(e) => {
                  setForm({ ...form, alumno_nombre: e.target.value })
                  clearError("alumno_nombre")
                }}
              />
              {errors.alumno_nombre && <p className="text-xs text-destructive mt-1">{errors.alumno_nombre}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha_emision">Fecha emisión *</Label>
              <Input
                id="fecha_emision"
                type="date"
                value={form.fecha_emision}
                onChange={(e) => {
                  setForm({ ...form, fecha_emision: e.target.value })
                  clearError("fecha_emision")
                }}
              />
              {errors.fecha_emision && <p className="text-xs text-destructive mt-1">{errors.fecha_emision}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fecha_vencimiento">Fecha vencimiento *</Label>
              <Input
                id="fecha_vencimiento"
                type="date"
                value={form.fecha_vencimiento}
                onChange={(e) => {
                  setForm({ ...form, fecha_vencimiento: e.target.value })
                  clearError("fecha_vencimiento")
                }}
              />
              {errors.fecha_vencimiento && <p className="text-xs text-destructive mt-1">{errors.fecha_vencimiento}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Estado *</Label>
              <Select
                value={form.estado}
                onValueChange={(val) =>
                  val && setForm({ ...form, estado: val as EstadoFactura })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_FACTURA.map((e) => (
                    <SelectItem key={e} value={e}>
                      {ESTADO_FACTURA_LABELS[e]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Método de pago</Label>
              <Select
                value={form.metodo_pago ?? "sin_definir"}
                onValueChange={(val) =>
                  setForm({
                    ...form,
                    metodo_pago: val === "sin_definir" ? null : (val as MetodoPago),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sin_definir">Sin definir</SelectItem>
                  {METODOS_PAGO.map((m) => (
                    <SelectItem key={m} value={m}>
                      {METODO_PAGO_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Líneas de factura</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLinea}>
                <Plus className="size-3.5" data-icon="inline-start" />
                Añadir línea
              </Button>
            </div>
            {errors.lineas && <p className="text-xs text-destructive mb-2">{errors.lineas}</p>}
            {form.lineas.length > 0 ? (
              <div className="space-y-3">
                {form.lineas.map((linea, idx) => (
                  <div
                    key={linea.id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <Select
                        value={linea.concepto}
                        onValueChange={(val) =>
                          val &&
                          updateLinea(idx, {
                            concepto: val as ConceptoFactura,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONCEPTOS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {CONCEPTO_LABELS[c]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLinea(idx)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Descripción"
                      value={linea.descripcion}
                      onChange={(e) =>
                        updateLinea(idx, { descripcion: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Cantidad</Label>
                        <Input
                          type="number"
                          min={1}
                          value={linea.cantidad}
                          onChange={(e) =>
                            updateLinea(idx, {
                              cantidad: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Precio unit. (€)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={linea.precio_unitario}
                          onChange={(e) =>
                            updateLinea(idx, {
                              precio_unitario: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Subtotal</Label>
                        <Input
                          value={formatCurrency(linea.subtotal)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay líneas. Haz clic en &quot;Añadir línea&quot; para empezar.
              </p>
            )}
            <div className="flex justify-end mt-3">
              <div className="text-right">
                <span className="text-sm text-muted-foreground mr-3">Total:</span>
                <span className="text-lg font-bold">{formatCurrency(form.total)}</span>
              </div>
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
              {isEditing ? "Guardar cambios" : "Crear factura"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
