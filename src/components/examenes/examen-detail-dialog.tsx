"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { Examen } from "./types"
import { TIPO_LABELS, RESULTADO_LABELS, RESULTADO_COLORS } from "./types"

interface ExamenDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  examen: Examen | null
  onEdit: (examen: Examen) => void
  onDelete: (examen: Examen) => void
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value ?? "—"}</span>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function ExamenDetailDialog({
  open,
  onOpenChange,
  examen,
  onEdit,
  onDelete,
}: ExamenDetailDialogProps) {
  if (!examen) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{examen.alumno_nombre}</DialogTitle>
          <DialogDescription>Detalle del examen</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              {TIPO_LABELS[examen.tipo]}
            </Badge>
            <Badge className={`border-0 ${RESULTADO_COLORS[examen.resultado]}`}>
              {RESULTADO_LABELS[examen.resultado]}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-0.5 text-sm">
            <DetailRow label="Alumno" value={examen.alumno_nombre} />
            <DetailRow label="Tipo" value={TIPO_LABELS[examen.tipo]} />
            <DetailRow label="Fecha" value={formatDate(examen.fecha)} />
            <DetailRow label="Hora" value={examen.hora} />
            <DetailRow label="Convocatoria" value={examen.convocatoria} />
            <DetailRow label="Intento" value={String(examen.intento)} />
            <DetailRow
              label="Resultado"
              value={RESULTADO_LABELS[examen.resultado]}
            />
            <DetailRow label="Centro de examen" value={examen.centro_examen} />
          </div>
          {examen.notas && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notas</p>
                <p className="text-sm">{examen.notas}</p>
              </div>
            </>
          )}
          <Separator />
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false)
                onEdit(examen)
              }}
            >
              Editar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onDelete(examen)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
