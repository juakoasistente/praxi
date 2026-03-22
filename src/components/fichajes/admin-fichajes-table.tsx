"use client"

import { useState, useMemo } from "react"
import { Users, Clock, Search, Filter, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistroFichaje, Incidencia, EstadoEmpleado } from "./types"

interface EmpleadoResumen {
  id: string
  nombre: string
  estado: EstadoEmpleado
  horaEntrada?: string
  horaSalida?: string
  horasTrabajadas: number // minutos
  horasPausa: number // minutos
  incidencias: Incidencia[]
  ultimoRegistro?: RegistroFichaje
}

interface AdminFichajesTableProps {
  empleados: { id: string; nombre: string }[]
  registros: RegistroFichaje[]
  incidencias: Incidencia[]
  fecha: string
  onExportCSV: () => void
  onVerDetalle: (empleadoId: string, empleadoNombre: string) => void
  className?: string
}

export function AdminFichajesTable({
  empleados,
  registros,
  incidencias,
  fecha,
  onExportCSV,
  onVerDetalle,
  className
}: AdminFichajesTableProps) {
  const [search, setSearch] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")

  const resumenEmpleados = useMemo(() => {
    return empleados.map((empleado): EmpleadoResumen => {
      // Filtrar registros del empleado para la fecha específica
      const registrosEmpleado = registros
        .filter(r => r.usuario_id === empleado.id && r.timestamp.startsWith(fecha))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      // Filtrar incidencias del empleado para la fecha específica
      const incidenciasEmpleado = incidencias.filter(
        i => i.usuario_id === empleado.id && i.fecha === fecha
      )

      // Calcular estado actual y estadísticas
      let estado: EstadoEmpleado = "fuera"
      let horaEntrada: string | undefined
      let horaSalida: string | undefined
      let tiempoTrabajo = 0
      let tiempoPausa = 0
      let estadoActual: "fuera" | "trabajando" | "en_pausa" = "fuera"
      let inicioBloque: Date | null = null

      for (const registro of registrosEmpleado) {
        const tiempoRegistro = new Date(registro.timestamp)
        const horaStr = tiempoRegistro.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit"
        })

        if (registro.tipo === "entrada") {
          if (!horaEntrada) horaEntrada = horaStr

          if (estadoActual === "en_pausa" && inicioBloque) {
            tiempoPausa += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "trabajando"
          inicioBloque = tiempoRegistro
        } else if (registro.tipo === "salida") {
          horaSalida = horaStr

          if (estadoActual === "trabajando" && inicioBloque) {
            tiempoTrabajo += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "fuera"
          inicioBloque = null
        } else if (registro.tipo === "pausa_inicio") {
          if (estadoActual === "trabajando" && inicioBloque) {
            tiempoTrabajo += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "en_pausa"
          inicioBloque = tiempoRegistro
        } else if (registro.tipo === "pausa_fin") {
          if (estadoActual === "en_pausa" && inicioBloque) {
            tiempoPausa += tiempoRegistro.getTime() - inicioBloque.getTime()
          }
          estadoActual = "trabajando"
          inicioBloque = tiempoRegistro
        }
      }

      estado = estadoActual

      return {
        id: empleado.id,
        nombre: empleado.nombre,
        estado,
        horaEntrada,
        horaSalida,
        horasTrabajadas: Math.round(tiempoTrabajo / (1000 * 60)),
        horasPausa: Math.round(tiempoPausa / (1000 * 60)),
        incidencias: incidenciasEmpleado,
        ultimoRegistro: registrosEmpleado[registrosEmpleado.length - 1]
      }
    })
  }, [empleados, registros, incidencias, fecha])

  const empleadosFiltrados = useMemo(() => {
    return resumenEmpleados.filter(empleado => {
      const matchSearch = !search ||
        empleado.nombre.toLowerCase().includes(search.toLowerCase())

      const matchEstado = filtroEstado === "todos" || empleado.estado === filtroEstado

      return matchSearch && matchEstado
    })
  }, [resumenEmpleados, search, filtroEstado])

  const estadisticasGenerales = useMemo(() => {
    const total = resumenEmpleados.length
    const trabajando = resumenEmpleados.filter(e => e.estado === "trabajando").length
    const enPausa = resumenEmpleados.filter(e => e.estado === "en_pausa").length
    const fuera = resumenEmpleados.filter(e => e.estado === "fuera").length
    const conIncidencias = resumenEmpleados.filter(e => e.incidencias.length > 0).length

    return { total, trabajando, enPausa, fuera, conIncidencias }
  }, [resumenEmpleados])

  const getEstadoBadge = (estado: EstadoEmpleado) => {
    switch (estado) {
      case "trabajando":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Trabajando
          </Badge>
        )
      case "en_pausa":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
            En pausa
          </Badge>
        )
      case "fuera":
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
            Fuera
          </Badge>
        )
    }
  }

  const formatTiempo = (minutos: number) => {
    if (minutos === 0) return "-"
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    if (horas === 0) return `${mins}m`
    if (mins === 0) return `${horas}h`
    return `${horas}h ${mins}m`
  }

  const fechaLabel = new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Control de empleados - {fechaLabel}</span>
          </div>
          <Button onClick={onExportCSV} size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas generales */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{estadisticasGenerales.total}</p>
            <p className="text-sm text-blue-600">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{estadisticasGenerales.trabajando}</p>
            <p className="text-sm text-green-600">Trabajando</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-700">{estadisticasGenerales.enPausa}</p>
            <p className="text-sm text-yellow-600">En pausa</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-700">{estadisticasGenerales.fuera}</p>
            <p className="text-sm text-gray-600">Fuera</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-700">{estadisticasGenerales.conIncidencias}</p>
            <p className="text-sm text-red-600">Con incidencias</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filtroEstado} onValueChange={(value) => setFiltroEstado(value || "todos")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="trabajando">Trabajando</SelectItem>
              <SelectItem value="en_pausa">En pausa</SelectItem>
              <SelectItem value="fuera">Fuera</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla de empleados */}
        <div className="border rounded-lg overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden sm:table-cell">Entrada</TableHead>
                <TableHead className="hidden sm:table-cell">Salida</TableHead>
                <TableHead>Horas trabajadas</TableHead>
                <TableHead className="hidden md:table-cell">Pausa</TableHead>
                <TableHead>Incidencias</TableHead>
                <TableHead className="w-16">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleadosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        {search ? "No se encontraron empleados" : "No hay empleados para mostrar"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                empleadosFiltrados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell className="font-medium">
                      {empleado.nombre}
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(empleado.estado)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {empleado.horaEntrada || "-"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {empleado.horaSalida || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatTiempo(empleado.horasTrabajadas)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatTiempo(empleado.horasPausa)}
                    </TableCell>
                    <TableCell>
                      {empleado.incidencias.length > 0 ? (
                        <div className="space-y-1">
                          {empleado.incidencias.map((incidencia) => (
                            <Badge
                              key={incidencia.id}
                              variant="outline"
                              className={`text-xs ${
                                incidencia.aprobada === null
                                  ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  : incidencia.aprobada
                                  ? "bg-green-50 text-green-600 border-green-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                              }`}
                            >
                              {incidencia.tipo.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onVerDetalle(empleado.id, empleado.nombre)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Información legal */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded border">
          <p>
            <strong>Real Decreto-ley 8/2019:</strong> Registro obligatorio de jornada laboral.
            Estos datos se conservan 4 años para inspecciones de trabajo.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}