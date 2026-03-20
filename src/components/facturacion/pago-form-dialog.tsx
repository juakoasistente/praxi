"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PagoFactura, MetodoPago } from "./types"
import { METODO_PAGO_LABELS, METODOS_PAGO } from "./types"

interface PagoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facturaId: string
  totalFactura: number
  totalPagado: number
  onSave: (pago: Omit<PagoFactura, "id">) => void
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

export function PagoFormDialog({
  open,
  onOpenChange,
  facturaId,
  totalFactura,
  totalPagado,
  onSave,
}: PagoFormDialogProps) {
  const saldoPendiente = totalFactura - totalPagado
  const [importe, setImporte] = React.useState("")
  const [fecha, setFecha] = React.useState(new Date().toISOString().split("T")[0])
  const [metodoPago, setMetodoPago] = React.useState<MetodoPago>("efectivo")
  const [notas, setNotas] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setImporte("")
      setFecha(new Date().toISOString().split("T")[0])
      setMetodoPago("efectivo")
      setNotas("")
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const importeNum = parseFloat(importe)
    if (isNaN(importeNum) || importeNum <= 0) return

    onSave({
      factura_id: facturaId,
      importe: importeNum,
      fecha,
      metodo_pago: metodoPago,
      notas: notas.trim() || null,
    })
    onOpenChange(false)
  }

  const importeNum = parseFloat(importe) || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Registra un pago parcial o total para esta factura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Balance info */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total factura:</span>
              <span className="font-medium">{formatCurrency(totalFactura)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total pagado:</span>
              <span className="font-medium">{formatCurrency(totalPagado)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-medium">Pendiente:</span>
              <span className="font-bold text-amber-600">
                {formatCurrency(saldoPendiente)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="importe">Importe (€)</Label>
            <Input
              id="importe"
              type="number"
              step="0.01"
              min="0.01"
              max={saldoPendiente}
              placeholder={`Máx. ${saldoPendiente.toFixed(2)}`}
              value={importe}
              onChange={(e) => setImporte(e.target.value)}
              required
            />
            {importeNum > saldoPendiente && (
              <p className="text-xs text-red-600">
                El importe supera el saldo pendiente.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Método de pago</Label>
            <Select
              value={metodoPago}
              onValueChange={(val) => setMetodoPago(val as MetodoPago)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METODOS_PAGO.map((m) => (
                  <SelectItem key={m} value={m}>
                    {METODO_PAGO_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas (opcional)</Label>
            <Textarea
              id="notas"
              placeholder="Observaciones sobre el pago..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={importeNum <= 0 || importeNum > saldoPendiente}
            >
              Registrar pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
