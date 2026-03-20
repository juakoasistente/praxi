"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV, exportFormatDate, exportFormatCurrency } from "@/lib/export"
import { DateRangePicker, type DateRange } from "./date-range-picker"

interface FacturaMock {
  id: string
  numero: string
  fecha: string
  alumno: string
  concepto: string
  importe: number
  estado: "pagada" | "pendiente" | "vencida"
}

const MOCK_FACTURAS: FacturaMock[] = [
  { id: "f1", numero: "FAC-2026-001", fecha: "2026-01-10", alumno: "María García López", concepto: "Matrícula permiso B", importe: 200, estado: "pagada" },
  { id: "f2", numero: "FAC-2026-002", fecha: "2026-01-15", alumno: "María García López", concepto: "Pack 10 clases prácticas", importe: 450, estado: "pagada" },
  { id: "f3", numero: "FAC-2026-003", fecha: "2026-01-20", alumno: "Juan Pérez Martínez", concepto: "Matrícula permiso B", importe: 200, estado: "pagada" },
  { id: "f4", numero: "FAC-2026-004", fecha: "2026-02-01", alumno: "Ana Rodríguez Sánchez", concepto: "Matrícula permiso AM", importe: 100, estado: "pagada" },
  { id: "f5", numero: "FAC-2026-005", fecha: "2026-02-10", alumno: "Juan Pérez Martínez", concepto: "Pack 10 clases prácticas", importe: 450, estado: "pendiente" },
  { id: "f6", numero: "FAC-2026-006", fecha: "2026-02-15", alumno: "Sofía Díaz Moreno", concepto: "Matrícula permiso A", importe: 250, estado: "pagada" },
  { id: "f7", numero: "FAC-2026-007", fecha: "2026-03-01", alumno: "Elena Jiménez Vega", concepto: "Matrícula permiso AM", importe: 100, estado: "pagada" },
  { id: "f8", numero: "FAC-2026-008", fecha: "2026-03-05", alumno: "Diego Navarro Torres", concepto: "Pack 10 clases prácticas", importe: 500, estado: "vencida" },
  { id: "f9", numero: "FAC-2026-009", fecha: "2026-03-10", alumno: "Sofía Díaz Moreno", concepto: "Pack 10 clases prácticas", importe: 500, estado: "pendiente" },
  { id: "f10", numero: "FAC-2026-010", fecha: "2026-03-15", alumno: "María García López", concepto: "Pack 5 clases extras", importe: 250, estado: "pagada" },
]

const GASTOS_MENSUALES = [
  { mes: "Ene", ingresos: 850, gastos: 520 },
  { mes: "Feb", ingresos: 800, gastos: 480 },
  { mes: "Mar", ingresos: 1350, gastos: 610 },
]

const ESTADO_LABELS: Record<string, string> = {
  pagada: "Pagada",
  pendiente: "Pendiente",
  vencida: "Vencida",
}

const ESTADO_COLORS: Record<string, string> = {
  pagada: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pendiente: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  vencida: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function InformeFinanciero() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  const filtered = React.useMemo(() => {
    return MOCK_FACTURAS.filter((f) => f.fecha >= range.from && f.fecha <= range.to)
  }, [range])

  const stats = React.useMemo(() => {
    const facturado = filtered.reduce((sum, f) => sum + f.importe, 0)
    const cobrado = filtered.filter((f) => f.estado === "pagada").reduce((sum, f) => sum + f.importe, 0)
    const pendiente = filtered.filter((f) => f.estado !== "pagada").reduce((sum, f) => sum + f.importe, 0)
    const gastos = GASTOS_MENSUALES.reduce((sum, m) => sum + m.gastos, 0)
    return { facturado, cobrado, pendiente, beneficio: cobrado - gastos }
  }, [filtered])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">Informe financiero</h3>
        <ExportButton
          onExport={() =>
            exportToCSV(filtered, [
              { key: "numero", label: "Nº Factura" },
              { key: "fecha", label: "Fecha", format: (v) => exportFormatDate(v as string) },
              { key: "alumno", label: "Alumno" },
              { key: "concepto", label: "Concepto" },
              { key: "importe", label: "Importe", format: (v) => exportFormatCurrency(v as number) },
              { key: "estado", label: "Estado", format: (v) => ESTADO_LABELS[v as string] ?? String(v) },
            ], "informe-financiero")
          }
        />
      </div>

      <DateRangePicker value={range} onChange={setRange} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total facturado", value: formatCurrency(stats.facturado) },
          { label: "Cobrado", value: formatCurrency(stats.cobrado), color: "text-green-600 dark:text-green-400" },
          { label: "Pendiente", value: formatCurrency(stats.pendiente), color: "text-amber-600 dark:text-amber-400" },
          { label: "Beneficio estimado", value: formatCurrency(stats.beneficio), color: "text-blue-600 dark:text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold ${s.color ?? "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={GASTOS_MENSUALES}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
            <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--background))",
                fontSize: "13px",
              }}
              formatter={(value) => [`${Number(value).toLocaleString("es-ES")} €`]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => <span className="text-sm text-foreground">{value === "ingresos" ? "Ingresos" : "Gastos"}</span>}
            />
            <Bar dataKey="ingresos" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="gastos" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Factura</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Alumno</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead className="text-right">Importe</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-mono text-xs">{f.numero}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(f.fecha)}</TableCell>
                <TableCell className="font-medium">{f.alumno}</TableCell>
                <TableCell>{f.concepto}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(f.importe)}</TableCell>
                <TableCell>
                  <Badge className={`border-0 ${ESTADO_COLORS[f.estado]}`}>{ESTADO_LABELS[f.estado]}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay facturas en el período seleccionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
