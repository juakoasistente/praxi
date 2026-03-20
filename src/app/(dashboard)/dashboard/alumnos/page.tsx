"use client"

import * as React from "react"
import Image from "next/image"
import { Search, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlumnoFormDialog } from "@/components/alumnos/alumno-form-dialog"
import { AlumnoDetailSheet } from "@/components/alumnos/alumno-detail-sheet"
import { ConfirmarBajaDialog } from "@/components/alumnos/confirmar-baja-dialog"
import { MOCK_ALUMNOS } from "@/components/alumnos/mock-data"
import type { Alumno, PermisoType, EstadoAlumno } from "@/components/alumnos/types"
import {
  ESTADO_LABELS,
  ESTADO_COLORS,
  PERMISOS,
  ESTADOS,
} from "@/components/alumnos/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = React.useState<Alumno[]>(MOCK_ALUMNOS)
  const [search, setSearch] = React.useState("")
  const [filtroEstado, setFiltroEstado] = React.useState<string>("todos")
  const [filtroPermiso, setFiltroPermiso] = React.useState<string>("todos")

  // Dialog states
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingAlumno, setEditingAlumno] = React.useState<Alumno | null>(null)
  const [detailAlumno, setDetailAlumno] = React.useState<Alumno | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [bajaAlumno, setBajaAlumno] = React.useState<Alumno | null>(null)
  const [bajaDialogOpen, setBajaDialogOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    return alumnos.filter((a) => {
      const matchSearch =
        !search ||
        `${a.nombre} ${a.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
        a.dni.toLowerCase().includes(search.toLowerCase())
      const matchEstado = filtroEstado === "todos" || a.estado === filtroEstado
      const matchPermiso = filtroPermiso === "todos" || a.permiso === filtroPermiso
      return matchSearch && matchEstado && matchPermiso
    })
  }, [alumnos, search, filtroEstado, filtroPermiso])

  const hasActiveFilters = search || filtroEstado !== "todos" || filtroPermiso !== "todos"

  function handleSave(data: Omit<Alumno, "id">) {
    if (editingAlumno) {
      setAlumnos((prev) =>
        prev.map((a) =>
          a.id === editingAlumno.id ? { ...a, ...data } : a
        )
      )
    } else {
      const newAlumno: Alumno = {
        ...data,
        id: String(Date.now()),
      }
      setAlumnos((prev) => [...prev, newAlumno])
    }
    setEditingAlumno(null)
  }

  function handleEdit(alumno: Alumno) {
    setEditingAlumno(alumno)
    setFormOpen(true)
  }

  function handleBaja(alumno: Alumno) {
    setBajaAlumno(alumno)
    setBajaDialogOpen(true)
  }

  function confirmBaja() {
    if (!bajaAlumno) return
    setAlumnos((prev) =>
      prev.map((a) =>
        a.id === bajaAlumno.id ? { ...a, estado: "baja" as const } : a
      )
    )
    setBajaAlumno(null)
    setSheetOpen(false)
  }

  function clearFilters() {
    setSearch("")
    setFiltroEstado("todos")
    setFiltroPermiso("todos")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/alumnos.png"
            alt="Alumnos"
            width={36}
            height={36}
          />
          <div>
            <h1 className="text-2xl font-bold">Alumnos</h1>
            <p className="text-sm text-muted-foreground">
              {alumnos.length} alumno{alumnos.length !== 1 ? "s" : ""} registrado{alumnos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingAlumno(null)
            setFormOpen(true)
          }}
        >
          <Plus className="size-4" data-icon="inline-start" />
          Nuevo alumno
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o DNI..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filtroEstado} onValueChange={(val) => setFiltroEstado(val ?? "todos")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ESTADOS.map((e) => (
              <SelectItem key={e} value={e}>
                {ESTADO_LABELS[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroPermiso} onValueChange={(val) => setFiltroPermiso(val ?? "todos")}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Permiso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los permisos</SelectItem>
            {PERMISOS.map((p) => (
              <SelectItem key={p} value={p}>
                Permiso {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            <X className="size-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre completo</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                <TableHead>Permiso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha matrícula
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((alumno) => (
                <TableRow
                  key={alumno.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setDetailAlumno(alumno)
                    setSheetOpen(true)
                  }}
                >
                  <TableCell className="font-medium">
                    {alumno.nombre} {alumno.apellidos}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {alumno.dni}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {alumno.telefono}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{alumno.permiso}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${ESTADO_COLORS[alumno.estado]}`}
                    >
                      {ESTADO_LABELS[alumno.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatDate(alumno.fecha_matricula)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No se encontraron alumnos</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {hasActiveFilters
              ? "Prueba a cambiar los filtros de búsqueda o limpiar los filtros."
              : "Aún no hay alumnos registrados. Haz clic en \"Nuevo alumno\" para empezar."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Dialogs & Sheet */}
      <AlumnoFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingAlumno(null)
        }}
        alumno={editingAlumno}
        onSave={handleSave}
      />
      <AlumnoDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        alumno={detailAlumno}
        onEdit={handleEdit}
        onBaja={handleBaja}
      />
      <ConfirmarBajaDialog
        open={bajaDialogOpen}
        onOpenChange={setBajaDialogOpen}
        alumno={bajaAlumno}
        onConfirm={confirmBaja}
      />
    </div>
  )
}
