"use client"

import * as React from "react"
import Image from "next/image"
import { Search, Plus, X } from "lucide-react"
import { toast } from "sonner"
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
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { getAlumnos, createAlumno, updateAlumno } from "@/lib/services/alumnos"
import { RequireWrite } from "@/components/auth/require-write"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV, exportFormatDate } from "@/lib/export"
import type { Alumno, PermisoType, EstadoAlumno } from "@/components/alumnos/types"
import {
  ESTADO_LABELS,
  ESTADO_COLORS,
  PERMISOS,
  ESTADOS,
} from "@/components/alumnos/types"
import { useSede } from "@/hooks/use-sede"
import { SEDE_ALL_OPTION } from "@/components/sedes/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function AlumnosPage() {
  const { data: supabaseAlumnos, loading, error, refetch } = useSupabaseQuery(() => getAlumnos())
  const [alumnos, setAlumnos] = React.useState<Alumno[]>(MOCK_ALUMNOS)
  const { selectedSede } = useSede()

  // Sync supabase data when available
  React.useEffect(() => {
    if (supabaseAlumnos) setAlumnos(supabaseAlumnos)
  }, [supabaseAlumnos])

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
      const matchSede = selectedSede === SEDE_ALL_OPTION || a.sede_id === selectedSede
      return matchSearch && matchEstado && matchPermiso && matchSede
    })
  }, [alumnos, search, filtroEstado, filtroPermiso, selectedSede])

  const hasActiveFilters = search || filtroEstado !== "todos" || filtroPermiso !== "todos"

  async function handleSave(data: Omit<Alumno, "id">) {
    try {
      if (editingAlumno) {
        await updateAlumno(editingAlumno.id, data)
        toast.success("Alumno actualizado correctamente")
      } else {
        await createAlumno(data)
        toast.success("Alumno creado correctamente")
      }
      refetch()
    } catch {
      toast.error(editingAlumno ? "Error al actualizar el alumno" : "Error al crear el alumno")
      // Fallback: update local state
      if (editingAlumno) {
        setAlumnos((prev) => prev.map((a) => a.id === editingAlumno.id ? { ...a, ...data } : a))
      } else {
        setAlumnos((prev) => [...prev, { ...data, id: String(Date.now()) }])
      }
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

  async function confirmBaja() {
    if (!bajaAlumno) return
    try {
      await updateAlumno(bajaAlumno.id, { estado: "baja" })
      toast.success("Alumno dado de baja correctamente")
      refetch()
    } catch {
      toast.error("Error al dar de baja al alumno")
      setAlumnos((prev) => prev.map((a) => a.id === bajaAlumno.id ? { ...a, estado: "baja" as const } : a))
    }
    setBajaAlumno(null)
    setSheetOpen(false)
  }

  function clearFilters() {
    setSearch("")
    setFiltroEstado("todos")
    setFiltroPermiso("todos")
  }

  if (loading) return <LoadingSkeleton />

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
        <div className="flex gap-2">
          <ExportButton
            onExport={() =>
              exportToCSV(filtered, [
                { key: "nombre", label: "Nombre" },
                { key: "apellidos", label: "Apellidos" },
                { key: "dni", label: "DNI" },
                { key: "telefono", label: "Teléfono" },
                { key: "email", label: "Email", format: (v) => (v as string) ?? "" },
                { key: "permiso", label: "Permiso" },
                { key: "estado", label: "Estado", format: (v) => ESTADO_LABELS[v as EstadoAlumno] ?? String(v) },
                { key: "fecha_matricula", label: "Fecha matrícula", format: (v) => exportFormatDate(v as string) },
              ], "alumnos")
            }
          />
          <RequireWrite entity="alumnos">
            <Button
              onClick={() => {
                setEditingAlumno(null)
                setFormOpen(true)
              }}
            >
              <Plus className="size-4" data-icon="inline-start" />
              Nuevo alumno
            </Button>
          </RequireWrite>
        </div>
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
        <div className="rounded-lg border overflow-x-auto">
          <Table className="min-w-[600px]">
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
