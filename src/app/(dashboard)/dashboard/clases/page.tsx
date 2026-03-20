"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, List, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MOCK_CLASES,
  PROFESORES_CLASES,
  type Clase,
  type EstadoClase,
} from "@/components/clases/mock-data"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { getClases, createClase as createClaseService, updateClase as updateClaseService } from "@/lib/services/clases"
import { getProfesores } from "@/lib/services/profesores"
import { toast } from "sonner"
import { WeeklyCalendar } from "@/components/clases/weekly-calendar"
import { ClasesListView } from "@/components/clases/clases-list-view"
import { ClaseDetailDialog } from "@/components/clases/clase-detail-dialog"
import { NuevaClaseDialog } from "@/components/clases/nueva-clase-dialog"
import { RequireWrite } from "@/components/auth/require-write"

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + weeks * 7)
  return d
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function formatWeekRange(monday: Date): string {
  const friday = new Date(monday)
  friday.setDate(friday.getDate() + 4)

  const sameMonth = monday.getMonth() === friday.getMonth()

  if (sameMonth) {
    return `${monday.getDate()} – ${friday.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`
  }
  return `${monday.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} – ${friday.toLocaleDateString(
    "es-ES",
    { day: "numeric", month: "short", year: "numeric" }
  )}`
}

export default function ClasesPage() {
  const { data: sbClases, loading: loadingClases, refetch: refetchClases } = useSupabaseQuery(() => getClases())
  const { data: sbProfesores, loading: loadingProfesores } = useSupabaseQuery(() => getProfesores())

  const [clases, setClases] = useState<Clase[]>(MOCK_CLASES)
  const profesores = sbProfesores?.map(p => ({ id: p.id, nombre: p.nombre, apellidos: p.apellidos })) ?? PROFESORES_CLASES

  useEffect(() => { if (sbClases) setClases(sbClases) }, [sbClases])

  const loading = loadingClases || loadingProfesores

  const [profesorId, setProfesorId] = useState("todos")
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const [view, setView] = useState<"calendar" | "list">("calendar")

  // Detail dialog
  const [selectedClase, setSelectedClase] = useState<Clase | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // New clase dialog
  const [newOpen, setNewOpen] = useState(false)
  const [prefillFecha, setPrefillFecha] = useState<string | undefined>()
  const [prefillHora, setPrefillHora] = useState<string | undefined>()

  // Week end date (Friday)
  const weekEnd = useMemo(() => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 4)
    return d
  }, [weekStart])

  // Filter clases for selected week + professor
  const weekClases = useMemo(() => {
    const startStr = fmtDate(weekStart)
    const endStr = fmtDate(weekEnd)
    return clases.filter((c) => {
      const inWeek = c.fecha >= startStr && c.fecha <= endStr
      const matchProf = profesorId === "todos" || c.profesor_id === profesorId
      return inWeek && matchProf
    })
  }, [clases, weekStart, weekEnd, profesorId])

  // Stats
  const stats = useMemo(() => {
    const total = weekClases.length
    const completadas = weekClases.filter((c) => c.estado === "completada").length
    const programadas = weekClases.filter((c) => c.estado === "programada").length
    const canceladas = weekClases.filter((c) => c.estado === "cancelada").length
    const noShow = weekClases.filter((c) => c.estado === "no_show").length
    const horasOcupadas = weekClases.filter((c) => c.estado !== "cancelada").length
    // 5 days * 12 hours = 60 hours available per professor
    const horasDisponibles = profesorId === "todos" ? 60 * profesores.length : 60
    return { total, completadas, programadas, canceladas, noShow, horasOcupadas, horasDisponibles }
  }, [weekClases, profesorId, profesores])

  const handleClaseClick = useCallback((clase: Clase) => {
    setSelectedClase(clase)
    setDetailOpen(true)
  }, [])

  const handleSlotClick = useCallback(
    (fecha: string, hora: string) => {
      setPrefillFecha(fecha)
      setPrefillHora(hora)
      setNewOpen(true)
    },
    []
  )

  const handleChangeEstado = useCallback(async (id: string, estado: EstadoClase) => {
    setClases((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)))
    try {
      await updateClaseService(id, { estado })
      toast.success("Estado actualizado")
      refetchClases()
    } catch {
      toast.error("Error al actualizar el estado")
    }
  }, [refetchClases])

  const handleAddClase = useCallback(async (clase: Clase) => {
    setClases((prev) => [...prev, clase])
    try {
      await createClaseService(clase)
      toast.success("Clase creada")
      refetchClases()
    } catch {
      toast.error("Error al crear la clase")
    }
  }, [refetchClases])

  const handleNewClaseButton = useCallback(() => {
    setPrefillFecha(undefined)
    setPrefillHora(undefined)
    setNewOpen(true)
  }, [])

  const goToday = useCallback(() => setWeekStart(getMonday(new Date())), [])

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clases</h1>
          <p className="text-muted-foreground">Calendario semanal de clases prácticas</p>
        </div>
        <RequireWrite entity="clases">
          <Button onClick={handleNewClaseButton}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva clase
          </Button>
        </RequireWrite>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Professor selector */}
        <Select value={profesorId} onValueChange={(v) => v && setProfesorId(v)}>
          <SelectTrigger className="w-full sm:w-[260px]">
            <SelectValue placeholder="Filtrar por profesor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los profesores</SelectItem>
            {profesores.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nombre} {p.apellidos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekStart((prev) => addWeeks(prev, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={() => setWeekStart((prev) => addWeeks(prev, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium ml-2 whitespace-nowrap">
            {formatWeekRange(weekStart)}
          </span>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("calendar")}
            title="Vista calendario"
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
            title="Vista lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total semana</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Programadas</p>
            <p className="text-2xl font-bold text-blue-600">{stats.programadas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Completadas</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completadas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Canceladas</p>
            <p className="text-2xl font-bold text-red-600">{stats.canceladas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">No presentados</p>
            <p className="text-2xl font-bold text-amber-600">{stats.noShow}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Horas ocupadas</p>
            <p className="text-2xl font-bold">
              {stats.horasOcupadas}
              <span className="text-sm font-normal text-muted-foreground">/{stats.horasDisponibles}h</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Programada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Cancelada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> No presentado
        </span>
      </div>

      {/* Calendar or List */}
      {view === "calendar" ? (
        <WeeklyCalendar
          clases={weekClases}
          weekStart={weekStart}
          onClaseClick={handleClaseClick}
          onSlotClick={handleSlotClick}
        />
      ) : (
        <ClasesListView clases={weekClases} onClaseClick={handleClaseClick} />
      )}

      {/* Dialogs */}
      <ClaseDetailDialog
        clase={selectedClase}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onChangeEstado={handleChangeEstado}
      />

      <NuevaClaseDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        profesorId={profesorId === "todos" ? "1" : profesorId}
        prefillFecha={prefillFecha}
        prefillHora={prefillHora}
        onAdd={handleAddClase}
      />
    </div>
  )
}
