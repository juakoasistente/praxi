"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  type Clase,
  type EstadoClase,
  VEHICULOS,
  PROFESORES_CLASES,
  ESTADO_LABELS,
  ESTADO_COLORS,
} from "./mock-data"

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{children}</span>
    </div>
  )
}

interface ClaseDetailDialogProps {
  clase: Clase | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChangeEstado: (id: string, estado: EstadoClase) => void
}

export function ClaseDetailDialog({ clase, open, onOpenChange, onChangeEstado }: ClaseDetailDialogProps) {
  if (!clase) return null

  const vehiculo = VEHICULOS.find((v) => v.id === clase.vehiculo_id)
  const profesor = PROFESORES_CLASES.find((p) => p.id === clase.profesor_id)
  const fechaFormatted = new Date(clase.fecha + "T00:00:00").toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de clase</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <DetailRow label="Alumno">
            {clase.alumno_nombre} {clase.alumno_apellidos}
          </DetailRow>
          <DetailRow label="Profesor">
            {profesor ? `${profesor.nombre} ${profesor.apellidos}` : "—"}
          </DetailRow>
          <DetailRow label="Fecha">
            <span className="capitalize">{fechaFormatted}</span>
          </DetailRow>
          <DetailRow label="Horario">
            {clase.hora_inicio} – {clase.hora_fin}
          </DetailRow>
          <DetailRow label="Vehículo">
            {vehiculo ? `${vehiculo.modelo} (${vehiculo.matricula})` : "—"}
          </DetailRow>
          <DetailRow label="Estado">
            <Badge variant="outline" className={ESTADO_COLORS[clase.estado]}>
              {ESTADO_LABELS[clase.estado]}
            </Badge>
          </DetailRow>
          {clase.notas && (
            <DetailRow label="Notas">
              <span className="text-muted-foreground font-normal">{clase.notas}</span>
            </DetailRow>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          {clase.estado === "programada" && (
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  onChangeEstado(clase.id, "completada")
                  onOpenChange(false)
                }}
              >
                Marcar completada
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onChangeEstado(clase.id, "cancelada")
                  onOpenChange(false)
                }}
              >
                Cancelar clase
              </Button>
            </>
          )}
          <DialogClose render={<Button variant="outline" size="sm" />}>
            Cerrar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
