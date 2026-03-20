"use client"

import * as React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV, exportFormatCurrency } from "@/lib/export"

interface VehiculoMock {
  id: string
  matricula: string
  modelo: string
  km_totales: number
  coste_combustible: number
  coste_mantenimiento: number
  coste_seguro: number
  coste_itv: number
}

const MOCK_VEHICULOS: VehiculoMock[] = [
  { id: "v1", matricula: "1234 ABC", modelo: "Seat León", km_totales: 45200, coste_combustible: 1800, coste_mantenimiento: 650, coste_seguro: 800, coste_itv: 45 },
  { id: "v2", matricula: "5678 DEF", modelo: "Citroën C3", km_totales: 38100, coste_combustible: 1500, coste_mantenimiento: 420, coste_seguro: 750, coste_itv: 45 },
  { id: "v3", matricula: "9012 GHI", modelo: "Renault Clio", km_totales: 52300, coste_combustible: 2100, coste_mantenimiento: 890, coste_seguro: 800, coste_itv: 45 },
  { id: "v4", matricula: "3456 JKL", modelo: "Yamaha MT-07", km_totales: 12400, coste_combustible: 480, coste_mantenimiento: 320, coste_seguro: 600, coste_itv: 30 },
  { id: "v5", matricula: "7890 MNO", modelo: "Peugeot 208", km_totales: 29800, coste_combustible: 1200, coste_mantenimiento: 380, coste_seguro: 720, coste_itv: 45 },
]

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
}

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6"]

export function InformeVehiculos() {
  const stats = React.useMemo(() => {
    const totalCoste = MOCK_VEHICULOS.reduce(
      (sum, v) => sum + v.coste_combustible + v.coste_mantenimiento + v.coste_seguro + v.coste_itv,
      0
    )
    return { flota: MOCK_VEHICULOS.length, totalCoste }
  }, [])

  const gastosPorCategoria = React.useMemo(() => {
    const combustible = MOCK_VEHICULOS.reduce((sum, v) => sum + v.coste_combustible, 0)
    const mantenimiento = MOCK_VEHICULOS.reduce((sum, v) => sum + v.coste_mantenimiento, 0)
    const seguro = MOCK_VEHICULOS.reduce((sum, v) => sum + v.coste_seguro, 0)
    const itv = MOCK_VEHICULOS.reduce((sum, v) => sum + v.coste_itv, 0)
    return [
      { name: "Combustible", value: combustible },
      { name: "Mantenimiento", value: mantenimiento },
      { name: "Seguro", value: seguro },
      { name: "ITV", value: itv },
    ]
  }, [])

  const vehiculosConCoste = React.useMemo(() => {
    return MOCK_VEHICULOS.map((v) => {
      const costeTotal = v.coste_combustible + v.coste_mantenimiento + v.coste_seguro + v.coste_itv
      const costeKm = v.km_totales > 0 ? costeTotal / v.km_totales : 0
      return { ...v, costeTotal, costeKm }
    }).sort((a, b) => b.costeKm - a.costeKm)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">Informe de vehículos</h3>
        <ExportButton
          onExport={() =>
            exportToCSV(vehiculosConCoste, [
              { key: "matricula", label: "Matrícula" },
              { key: "modelo", label: "Modelo" },
              { key: "km_totales", label: "Km totales" },
              { key: "coste_combustible", label: "Combustible", format: (v) => exportFormatCurrency(v as number) },
              { key: "coste_mantenimiento", label: "Mantenimiento", format: (v) => exportFormatCurrency(v as number) },
              { key: "coste_seguro", label: "Seguro", format: (v) => exportFormatCurrency(v as number) },
              { key: "costeTotal", label: "Coste total", format: (v) => exportFormatCurrency(v as number) },
            ], "informe-vehiculos")
          }
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Vehículos en flota</p>
          <p className="text-2xl font-bold">{stats.flota}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Coste total</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.totalCoste)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Coste medio por vehículo</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalCoste / stats.flota)}</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gastosPorCategoria}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              labelLine={{ strokeWidth: 1 }}
            >
              {gastosPorCategoria.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--background))",
                fontSize: "13px",
              }}
              formatter={(value) => [formatCurrency(value as number)]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehículo</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead className="text-right">Km totales</TableHead>
              <TableHead className="text-right">Combustible</TableHead>
              <TableHead className="text-right">Mantenimiento</TableHead>
              <TableHead className="text-right">Coste total</TableHead>
              <TableHead className="text-right">€/km</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehiculosConCoste.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.modelo}</TableCell>
                <TableCell className="font-mono text-xs">{v.matricula}</TableCell>
                <TableCell className="text-right">{v.km_totales.toLocaleString("es-ES")}</TableCell>
                <TableCell className="text-right">{formatCurrency(v.coste_combustible)}</TableCell>
                <TableCell className="text-right">{formatCurrency(v.coste_mantenimiento)}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(v.costeTotal)}</TableCell>
                <TableCell className="text-right font-mono text-xs">{v.costeKm.toFixed(3)} €</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
