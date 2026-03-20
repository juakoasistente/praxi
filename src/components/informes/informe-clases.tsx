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
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV, exportFormatDate } from "@/lib/export"
import { DateRangePicker, type DateRange } from "./date-range-picker"

interface ClaseMock {
  id: string
  fecha: string
  alumno: string
  profesor: string
  tipo: string
  estado: "completada" | "cancelada" | "programada"
  duracion: number
}

const PROFESORES = ["Todos", "Carlos Ruiz", "Laura Martín", "Miguel Ángel Torres"]

const MOCK_CLASES: ClaseMock[] = [
  { id: "cl1", fecha: "2026-03-01", alumno: "María García López", profesor: "Carlos Ruiz", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl2", fecha: "2026-03-01", alumno: "Juan Pérez Martínez", profesor: "Laura Martín", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl3", fecha: "2026-03-02", alumno: "Sofía Díaz Moreno", profesor: "Carlos Ruiz", tipo: "Práctica", estado: "cancelada", duracion: 1 },
  { id: "cl4", fecha: "2026-03-03", alumno: "Diego Navarro Torres", profesor: "Miguel Ángel Torres", tipo: "Práctica", estado: "completada", duracion: 1.5 },
  { id: "cl5", fecha: "2026-03-04", alumno: "María García López", profesor: "Carlos Ruiz", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl6", fecha: "2026-03-05", alumno: "Elena Jiménez Vega", profesor: "Laura Martín", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl7", fecha: "2026-03-06", alumno: "Juan Pérez Martínez", profesor: "Carlos Ruiz", tipo: "Práctica", estado: "programada", duracion: 1 },
  { id: "cl8", fecha: "2026-03-07", alumno: "Ana Rodríguez Sánchez", profesor: "Laura Martín", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl9", fecha: "2026-03-08", alumno: "Sofía Díaz Moreno", profesor: "Carlos Ruiz", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl10", fecha: "2026-03-10", alumno: "Diego Navarro Torres", profesor: "Miguel Ángel Torres", tipo: "Práctica", estado: "completada", duracion: 1.5 },
  { id: "cl11", fecha: "2026-03-11", alumno: "María García López", profesor: "Carlos Ruiz", tipo: "Práctica", estado: "cancelada", duracion: 1 },
  { id: "cl12", fecha: "2026-03-12", alumno: "Elena Jiménez Vega", profesor: "Laura Martín", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl13", fecha: "2026-03-14", alumno: "Juan Pérez Martínez", profesor: "Carlos Ruiz", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl14", fecha: "2026-03-15", alumno: "Ana Rodríguez Sánchez", profesor: "Laura Martín", tipo: "Práctica", estado: "completada", duracion: 1 },
  { id: "cl15", fecha: "2026-03-17", alumno: "Sofía Díaz Moreno", profesor: "Miguel Ángel Torres", tipo: "Práctica", estado: "completada", duracion: 1.5 },
]

const ESTADO_LABELS: Record<string, string> = {
  completada: "Completada",
  cancelada: "Cancelada",
  programada: "Programada",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function InformeClases() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })
  const [profesor, setProfesor] = React.useState("Todos")

  const filtered = React.useMemo(() => {
    return MOCK_CLASES.filter((c) => {
      const inRange = c.fecha >= range.from && c.fecha <= range.to
      const matchProf = profesor === "Todos" || c.profesor === profesor
      return inRange && matchProf
    })
  }, [range, profesor])

  const stats = React.useMemo(() => ({
    total: filtered.length,
    completadas: filtered.filter((c) => c.estado === "completada").length,
    canceladas: filtered.filter((c) => c.estado === "cancelada").length,
    horas: filtered.filter((c) => c.estado === "completada").reduce((sum, c) => sum + c.duracion, 0),
  }), [filtered])

  const chartData = React.useMemo(() => {
    const byDay: Record<string, number> = {}
    filtered.forEach((c) => {
      const day = c.fecha.slice(5)
      byDay[day] = (byDay[day] || 0) + 1
    })
    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dia, clases]) => ({ dia, clases }))
  }, [filtered])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">Informe de clases</h3>
        <ExportButton
          onExport={() =>
            exportToCSV(filtered, [
              { key: "fecha", label: "Fecha", format: (v) => exportFormatDate(v as string) },
              { key: "alumno", label: "Alumno" },
              { key: "profesor", label: "Profesor" },
              { key: "estado", label: "Estado", format: (v) => ESTADO_LABELS[v as string] ?? String(v) },
              { key: "duracion", label: "Duración (h)" },
            ], "informe-clases")
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
        <DateRangePicker value={range} onChange={setRange} />
        <div className="space-y-1.5">
          <Select value={profesor} onValueChange={(val) => setProfesor(val ?? "Todos")}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROFESORES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total clases", value: stats.total },
          { label: "Completadas", value: stats.completadas, color: "text-green-600 dark:text-green-400" },
          { label: "Canceladas", value: stats.canceladas, color: "text-red-600 dark:text-red-400" },
          { label: "Horas totales", value: stats.horas, color: "text-blue-600 dark:text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color ?? "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                  fontSize: "13px",
                }}
                formatter={(value) => [`${value} clases`, "Clases"]}
              />
              <Bar dataKey="clases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
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
              <TableHead>Profesor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Duración</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-muted-foreground">{formatDate(c.fecha)}</TableCell>
                <TableCell className="font-medium">{c.alumno}</TableCell>
                <TableCell>{c.profesor}</TableCell>
                <TableCell>{ESTADO_LABELS[c.estado]}</TableCell>
                <TableCell className="text-right">{c.duracion}h</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay clases en el período seleccionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
