"use client"

import * as React from "react"
import { Search, Plus, X, Car, Scale } from "lucide-react"
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
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog"
import { VehiculoDetailSheet } from "@/components/vehiculos/vehiculo-detail-sheet"
import { CosteFormDialog } from "@/components/vehiculos/coste-form-dialog"
import { IncidenciaFormDialog } from "@/components/vehiculos/incidencia-form-dialog"
import { CompararVehiculosDialog } from "@/components/vehiculos/comparar-vehiculos-dialog"
import { ConfirmarBajaDialog } from "@/components/vehiculos/confirmar-baja-dialog"
import { MOCK_VEHICULOS, MOCK_COSTES, MOCK_INCIDENCIAS } from "@/components/vehiculos/mock-data"
import type {
  Vehiculo,
  CosteVehiculo,
  IncidenciaVehiculo,
} from "@/components/vehiculos/types"
import {
  TIPO_LABELS,
  ESTADO_LABELS,
  ESTADO_COLORS,
  TIPOS,
  ESTADOS,
} from "@/components/vehiculos/types"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import {
  getVehiculos,
  createVehiculo,
  updateVehiculo,
  getAllCostes,
  getAllIncidencias,
  createCosteVehiculo,
  createIncidenciaVehiculo,
} from "@/lib/services/vehiculos"
import { RequireWrite } from "@/components/auth/require-write"
import { toast } from "sonner"

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

