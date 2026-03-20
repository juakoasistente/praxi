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
import { exportToCSV, exportFormatDate } from "@/lib/export"
import { DateRangePicker, type DateRange } from "./date-range-picker"

interface ExamenMock {
  id: string
  fecha: string
  alumno: string
  tipo: "teorico" | "practico"
  resultado: "aprobado" | "suspendido" | "pendiente"
}

const MOCK_EXAMENES: ExamenMock[] = [
  { id: "e1", fecha: "2026-01-15", alumno: "María García López", tipo: "teorico", resultado: "aprobado" },
  { id: "e2", fecha: "2026-01-20", alumno: "Juan Pérez Martínez", tipo: "teorico", resultado: "aprobado" },
  { id: "e3", fecha: "2026-01-25", alumno: "Pedro López Hernández", tipo: "teorico", resultado: "suspendido" },
  { id: "e4", fecha: "2026-02-05", alumno: "María García López", tipo: "practico", resultado: "aprobado" },
  { id: "e5", fecha: "2026-02-10", alumno: "Sofía Díaz Moreno", tipo: "teorico", resultado: "aprobado" },
  { id: "e6", fecha: "2026-02-15", alumno: "Diego Navarro Torres", tipo: "teorico", resultado: "suspendido" },
  { id: "e7", fecha: "2026-02-20", alumno: "Juan Pérez Martínez", tipo: "practico", resultado: "suspendido" },
  { id: "e8", fecha: "2026-03-01", alumno: "Diego Navarro Torres", tipo: "teorico", resultado: "aprobado" },
  { id: "e9", fecha: "2026-03-05", alumno: "Elena Jiménez Vega", tipo: "teorico", resultado: "aprobado" },
  { id: "e10", fecha: "2026-03-10", alumno: "Juan Pérez Martínez", tipo: "practico", resultado: "aprobado" },
  { id: "e11", fecha: "2026-03-15", alumno: "Sofía Díaz Moreno", tipo: "practico", resultado: "pendiente" },
  { id: "e12", fecha: "2026-03-18", alumno: "Ana Rodríguez Sánchez", tipo: "teorico", resultado: "pendiente" },
]

const RESULTADO_LABELS: Record<string, string> = {
  aprobado: "Aprobado",
  suspendido: "Suspendido",
  pendiente: "Pendiente",
}

const RESULTADO_COLORS: Record<string, string> = {
  aprobado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  suspendido: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  pendiente: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function InformeExamenes() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  const filtered = React.useMemo(() => {
    return MOCK_EXAMENES.filter((e) => e.fecha >= range.from && e.fecha <= range.to)
  }, [range])

  const stats = React.useMemo(() => {
    const total = filtered.length
    const teoricos = filtered.filter((e) => e.tipo === "teorico")
    const practicos = filtered.filter((e) => e.tipo === "practico")
    const teoricoAprobados = teoricos.filter((e) => e.resultado === "aprobado").length
    const teoricoTotal = teoricos.filter((e) => e.resultado !== "pendiente").length
    const practicoAprobados = practicos.filter((e) => e.resultado === "aprobado").length
    const practicoTotal = practicos.filter((e) => e.resultado !== "pendiente").length

    return {
      total,
      pctTeorico: teoricoTotal > 0 ? Math.round((teoricoAprobados / teoricoTotal) * 100) : 0,
      pctPractico: practicoTotal > 0 ? Math.round((practicoAprobados / practicoTotal) * 100) : 0,
    }
  }, [filtered])

  const chartData = React.useMemo(() => {
    const byMonth: Record<string, { mes: string; aprobados: number; suspendidos: number }> = {}
    filtered.forEach((e) => {
      if (e.resultado === "pendiente") return
      const mes = e.fecha.slice(0, 7)
      const label = new Date(mes + "-01").toLocaleDateString("es-ES", { month: "short" })
      if (!byMonth[mes]) byMonth[mes] = { mes: label, aprobados: 0, suspendidos: 0 }
      if (e.resultado === "aprobado") byMonth[mes].aprobados++
      else byMonth[mes].suspendidos++
    })
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)
  }, [filtered])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">Informe de exámenes</h3>
        <ExportButton
          onExport={() =>
            exportToCSV(filtered, [
              { key: "fecha", label: "Fecha", format: (v) => exportFormatDate(v as string) },
              { key: "alumno", label: "Alumno" },
              { key: "tipo", label: "Tipo", format: (v) => (v as string) === "teorico" ? "Teórico" : "Práctico" },
              { key: "resultado", label: "Resultado", format: (v) => RESULTADO_LABELS[v as string] ?? String(v) },
            ], "informe-examenes")
          }
        />
      </div>

      <DateRangePicker value={range} onChange={setRange} />

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Total presentaciones</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">% Aprobados teórico</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.pctTeorico}%</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">% Aprobados práctico</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.pctPractico}%</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                  fontSize: "13px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">{value === "aprobados" ? "Aprobados" : "Suspendidos"}</span>
                )}
              />
              <Bar dataKey="aprobados" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="suspendidos" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Alumno</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-muted-foreground">{formatDate(e.fecha)}</TableCell>
                <TableCell className="font-medium">{e.alumno}</TableCell>
                <TableCell>{e.tipo === "teorico" ? "Teórico" : "Práctico"}</TableCell>
                <TableCell>
                  <Badge className={`border-0 ${RESULTADO_COLORS[e.resultado]}`}>
                    {RESULTADO_LABELS[e.resultado]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No hay exámenes en el período seleccionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
