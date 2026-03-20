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
import { Plus } from "lucide-react"
import type { Vehiculo, CosteVehiculo, IncidenciaVehiculo } from "./types"
import {
  TIPO_LABELS,
  ESTADO_LABELS,
  ESTADO_COLORS,
  CATEGORIA_COSTE_LABELS,
  TIPO_INCIDENCIA_LABELS,
  TIPO_INCIDENCIA_COLORS,
} from "./types"

interface VehiculoDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehiculo: Vehiculo | null
  costes: CosteVehiculo[]
  incidencias: IncidenciaVehiculo[]
  onEdit: (vehiculo: Vehiculo) => void
  onBaja: (vehiculo: Vehiculo) => void
  onAddCoste: () => void
  onAddIncidencia: () => void
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

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

export function VehiculoDetailSheet({
  open,
  onOpenChange,
  vehiculo,
  costes,
  incidencias,
  onEdit,
  onBaja,
  onAddCoste,
  onAddIncidencia,
}: VehiculoDetailSheetProps) {
  if (!vehiculo) return null

  const vehiculoCostes = costes
    .filter((c) => c.vehiculo_id === vehiculo.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const totalCostes = vehiculoCostes.reduce((sum, c) => sum + c.importe, 0)
  const costeTotal = vehiculo.precio_adquisicion + totalCostes

  const vehiculoIncidencias = incidencias
    .filter((i) => i.vehiculo_id === vehiculo.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {vehiculo.marca} {vehiculo.modelo}
          </SheetTitle>
          <SheetDescription>Ficha del vehículo</SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4">
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              {TIPO_LABELS[vehiculo.tipo]}
            </Badge>
            <Badge className={`border-0 ${ESTADO_COLORS[vehiculo.estado]}`}>
              {ESTADO_LABELS[vehiculo.estado]}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-0.5 text-sm">
            <DetailRow label="Matrícula" value={vehiculo.matricula} />
            <DetailRow label="Año" value={String(vehiculo.año)} />
            <DetailRow
              label="Km actuales"
              value={vehiculo.km_actuales.toLocaleString("es-ES") + " km"}
            />
            <DetailRow
              label="Fecha de adquisición"
              value={formatDate(vehiculo.fecha_adquisicion)}
            />
            <DetailRow
              label="Precio adquisición"
              value={formatCurrency(vehiculo.precio_adquisicion)}
            />
          </div>
          {vehiculo.notas && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notas</p>
                <p className="text-sm">{vehiculo.notas}</p>
              </div>
            </>
          )}
          <Separator />
          {/* Amortization summary */}
          <div className="rounded-lg border p-3 space-y-1.5 text-sm">
            <p className="font-semibold mb-2">Resumen de costes</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio adquisición</span>
              <span>{formatCurrency(vehiculo.precio_adquisicion)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Costes registrados ({vehiculoCostes.length})
              </span>
              <span>{formatCurrency(totalCostes)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Coste total</span>
              <span>{formatCurrency(costeTotal)}</span>
            </div>
          </div>
          {/* Cost list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Historial de costes</p>
              <Button variant="outline" size="sm" onClick={onAddCoste}>
                <Plus className="size-3.5" data-icon="inline-start" />
                Añadir
              </Button>
            </div>
            {vehiculoCostes.length > 0 ? (
              <div className="space-y-2">
                {vehiculoCostes.map((coste) => (
                  <div
                    key={coste.id}
                    className="flex items-start justify-between rounded-lg border p-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium">{coste.concepto}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(coste.fecha)} ·{" "}
                        {CATEGORIA_COSTE_LABELS[coste.categoria]}
                      </p>
                    </div>
                    <span className="font-medium whitespace-nowrap ml-2">
                      {formatCurrency(coste.importe)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay costes registrados.
              </p>
            )}
          </div>
          <Separator />
          {/* Incidencias */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">
                Incidencias ({vehiculoIncidencias.length})
              </p>
              <Button variant="outline" size="sm" onClick={onAddIncidencia}>
                <Plus className="size-3.5" data-icon="inline-start" />
                Añadir
              </Button>
            </div>
            {vehiculoIncidencias.length > 0 ? (
              <div className="space-y-2">
                {vehiculoIncidencias.map((inc) => (
                  <div
                    key={inc.id}
                    className="rounded-lg border p-2.5 text-sm space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(inc.fecha)}
                      </span>
                      <Badge
                        className={`border-0 text-xs ${TIPO_INCIDENCIA_COLORS[inc.tipo]}`}
                      >
                        {TIPO_INCIDENCIA_LABELS[inc.tipo]}
                      </Badge>
                    </div>
                    <p>{inc.descripcion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay incidencias registradas.
              </p>
            )}
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false)
                onEdit(vehiculo)
              }}
            >
              Editar
            </Button>
            {vehiculo.estado !== "baja" && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onBaja(vehiculo)}
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
