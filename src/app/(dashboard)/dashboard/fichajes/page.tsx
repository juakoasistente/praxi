"use client"

import * as React from "react"
import Image from "next/image"
import {
  Clock,
  LogIn,
  LogOut,
  Users,
  UserX,
  CalendarDays,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import { Calendar } from "@/components/ui/calendar"
import { MOCK_FICHAJES, EMPLEADOS } from "@/components/fichajes/mock-data"
import type { Fichaje } from "@/components/fichajes/types"
import { es } from "react-day-picker/locale"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { getFichajes, createFichaje, getUserProfile } from "@/lib/services/fichajes"
import { RequireWrite } from "@/components/auth/require-write"
import { toast } from "sonner"

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateTime(isoStr: string) {
  return new Date(isoStr).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export default function FichajesPage() {
  const { data: sbFichajes, loading: loadingFichajes, refetch } = useSupabaseQuery(() => getFichajes())
  const { data: userProfile } = useSupabaseQuery(() => getUserProfile())

  const [fichajes, setFichajes] = React.useState<Fichaje[]>(MOCK_FICHAJES)

  React.useEffect(() => { if (sbFichajes) setFichajes(sbFichajes) }, [sbFichajes])

  const [fechaFiltro, setFechaFiltro] = React.useState<Date>(new Date())
  const [empleadoFiltro, setEmpleadoFiltro] = React.useState<string>("todos")
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [horaActual, setHoraActual] = React.useState(new Date())

  if (loadingFichajes) return <LoadingSkeleton />

  // Reloj en tiempo real
  React.useEffect(() => {
    const interval = setInterval(() => setHoraActual(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Cerrar calendario al hacer clic fuera
  const calendarRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false)
      }
    }
    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [calendarOpen])

  // Determinar si el último fichaje del "usuario actual" (Miguel Santos - admin) es entrada o salida
  const currentUserName = userProfile?.nombre ?? "Miguel"
  const currentUserApellidos = userProfile?.apellidos ?? "Santos Rivas"

  const ultimoFichajePropio = React.useMemo(() => {
    const propios = fichajes
      .filter(
        (f) =>
          f.usuario_nombre === currentUserName &&
          f.usuario_apellidos === currentUserApellidos
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    return propios[0] ?? null
  }, [fichajes, currentUserName, currentUserApellidos])

  const siguienteTipo =
    !ultimoFichajePropio || ultimoFichajePropio.tipo === "salida"
      ? "entrada"
      : "salida"

  // Fichajes filtrados por fecha y empleado
  const fichajesFiltrados = React.useMemo(() => {
    return fichajes
      .filter((f) => {
        const matchFecha = isSameDay(new Date(f.timestamp), fechaFiltro)
        const matchEmpleado =
          empleadoFiltro === "todos" ||
          `${f.usuario_nombre} ${f.usuario_apellidos}` === empleadoFiltro
        return matchFecha && matchEmpleado
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
  }, [fichajes, fechaFiltro, empleadoFiltro])

  // Stats del día seleccionado
  const fichajesDelDia = React.useMemo(() => {
    return fichajes.filter((f) =>
      isSameDay(new Date(f.timestamp), fechaFiltro)
    )
  }, [fichajes, fechaFiltro])

  const stats = React.useMemo(() => {
    const empleadosFichados = new Set(
      fichajesDelDia.map((f) => `${f.usuario_nombre} ${f.usuario_apellidos}`)
    )
    const entradas = fichajesDelDia.filter((f) => f.tipo === "entrada").length
    const salidas = fichajesDelDia.filter((f) => f.tipo === "salida").length
    const sinFichar = EMPLEADOS.length - empleadosFichados.size

    return {
      empleadosFichados: empleadosFichados.size,
      entradas,
      salidas,
      sinFichar,
    }
  }, [fichajesDelDia])

  async function handleFichar() {
    try {
      if (userProfile) {
        await createFichaje({
          usuario_id: userProfile.id,
          tipo: siguienteTipo,
          metodo: "app",
        })
        toast.success(`Fichaje de ${siguienteTipo} registrado`)
        refetch()
      } else {
        // Fallback to local state
        const nuevoFichaje: Fichaje = {
          id: `f${Date.now()}`,
          usuario_nombre: "Miguel",
          usuario_apellidos: "Santos Rivas",
          usuario_rol: "admin",
          tipo: siguienteTipo,
          timestamp: new Date().toISOString(),
          metodo: "app",
        }
        setFichajes((prev) => [nuevoFichaje, ...prev])
        toast.success(`Fichaje de ${siguienteTipo} registrado`)
      }
    } catch {
      toast.error("Error al registrar el fichaje")
    }
  }

  const hasActiveFilters =
    !isSameDay(fechaFiltro, new Date()) || empleadoFiltro !== "todos"

  const fechaFiltroLabel = fechaFiltro.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const esHoy = isSameDay(fechaFiltro, new Date())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image
          src="/icons/fichajes.png"
          alt="Fichajes"
          width={36}
          height={36}
          className="shrink-0"
        />
        <div>
          <h1 className="text-3xl font-bold">Fichajes</h1>
          <p className="text-muted-foreground">
            Control de entrada y salida del personal
          </p>
        </div>
      </div>

      {/* Tarjeta de fichar */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between sm:py-6">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-sm text-muted-foreground">Hora actual</p>
            <p className="text-4xl font-bold tabular-nums tracking-tight">
              {horaActual.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {horaActual.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <RequireWrite entity="fichajes">
            <Button
              size="lg"
              className={`h-16 min-w-48 text-lg font-semibold ${
                siguienteTipo === "entrada"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={handleFichar}
            >
              {siguienteTipo === "entrada" ? (
                <LogIn className="mr-2 size-6" />
              ) : (
                <LogOut className="mr-2 size-6" />
              )}
              Fichar {siguienteTipo}
            </Button>
          </RequireWrite>
        </CardContent>
      </Card>

      {/* Resumen del día */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.empleadosFichados}</p>
              <p className="text-xs text-muted-foreground">
                Han fichado {esHoy ? "hoy" : "ese día"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <LogIn className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.entradas}</p>
              <p className="text-xs text-muted-foreground">Entradas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <LogOut className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.salidas}</p>
              <p className="text-xs text-muted-foreground">Salidas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <UserX className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.sinFichar}</p>
              <p className="text-xs text-muted-foreground">Sin fichar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative" ref={calendarRef}>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            <CalendarDays className="size-4" />
            {fechaFiltroLabel}
          </Button>
          {calendarOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border bg-background p-0 shadow-lg">
              <Calendar
                mode="single"
                selected={fechaFiltro}
                onSelect={(date) => {
                  if (date) setFechaFiltro(date)
                  setCalendarOpen(false)
                }}
                locale={es}
              />
            </div>
          )}
        </div>
        <Select value={empleadoFiltro} onValueChange={(v) => setEmpleadoFiltro(v ?? "todos")}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Todos los empleados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los empleados</SelectItem>
            {EMPLEADOS.map((e) => (
              <SelectItem
                key={`${e.nombre} ${e.apellidos}`}
                value={`${e.nombre} ${e.apellidos}`}
              >
                {e.nombre} {e.apellidos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFechaFiltro(new Date())
              setEmpleadoFiltro("todos")
            }}
          >
            <X className="mr-1 size-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Tabla de fichajes */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden sm:table-cell">
                Fecha/Hora
              </TableHead>
              <TableHead className="sm:hidden">Hora</TableHead>
              <TableHead className="hidden sm:table-cell">Método</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fichajesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="size-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      No hay fichajes para esta fecha
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              fichajesFiltrados.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">
                    {f.usuario_nombre} {f.usuario_apellidos}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        f.tipo === "entrada"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                    >
                      {f.tipo === "entrada" ? "Entrada" : "Salida"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {formatDateTime(f.timestamp)}
                  </TableCell>
                  <TableCell className="text-muted-foreground sm:hidden">
                    {formatTime(f.timestamp)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      className={
                        f.metodo === "app"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {f.metodo === "app" ? "App" : "Manual"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
