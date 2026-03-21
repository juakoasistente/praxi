"use client"

import * as React from "react"
import { Search, Plus, X, ClipboardCheck, CheckCircle, XCircle, Clock, Calendar } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ExamenFormDialog } from "@/components/examenes/examen-form-dialog"
import { ExamenDetailDialog } from "@/components/examenes/examen-detail-dialog"
import { ExamenCalendar } from "@/components/examenes/examen-calendar"
import { MOCK_EXAMENES } from "@/components/examenes/mock-data"
import type { Examen } from "@/components/examenes/types"
import {
  TIPO_LABELS,
  RESULTADO_LABELS,
  RESULTADO_COLORS,
  TIPOS_EXAMEN,
  RESULTADOS,
} from "@/components/examenes/types"
import { RequireWrite } from "@/components/auth/require-write"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV, exportFormatDate } from "@/lib/export"
import type { TipoExamen, ResultadoExamen } from "@/components/examenes/types"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import {
  getExamenes,
  createExamen,
  updateExamen,
  deleteExamen as deleteExamenService,
} from "@/lib/services/examenes"
import { useSede } from "@/hooks/use-sede"
import { SEDE_ALL_OPTION } from "@/components/sedes/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function ExamenesPage() {
  const { data: sbExamenes, loading, refetch } = useSupabaseQuery(() => getExamenes())
  const [examenes, setExamenes] = React.useState<Examen[]>(MOCK_EXAMENES)
  const { selectedSede } = useSede()

  React.useEffect(() => {
    if (sbExamenes) setExamenes(sbExamenes)
  }, [sbExamenes])

  const [search, setSearch] = React.useState("")
  const [filtroTipo, setFiltroTipo] = React.useState<string>("todos")
  const [filtroResultado, setFiltroResultado] = React.useState<string>("todos")

  // Dialog states
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingExamen, setEditingExamen] = React.useState<Examen | null>(null)
  const [detailExamen, setDetailExamen] = React.useState<Examen | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    return examenes.filter((e) => {
      const matchSearch =
        !search ||
        e.alumno_nombre.toLowerCase().includes(search.toLowerCase())
      const matchTipo = filtroTipo === "todos" || e.tipo === filtroTipo
      const matchResultado = filtroResultado === "todos" || e.resultado === filtroResultado
      const matchSede = selectedSede === SEDE_ALL_OPTION || e.sede_id === selectedSede
      return matchSearch && matchTipo && matchResultado && matchSede
    })
  }, [examenes, search, filtroTipo, filtroResultado, selectedSede])

  const hasActiveFilters = search || filtroTipo !== "todos" || filtroResultado !== "todos"

  // Stats
  const totalPresentaciones = examenes.length
  const aprobados = examenes.filter((e) => e.resultado === "aprobado").length
  const suspendidos = examenes.filter((e) => e.resultado === "suspendido").length
  const pendientes = examenes.filter((e) => e.resultado === "pendiente").length
  const pctAprobados = totalPresentaciones > 0 ? Math.round((aprobados / totalPresentaciones) * 100) : 0
  const pctSuspendidos = totalPresentaciones > 0 ? Math.round((suspendidos / totalPresentaciones) * 100) : 0

  async function handleSave(data: Omit<Examen, "id">) {
    try {
      if (editingExamen) {
        await updateExamen(editingExamen.id, data)
        toast.success("Examen actualizado correctamente")
      } else {
        const { alumno_nombre: _alumno_nombre, ...rest } = data as Omit<Examen, "id">
        await createExamen(rest)
        toast.success("Examen creado correctamente")
      }
      await refetch()
    } catch {
      // Fallback to local state on error
      if (editingExamen) {
        setExamenes((prev) =>
          prev.map((e) =>
            e.id === editingExamen.id ? { ...e, ...data } : e
          )
        )
      } else {
        const newExamen: Examen = {
          ...data,
          id: String(Date.now()),
        }
        setExamenes((prev) => [...prev, newExamen])
      }
      toast.error("Error al guardar en servidor, cambios aplicados localmente")
    }
    setEditingExamen(null)
  }

  function handleEdit(examen: Examen) {
    setEditingExamen(examen)
    setFormOpen(true)
  }

  async function handleDelete(examen: Examen) {
    try {
      await deleteExamenService(examen.id)
      toast.success("Examen eliminado correctamente")
      await refetch()
    } catch {
      // Fallback to local state on error
      setExamenes((prev) => prev.filter((e) => e.id !== examen.id))
      toast.error("Error al eliminar en servidor, cambios aplicados localmente")
    }
    setDetailOpen(false)
    setDetailExamen(null)
  }

  function clearFilters() {
    setSearch("")
    setFiltroTipo("todos")
    setFiltroResultado("todos")
  }

  function handleExamClick(examen: Examen) {
    setDetailExamen(examen)
    setDetailOpen(true)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
            <ClipboardCheck className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Exámenes</h1>
            <p className="text-sm text-muted-foreground">
              {examenes.length} presentaci{examenes.length !== 1 ? "ones" : "ón"} registrada{examenes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ExportButton
            onExport={() =>
              exportToCSV(filtered, [
                { key: "alumno_nombre", label: "Alumno" },
                { key: "tipo", label: "Tipo", format: (v) => TIPO_LABELS[v as TipoExamen] ?? String(v) },
                { key: "fecha", label: "Fecha", format: (v) => exportFormatDate(v as string) },
                { key: "resultado", label: "Resultado", format: (v) => RESULTADO_LABELS[v as ResultadoExamen] ?? String(v) },
                { key: "intento", label: "Intento" },
                { key: "convocatoria", label: "Convocatoria", format: (v) => (v as string) ?? "" },
                { key: "centro_examen", label: "Centro", format: (v) => (v as string) ?? "" },
              ], "examenes")
            }
          />
          <RequireWrite entity="examenes">
            <Button
              onClick={() => {
                setEditingExamen(null)
                setFormOpen(true)
              }}
            >
              <Plus className="size-4" data-icon="inline-start" />
              Nuevo examen
            </Button>
          </RequireWrite>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <ClipboardCheck className="size-4" />
            Total presentaciones
          </div>
          <p className="text-2xl font-bold">{totalPresentaciones}</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <CheckCircle className="size-4 text-green-600" />
            Aprobados
          </div>
          <p className="text-2xl font-bold text-green-600">
            {aprobados}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              ({pctAprobados}%)
            </span>
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <XCircle className="size-4 text-red-600" />
            Suspendidos
          </div>
          <p className="text-2xl font-bold text-red-600">
            {suspendidos}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              ({pctSuspendidos}%)
            </span>
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Clock className="size-4 text-blue-600" />
            Pendientes
          </div>
          <p className="text-2xl font-bold text-blue-600">{pendientes}</p>
        </div>
      </div>

      {/* Tabs: Tabla | Calendario */}
      <Tabs defaultValue="tabla">
        <TabsList>
          <TabsTrigger value="tabla">Tabla</TabsTrigger>
          <TabsTrigger value="calendario">
            <Calendar className="size-4" />
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tabla">
          <div className="space-y-4 pt-2">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre de alumno..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filtroTipo} onValueChange={(val) => setFiltroTipo(val ?? "todos")}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {TIPOS_EXAMEN.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TIPO_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filtroResultado} onValueChange={(val) => setFiltroResultado(val ?? "todos")}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los resultados</SelectItem>
                  {RESULTADOS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {RESULTADO_LABELS[r]}
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
                      <TableHead>Alumno</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="hidden sm:table-cell">Convocatoria</TableHead>
                      <TableHead className="hidden md:table-cell">Intento</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead className="hidden md:table-cell">Centro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((examen) => (
                      <TableRow
                        key={examen.id}
                        className="cursor-pointer"
                        onClick={() => handleExamClick(examen)}
                      >
                        <TableCell className="font-medium">
                          {examen.alumno_nombre}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{TIPO_LABELS[examen.tipo]}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(examen.fecha)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {examen.convocatoria ?? "—"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center">
                          {examen.intento}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`border-0 ${RESULTADO_COLORS[examen.resultado]}`}
                          >
                            {RESULTADO_LABELS[examen.resultado]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {examen.centro_examen ?? "—"}
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
                <h3 className="text-lg font-semibold">No se encontraron exámenes</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  {hasActiveFilters
                    ? "Prueba a cambiar los filtros de búsqueda o limpiar los filtros."
                    : "Aún no hay exámenes registrados. Haz clic en \"Nuevo examen\" para empezar."}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendario">
          <div className="pt-2">
            <ExamenCalendar exams={examenes} onExamClick={handleExamClick} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ExamenFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingExamen(null)
        }}
        examen={editingExamen}
        onSave={handleSave}
      />
      <ExamenDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        examen={detailExamen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