export default function VehiculosPage() {
  const { data: sbVehiculos, loading: loadingV, refetch: refetchV } = useSupabaseQuery(() => getVehiculos())
  const { data: sbCostes, loading: loadingC, refetch: refetchC } = useSupabaseQuery(() => getAllCostes())
  const { data: sbIncidencias, loading: loadingI, refetch: refetchI } = useSupabaseQuery(() => getAllIncidencias())

  const [vehiculos, setVehiculos] = React.useState<Vehiculo[]>(MOCK_VEHICULOS)
  const [costes, setCostes] = React.useState<CosteVehiculo[]>(MOCK_COSTES)
  const [incidencias, setIncidencias] = React.useState<IncidenciaVehiculo[]>(MOCK_INCIDENCIAS)

  React.useEffect(() => { if (sbVehiculos) setVehiculos(sbVehiculos) }, [sbVehiculos])
  React.useEffect(() => { if (sbCostes) setCostes(sbCostes) }, [sbCostes])
  React.useEffect(() => { if (sbIncidencias) setIncidencias(sbIncidencias) }, [sbIncidencias])

  const loading = loadingV || loadingC || loadingI

  const [search, setSearch] = React.useState("")
  const [filtroTipo, setFiltroTipo] = React.useState<string>("todos")
  const [filtroEstado, setFiltroEstado] = React.useState<string>("todos")

  // Dialog states
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingVehiculo, setEditingVehiculo] = React.useState<Vehiculo | null>(null)
  const [detailVehiculo, setDetailVehiculo] = React.useState<Vehiculo | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [bajaVehiculo, setBajaVehiculo] = React.useState<Vehiculo | null>(null)
  const [bajaDialogOpen, setBajaDialogOpen] = React.useState(false)
  const [costeDialogOpen, setCosteDialogOpen] = React.useState(false)
  const [incidenciaDialogOpen, setIncidenciaDialogOpen] = React.useState(false)
  const [compararDialogOpen, setCompararDialogOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    return vehiculos.filter((v) => {
      const matchSearch =
        !search ||
        `${v.marca} ${v.modelo}`.toLowerCase().includes(search.toLowerCase()) ||
        v.matricula.toLowerCase().includes(search.toLowerCase())
      const matchTipo = filtroTipo === "todos" || v.tipo === filtroTipo
      const matchEstado = filtroEstado === "todos" || v.estado === filtroEstado
      return matchSearch && matchTipo && matchEstado
    })
  }, [vehiculos, search, filtroTipo, filtroEstado])

  const hasActiveFilters = search || filtroTipo !== "todos" || filtroEstado !== "todos"

  function getCosteTotalVehiculo(vehiculoId: string, precioAdquisicion: number) {
    const totalCostes = costes
      .filter((c) => c.vehiculo_id === vehiculoId)
      .reduce((sum, c) => sum + c.importe, 0)
    return precioAdquisicion + totalCostes
  }

  async function handleSave(data: Omit<Vehiculo, "id">) {
    try {
      if (editingVehiculo) {
        await updateVehiculo(editingVehiculo.id, data)
        toast.success("Vehículo actualizado correctamente")
      } else {
        await createVehiculo(data)
        toast.success("Vehículo creado correctamente")
      }
      await refetchV()
    } catch (error) {
      toast.error("Error al guardar el vehículo")
      // Fallback to local state
      if (editingVehiculo) {
        setVehiculos((prev) =>
          prev.map((v) =>
            v.id === editingVehiculo.id ? { ...v, ...data } : v
          )
        )
      } else {
        const newVehiculo: Vehiculo = {
          ...data,
          id: String(Date.now()),
        }
        setVehiculos((prev) => [...prev, newVehiculo])
      }
    }
    setEditingVehiculo(null)
  }

  function handleEdit(vehiculo: Vehiculo) {
    setEditingVehiculo(vehiculo)
    setFormOpen(true)
  }

  function handleBaja(vehiculo: Vehiculo) {
    setBajaVehiculo(vehiculo)
    setBajaDialogOpen(true)
  }

  async function confirmBaja() {
    if (!bajaVehiculo) return
    try {
      await updateVehiculo(bajaVehiculo.id, { estado: "baja" })
      toast.success("Vehículo dado de baja correctamente")
      await refetchV()
    } catch (error) {
      toast.error("Error al dar de baja el vehículo")
      setVehiculos((prev) =>
        prev.map((v) =>
          v.id === bajaVehiculo.id ? { ...v, estado: "baja" as const } : v
        )
      )
    }
    setBajaVehiculo(null)
    setSheetOpen(false)
  }

  async function handleSaveCoste(data: Omit<CosteVehiculo, "id" | "vehiculo_id">) {
    if (!detailVehiculo) return
    try {
      await createCosteVehiculo({
        ...data,
        vehiculo_id: detailVehiculo.id,
      })
      toast.success("Coste registrado correctamente")
      await refetchC()
    } catch (error) {
      toast.error("Error al registrar el coste")
      const newCoste: CosteVehiculo = {
        ...data,
        id: String(Date.now()),
        vehiculo_id: detailVehiculo.id,
      }
      setCostes((prev) => [...prev, newCoste])
    }
  }

  async function handleSaveIncidencia(data: Omit<IncidenciaVehiculo, "id" | "vehiculo_id">) {
    if (!detailVehiculo) return
    try {
      await createIncidenciaVehiculo({
        ...data,
        vehiculo_id: detailVehiculo.id,
      })
      toast.success("Incidencia registrada correctamente")
      await refetchI()
    } catch (error) {
      toast.error("Error al registrar la incidencia")
      const newIncidencia: IncidenciaVehiculo = {
        ...data,
        id: String(Date.now()),
        vehiculo_id: detailVehiculo.id,
      }
      setIncidencias((prev) => [...prev, newIncidencia])
    }
  }

  function clearFilters() {
    setSearch("")
    setFiltroTipo("todos")
    setFiltroEstado("todos")
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
            <Car className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Vehículos</h1>
            <p className="text-sm text-muted-foreground">
              {vehiculos.length} vehículo{vehiculos.length !== 1 ? "s" : ""} registrado{vehiculos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <RequireWrite entity="vehiculos">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCompararDialogOpen(true)}
            >
              <Scale className="size-4" data-icon="inline-start" />
              Comparar
            </Button>
            <Button
              onClick={() => {
                setEditingVehiculo(null)
                setFormOpen(true)
              }}
            >
              <Plus className="size-4" data-icon="inline-start" />
              Nuevo vehículo
            </Button>
          </div>
        </RequireWrite>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por marca, modelo o matrícula..."
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
            {TIPOS.map((t) => (
              <SelectItem key={t} value={t}>
                {TIPO_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroEstado} onValueChange={(val) => setFiltroEstado(val ?? "todos")}>
          <SelectTrigger className="w-full sm:w-40">
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
                <TableHead>Vehículo</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell text-right">Km</TableHead>
                <TableHead className="hidden md:table-cell text-right">Coste total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vehiculo) => (
                <TableRow
                  key={vehiculo.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setDetailVehiculo(vehiculo)
                    setSheetOpen(true)
                  }}
                >
                  <TableCell className="font-medium">
                    {vehiculo.marca} {vehiculo.modelo}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {vehiculo.matricula}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{TIPO_LABELS[vehiculo.tipo]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${ESTADO_COLORS[vehiculo.estado]}`}
                    >
                      {ESTADO_LABELS[vehiculo.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                    {vehiculo.km_actuales.toLocaleString("es-ES")} km
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right font-medium">
                    {formatCurrency(
                      getCosteTotalVehiculo(vehiculo.id, vehiculo.precio_adquisicion)
                    )}
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
          <h3 className="text-lg font-semibold">No se encontraron vehículos</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {hasActiveFilters
              ? "Prueba a cambiar los filtros de búsqueda o limpiar los filtros."
              : "Aún no hay vehículos registrados. Haz clic en \"Nuevo vehículo\" para empezar."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Dialogs & Sheet */}
      <VehiculoFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingVehiculo(null)
        }}
        vehiculo={editingVehiculo}
        onSave={handleSave}
      />
      <VehiculoDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        vehiculo={detailVehiculo}
        costes={costes}
        incidencias={incidencias}
        onEdit={handleEdit}
        onBaja={handleBaja}
        onAddCoste={() => setCosteDialogOpen(true)}
        onAddIncidencia={() => setIncidenciaDialogOpen(true)}
      />
      <CosteFormDialog
        open={costeDialogOpen}
        onOpenChange={setCosteDialogOpen}
        onSave={handleSaveCoste}
      />
      <IncidenciaFormDialog
        open={incidenciaDialogOpen}
        onOpenChange={setIncidenciaDialogOpen}
        onSave={handleSaveIncidencia}
      />
      <CompararVehiculosDialog
        open={compararDialogOpen}
        onOpenChange={setCompararDialogOpen}
        vehiculos={vehiculos}
        costes={costes}
        incidencias={incidencias}
      />
      <ConfirmarBajaDialog
        open={bajaDialogOpen}
        onOpenChange={setBajaDialogOpen}
        vehiculo={bajaVehiculo}
        onConfirm={confirmBaja}
      />
    </div>
  )
}
