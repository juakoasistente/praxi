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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Factura } from "./types"
import {
  ESTADO_FACTURA_LABELS,
  ESTADO_FACTURA_COLORS,
  METODO_PAGO_LABELS,
  CONCEPTO_LABELS,
} from "./types"
import { DescargarPdfButton } from "./descargar-pdf-button"

interface FacturaDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  factura: Factura | null
  onEdit: (factura: Factura) => void
  onMarkPaid: (factura: Factura) => void
  onAnular: (factura: Factura) => void
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

export function FacturaDetailSheet({
  open,
  onOpenChange,
  factura,
  onEdit,
  onMarkPaid,
  onAnular,
}: FacturaDetailSheetProps) {
  if (!factura) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{factura.numero}</SheetTitle>
          <SheetDescription>Detalle de la factura</SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4">
          <div className="flex gap-2">
            <Badge
              className={`border-0 ${ESTADO_FACTURA_COLORS[factura.estado]}`}
            >
              {ESTADO_FACTURA_LABELS[factura.estado]}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-0.5 text-sm">
            <DetailRow label="Alumno" value={factura.alumno_nombre} />
            <DetailRow
              label="Fecha emisión"
              value={formatDate(factura.fecha_emision)}
            />
            <DetailRow
              label="Fecha vencimiento"
              value={formatDate(factura.fecha_vencimiento)}
            />
            <DetailRow
              label="Método de pago"
              value={
                factura.metodo_pago
                  ? METODO_PAGO_LABELS[factura.metodo_pago]
                  : null
              }
            />
            {factura.fecha_pago && (
              <DetailRow
                label="Fecha de pago"
                value={formatDate(factura.fecha_pago)}
              />
            )}
          </div>
          <Separator />
          {/* Line items table */}
          <div>
            <p className="text-sm font-semibold mb-2">Líneas de factura</p>
            {factura.lineas.length > 0 ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Cant.</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factura.lineas.map((linea) => (
                      <TableRow key={linea.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-xs">
                              {CONCEPTO_LABELS[linea.concepto]}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {linea.descripcion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {linea.cantidad}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(linea.precio_unitario)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(linea.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay líneas registradas.
              </p>
            )}
            <div className="flex justify-end mt-3 p-2 rounded-lg bg-muted/50">
              <div className="text-right">
                <span className="text-sm text-muted-foreground mr-3">
                  Total:
                </span>
                <span className="text-lg font-bold">
                  {formatCurrency(factura.total)}
                </span>
              </div>
            </div>
          </div>
          {factura.notas && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notas</p>
                <p className="text-sm">{factura.notas}</p>
              </div>
            </>
          )}
          <Separator />
          <div className="flex gap-2 flex-wrap">
            <DescargarPdfButton factura={factura} />
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false)
                onEdit(factura)
              }}
            >
              Editar
            </Button>
            {factura.estado !== "pagada" && factura.estado !== "anulada" && (
              <Button
                className="flex-1"
                onClick={() => onMarkPaid(factura)}
              >
                Marcar como pagada
              </Button>
            )}
            {factura.estado !== "anulada" && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onAnular(factura)}
              >
                Anular
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
