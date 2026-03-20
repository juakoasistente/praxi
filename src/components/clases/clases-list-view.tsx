"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type Clase,
  VEHICULOS,
  PROFESORES_CLASES,
  ESTADO_LABELS,
  ESTADO_COLORS,
} from "./mock-data"

interface ClasesListViewProps {
  clases: Clase[]
  onClaseClick: (clase: Clase) => void
}

export function ClasesListView({ clases, onClaseClick }: ClasesListViewProps) {
  const sorted = [...clases].sort((a, b) => {
    const dateComp = a.fecha.localeCompare(b.fecha)
    if (dateComp !== 0) return dateComp
    return a.hora_inicio.localeCompare(b.hora_inicio)
  })

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay clases para esta semana.
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Alumno</TableHead>
            <TableHead className="hidden sm:table-cell">Profesor</TableHead>
            <TableHead className="hidden md:table-cell">Vehículo</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((clase) => {
            const vehiculo = VEHICULOS.find((v) => v.id === clase.vehiculo_id)
            const profesor = PROFESORES_CLASES.find((p) => p.id === clase.profesor_id)
            const fechaStr = new Date(clase.fecha + "T00:00:00").toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })

            return (
              <TableRow
                key={clase.id}
                className="cursor-pointer hover:bg-accent/40"
                onClick={() => onClaseClick(clase)}
              >
                <TableCell className="capitalize text-sm">{fechaStr}</TableCell>
                <TableCell className="text-sm">
                  {clase.hora_inicio} – {clase.hora_fin}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {clase.alumno_nombre} {clase.alumno_apellidos.split(" ")[0]}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {profesor ? `${profesor.nombre} ${profesor.apellidos.split(" ")[0]}` : "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {vehiculo ? `${vehiculo.modelo}` : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${ESTADO_COLORS[clase.estado]}`}>
                    {ESTADO_LABELS[clase.estado]}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
