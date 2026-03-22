"use client"

import { useState } from "react"
import { AlertTriangle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { TipoIncidencia, Incidencia } from "./types"
import { toast } from "sonner"

interface IncidenciaFormDialogProps {
  empleados: { id: string; nombre: string }[]
  onIncidencia: (incidencia: Omit<Incidencia, "id" | "aprobada">) => void
  children?: React.ReactNode
}

export function IncidenciaFormDialog({ empleados, onIncidencia, children }: IncidenciaFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    usuario_id: "",
    usuario_nombre: "",
    fecha: new Date().toISOString().split('T')[0],
    tipo: "" as TipoIncidencia | "",
    descripcion: ""
  })

  const tiposIncidencia = [
    { value: "llegada_tarde", label: "Llegada tarde", icon: "⏰" },
    { value: "salida_anticipada", label: "Salida anticipada", icon: "🚪" },
    { value: "ausencia_justificada", label: "Ausencia justificada", icon: "📋" },
    { value: "ausencia_injustificada", label: "Ausencia injustificada", icon: "❌" },
    { value: "teletrabajo", label: "Teletrabajo", icon: "🏠" },
    { value: "otro", label: "Otro", icon: "📝" }
  ]

  const handleEmpleadoChange = (empleadoId: string | null) => {
    if (!empleadoId) return
    const empleado = empleados.find(e => e.id === empleadoId)
    setForm({
      ...form,
      usuario_id: empleadoId,
      usuario_nombre: empleado?.nombre || ""
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.usuario_id || !form.tipo || !form.descripcion.trim()) {
      toast.error("Por favor, completa todos los campos obligatorios")
      return
    }

    setLoading(true)

    try {
      await onIncidencia({
        usuario_id: form.usuario_id,
        usuario_nombre: form.usuario_nombre,
        fecha: form.fecha,
        tipo: form.tipo as TipoIncidencia,
        descripcion: form.descripcion.trim()
      })

      toast.success("Incidencia registrada correctamente")
      setOpen(false)
      setForm({
        usuario_id: "",
        usuario_nombre: "",
        fecha: new Date().toISOString().split('T')[0],
        tipo: "",
        descripcion: ""
      })
    } catch (error) {
      toast.error("Error al registrar la incidencia")
    } finally {
      setLoading(false)
    }
  }

  const getTipoDescripcion = (tipo: TipoIncidencia | "") => {
    switch (tipo) {
      case "llegada_tarde":
        return "Registra cuando un empleado llega tarde a su turno programado"
      case "salida_anticipada":
        return "Registra cuando un empleado se va antes de su hora de salida"
      case "ausencia_justificada":
        return "Ausencia con justificante médico, permiso laboral, etc."
      case "ausencia_injustificada":
        return "Falta sin justificación previa ni posterior"
      case "teletrabajo":
        return "Día de trabajo remoto autorizado"
      case "otro":
        return "Otro tipo de incidencia no contemplada arriba"
      default:
        return "Selecciona el tipo de incidencia para ver más detalles"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva incidencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Registrar incidencia
          </DialogTitle>
          <DialogDescription>
            Registra incidencias laborales que afecten el control horario. Esta información
            será tenida en cuenta para la gestión de RRHH.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Empleado */}
          <div className="space-y-2">
            <Label htmlFor="empleado">Empleado *</Label>
            <Select
              value={form.usuario_id}
              onValueChange={handleEmpleadoChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empleado" />
              </SelectTrigger>
              <SelectContent>
                {empleados.map((empleado) => (
                  <SelectItem key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha *</Label>
            <Input
              id="fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
              max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
            />
          </div>

          {/* Tipo de incidencia */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de incidencia *</Label>
            <Select
              value={form.tipo}
              onValueChange={(value) => value && setForm({ ...form, tipo: value as TipoIncidencia })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposIncidencia.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    <div className="flex items-center gap-2">
                      <span>{tipo.icon}</span>
                      <span>{tipo.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Descripción del tipo seleccionado */}
            {form.tipo && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                {getTipoDescripcion(form.tipo)}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe los detalles de la incidencia, motivos, duración estimada, etc."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              required
              minLength={10}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 10 caracteres, máximo 500. ({form.descripcion.length}/500)
            </p>
          </div>

          {/* Información legal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Información:</strong> Esta incidencia quedará registrada en el sistema de control
              horario según el Real Decreto-ley 8/2019. Los datos se conservarán durante 4 años para
              inspecciones laborales.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !form.usuario_id || !form.tipo || !form.descripcion.trim()}
            >
              {loading ? "Registrando..." : "Registrar incidencia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}