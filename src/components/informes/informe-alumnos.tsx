"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
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
import { MOCK_ALUMNOS } from "@/components/alumnos/mock-data"
import { ESTADO_LABELS, ESTADO_COLORS } from "@/components/alumnos/types"
import type { EstadoAlumno } from "@/components/alumnos/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function InformeAlumnos() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  const filtered = React.useMemo(() => {
    return MOCK_ALUMNOS.filter((a) => a.fecha_matricula >= range.from && a.fecha_matricula <= range.to)
  }, [range])

  const stats = React.useMemo(() => ({
    matriculados: filtered.filter((a) => a.estado === "matriculado").length,
    en_curso: filtered.filter((a) => a.estado === "en_curso").length,
    completados: filtered.filter((a) => a.estado === "completado").length,
    bajas: filtered.filter((a) => a.estado === "baja").length,
  }), [filtered])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">Informe de alumnos</h3>
        <ExportButton
          onExport={() =>
            exportToCSV(filtered, [
              { key: "nombre", label: "Nombre" },
              { key: "apellidos", label: "Apellidos" },
              { key: "dni", label: "DNI" },
              { key: "permiso", label: "Permiso" },
              { key: "estado", label: "Estado", format: (v) => ESTADO_LABELS[v as EstadoAlumno] ?? String(v) },
              { key: "fecha_matricula", label: "Fecha matrícula", format: (v) => exportFormatDate(v as string) },
            ], "informe-alumnos")
          }
        />
      </div>

      <DateRangePicker value={range} onChange={setRange} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Matriculados", value: stats.matriculados, color: "text-blue-600 dark:text-blue-400" },
          { label: "En curso", value: stats.en_curso, color: "text-amber-600 dark:text-amber-400" },
          { label: "Completados", value: stats.completados, color: "text-green-600 dark:text-green-400" },
          { label: "Bajas", value: stats.bajas, color: "text-red-600 dark:text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Permiso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha matrícula</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.nombre} {a.apellidos}</TableCell>
                <TableCell className="font-mono text-xs">{a.dni}</TableCell>
                <TableCell><Badge variant="secondary">{a.permiso}</Badge></TableCell>
                <TableCell>
                  <Badge className={`border-0 ${ESTADO_COLORS[a.estado]}`}>
                    {ESTADO_LABELS[a.estado]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(a.fecha_matricula)}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay alumnos en el período seleccionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
