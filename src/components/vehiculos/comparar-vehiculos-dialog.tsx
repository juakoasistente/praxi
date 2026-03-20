"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Vehiculo, CosteVehiculo, IncidenciaVehiculo } from "./types"
import { TIPO_LABELS, ESTADO_LABELS } from "./types"

interface CompararVehiculosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehiculos: Vehiculo[]
  costes: CosteVehiculo[]
  incidencias: IncidenciaVehiculo[]
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

type CompareMode = "lower" | "higher" | "none"

interface CompareRow {
  label: string
  valueA: string
  valueB: string
  winner: "a" | "b" | "tie" | "none"
}

function getWinner(a: number, b: number, mode: CompareMode): "a" | "b" | "tie" | "none" {
  if (mode === "none") return "none"
  if (a === b) return "tie"
  if (mode === "lower") return a < b ? "a" : "b"
  return a > b ? "a" : "b"
}

function winnerClass(winner: "a" | "b" | "tie" | "none", side: "a" | "b") {
  if (winner === side) return "text-green-600 dark:text-green-400 font-semibold"
  return ""
}

export function CompararVehiculosDialog({
  open,
  onOpenChange,
  vehiculos,
  costes,
  incidencias,
}: CompararVehiculosDialogProps) {
  const [idA, setIdA] = React.useState<string>("")
  const [idB, setIdB] = React.useState<string>("")

  React.useEffect(() => {
    if (open) {
      setIdA("")
      setIdB("")
    }
  }, [open])

  const vehiculoA = vehiculos.find((v) => v.id === idA) ?? null
  const vehiculoB = vehiculos.find((v) => v.id === idB) ?? null

  function totalCostes(vehiculoId: string) {
    return costes
      .filter((c) => c.vehiculo_id === vehiculoId)
      .reduce((sum, c) => sum + c.importe, 0)
  }

  function totalIncidencias(vehiculoId: string) {
    return incidencias.filter((i) => i.vehiculo_id === vehiculoId).length
  }

  const rows: CompareRow[] =
    vehiculoA && vehiculoB
      ? (() => {
          const costesA = totalCostes(vehiculoA.id)
          const costesB = totalCostes(vehiculoB.id)
          const costeTotalA = vehiculoA.precio_adquisicion + costesA
          const costeTotalB = vehiculoB.precio_adquisicion + costesB
          const incA = totalIncidencias(vehiculoA.id)
          const incB = totalIncidencias(vehiculoB.id)
          const costePorKmA = vehiculoA.km_actuales > 0 ? costeTotalA / vehiculoA.km_actuales : 0
          const costePorKmB = vehiculoB.km_actuales > 0 ? costeTotalB / vehiculoB.km_actuales : 0

          return [
            { label: "Marca / Modelo", valueA: `${vehiculoA.marca} ${vehiculoA.modelo}`, valueB: `${vehiculoB.marca} ${vehiculoB.modelo}`, winner: "none" as const },
            { label: "Matrícula", valueA: vehiculoA.matricula, valueB: vehiculoB.matricula, winner: "none" as const },
            { label: "Tipo", valueA: TIPO_LABELS[vehiculoA.tipo], valueB: TIPO_LABELS[vehiculoB.tipo], winner: "none" as const },
            { label: "Año", valueA: String(vehiculoA.año), valueB: String(vehiculoB.año), winner: getWinner(vehiculoA.año, vehiculoB.año, "higher") },
            { label: "Km actuales", valueA: vehiculoA.km_actuales.toLocaleString("es-ES") + " km", valueB: vehiculoB.km_actuales.toLocaleString("es-ES") + " km", winner: getWinner(vehiculoA.km_actuales, vehiculoB.km_actuales, "lower") },
            { label: "Estado", valueA: ESTADO_LABELS[vehiculoA.estado], valueB: ESTADO_LABELS[vehiculoB.estado], winner: "none" as const },
            { label: "Precio adquisición", valueA: formatCurrency(vehiculoA.precio_adquisicion), valueB: formatCurrency(vehiculoB.precio_adquisicion), winner: "none" as const },
            { label: "Total costes", valueA: formatCurrency(costesA), valueB: formatCurrency(costesB), winner: getWinner(costesA, costesB, "lower") },
            { label: "Total incidencias", valueA: String(incA), valueB: String(incB), winner: getWinner(incA, incB, "lower") },
            { label: "Coste total", valueA: formatCurrency(costeTotalA), valueB: formatCurrency(costeTotalB), winner: getWinner(costeTotalA, costeTotalB, "lower") },
            { label: "Coste por km", valueA: formatCurrency(costePorKmA) + "/km", valueB: formatCurrency(costePorKmB) + "/km", winner: getWinner(costePorKmA, costePorKmB, "lower") },
          ]
        })()
      : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Comparar vehículos</DialogTitle>
          <DialogDescription>
            Selecciona dos vehículos para comparar sus datos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Vehículo A</Label>
            <Select value={idA} onValueChange={(val) => val && setIdA(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                {vehiculos.map((v) => (
                  <SelectItem key={v.id} value={v.id} disabled={v.id === idB}>
                    {v.marca} {v.modelo} ({v.matricula})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Vehículo B</Label>
            <Select value={idB} onValueChange={(val) => val && setIdB(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                {vehiculos.map((v) => (
                  <SelectItem key={v.id} value={v.id} disabled={v.id === idA}>
                    {v.marca} {v.modelo} ({v.matricula})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {vehiculoA && vehiculoB && (
          <>
            <Separator />
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2.5 font-medium">Métrica</th>
                    <th className="text-right p-2.5 font-medium">
                      {vehiculoA.marca} {vehiculoA.modelo}
                    </th>
                    <th className="text-right p-2.5 font-medium">
                      {vehiculoB.marca} {vehiculoB.modelo}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="p-2.5 text-muted-foreground">{row.label}</td>
                      <td className={`p-2.5 text-right ${winnerClass(row.winner, "a")}`}>
                        {row.valueA}
                      </td>
                      <td className={`p-2.5 text-right ${winnerClass(row.winner, "b")}`}>
                        {row.valueB}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {(!vehiculoA || !vehiculoB) && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Selecciona ambos vehículos para ver la comparación.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
