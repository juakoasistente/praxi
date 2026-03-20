"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DocumentoChecklist } from "./documento-checklist"
import type { TramiteDGT, EstadoTramite } from "./types"
import {
  TIPO_TRAMITE_LABELS,
  TIPO_TRAMITE_COLORS,
  ESTADO_TRAMITE_LABELS,
  ESTADO_TRAMITE_COLORS,
} from "./types"
import { FileText, Calendar, MapPin, Hash, Euro, Download } from "lucide-react"
import { toast } from "sonner"

interface TramiteDetailSheetProps {
  tramite: TramiteDGT | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<TramiteDGT>) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const TIMELINE_STEPS: { estado: EstadoTramite; label: string }[] = [
  { estado: "pendiente", label: "Pendiente" },
  { estado: "en_proceso", label: "En proceso" },
  { estado: "completado", label: "Completado" },
]

function EstadoTimeline({ estado }: { estado: EstadoTramite }) {
  const currentIdx = estado === "rechazado" ? -1 : TIMELINE_STEPS.findIndex((s) => s.estado === estado)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Progreso del trámite</p>
      <div className="flex items-center gap-1">
        {TIMELINE_STEPS.map((step, idx) => {
          const isActive = idx <= currentIdx
          const isCurrent = idx === currentIdx
          return (
            <div key={step.estado} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isActive
                    ? isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
      {estado === "rechazado" && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center mt-1">
          Trámite rechazado
        </p>
      )}
    </div>
  )
}

export function TramiteDetailSheet({ tramite, open, onOpenChange, onUpdate }: TramiteDetailSheetProps) {
  if (!tramite) return null

  function handleDocumentosChange(entregados: string[]) {
    if (!tramite) return
    onUpdate(tramite.id, { documentos_entregados: entregados })
  }

  function handleMarcarCompletado() {
    if (!tramite) return
    onUpdate(tramite.id, { estado: "completado", fecha_resolucion: new Date().toISOString().split("T")[0] })
    toast.success("Trámite marcado como completado")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{tramite.alumno_nombre}</SheetTitle>
          <SheetDescription>
            <Badge className={`border-0 ${TIPO_TRAMITE_COLORS[tramite.tipo]}`}>
              {TIPO_TRAMITE_LABELS[tramite.tipo]}
            </Badge>
            {" "}
            <Badge className={`border-0 ${ESTADO_TRAMITE_COLORS[tramite.estado]}`}>
              {ESTADO_TRAMITE_LABELS[tramite.estado]}
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          {/* Timeline */}
          <EstadoTimeline estado={tramite.estado} />

          <Separator />

          {/* Info grid */}
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Fecha inicio:</span>
              <span className="font-medium">{formatDate(tramite.fecha_inicio)}</span>
            </div>
            {tramite.fecha_resolucion && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Resolución:</span>
                <span className="font-medium">{formatDate(tramite.fecha_resolucion)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Centro:</span>
              <span className="font-medium">{tramite.centro_dgt}</span>
            </div>
            {tramite.numero_expediente && (
              <div className="flex items-center gap-2">
                <Hash className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expediente:</span>
                <span className="font-mono font-medium">{tramite.numero_expediente}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Euro className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tasa:</span>
              <span className="font-medium">
                {tramite.importe_tasa.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                {" "}
                {tramite.tasa_pagada ? (
                  <span className="text-green-600 dark:text-green-400">(pagada)</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">(pendiente)</span>
                )}
              </span>
            </div>
          </div>

          <Separator />

          {/* Document checklist */}
          <DocumentoChecklist
            documentos={tramite.documentos}
            entregados={tramite.documentos_entregados}
            onChange={handleDocumentosChange}
          />

          <Separator />

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1">
              <FileText className="size-3.5" />
              Notas
            </Label>
            <Textarea
              value={tramite.notas ?? ""}
              onChange={(e) => onUpdate(tramite.id, { notas: e.target.value || null })}
              placeholder="Añadir notas sobre el trámite..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {tramite.estado !== "completado" && tramite.estado !== "rechazado" && (
              <Button size="sm" onClick={handleMarcarCompletado}>
                Marcar completado
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Exportación de documentación no disponible aún")}
            >
              <Download className="size-4" />
              Exportar documentación
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
