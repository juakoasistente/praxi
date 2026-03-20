"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { Alumno } from "./types"
import { ESTADO_LABELS, ESTADO_COLORS } from "./types"

interface AlumnoDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumno: Alumno | null
  onEdit: (alumno: Alumno) => void
  onBaja: (alumno: Alumno) => void
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

export function AlumnoDetailSheet({
  open,
  onOpenChange,
  alumno,
  onEdit,
  onBaja,
}: AlumnoDetailSheetProps) {
  if (!alumno) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {alumno.nombre} {alumno.apellidos}
          </SheetTitle>
          <SheetDescription>Ficha del alumno</SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4">
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              Permiso {alumno.permiso}
            </Badge>
            <Badge className={`border-0 ${ESTADO_COLORS[alumno.estado]}`}>
              {ESTADO_LABELS[alumno.estado]}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-0.5 text-sm">
            <DetailRow label="DNI" value={alumno.dni} />
            <DetailRow label="Teléfono" value={alumno.telefono} />
            <DetailRow label="Email" value={alumno.email} />
            <DetailRow
              label="Fecha de nacimiento"
              value={formatDate(alumno.fecha_nacimiento)}
            />
            <DetailRow label="Dirección" value={alumno.direccion} />
            <DetailRow
              label="Fecha de matrícula"
              value={formatDate(alumno.fecha_matricula)}
            />
          </div>
          {alumno.notas && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notas</p>
                <p className="text-sm">{alumno.notas}</p>
              </div>
            </>
          )}
          <Separator />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false)
                onEdit(alumno)
              }}
            >
              Editar
            </Button>
            {alumno.estado !== "baja" && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onBaja(alumno)}
              >
                Dar de baja
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
