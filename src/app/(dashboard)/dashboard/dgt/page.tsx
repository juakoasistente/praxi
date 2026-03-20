"use client"

import * as React from "react"
import { Building2, Plus, Search, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Combobox } from "@/components/ui/combobox"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV, exportFormatDate, exportFormatCurrency } from "@/lib/export"
import { DocumentoChecklist } from "@/components/dgt/documento-checklist"
import { TramiteDetailSheet } from "@/components/dgt/tramite-detail-sheet"
import { MOCK_TRAMITES } from "@/components/dgt/mock-data"
import type { TramiteDGT, TipoTramite, EstadoTramite } from "@/components/dgt/types"
import {
  TIPO_TRAMITE_LABELS,
  TIPO_TRAMITE_COLORS,
  ESTADO_TRAMITE_LABELS,
  ESTADO_TRAMITE_COLORS,
  TIPOS_TRAMITE,
  ESTADOS_TRAMITE,
  DOCUMENTOS_POR_TIPO,
} from "@/components/dgt/types"

const CENTROS_DGT = [
  "DGT Madrid - Arturo Soria",
  "DGT Sevilla - Parque Tecnológico",
  "DGT Barcelona - Gran Vía",
  "DGT Valencia - Avenida del Cid",
]

const MOCK_ALUMNOS = [
  { value: "1", label: "María García López" },
  { value: "2", label: "Juan Pérez Martínez" },
  { value: "3", label: "Ana Rodríguez Sánchez" },
  { value: "4", label: "Carlos Fernández Ruiz" },
  { value: "5", label: "Laura Martín Torres" },
  { value: "6", label: "Pedro López Hernández" },
  { value: "7", label: "Sofía Díaz Moreno" },
  { value: "8", label: "Diego Romero Navarro" },
  { value: "9", label: "Elena Jiménez Vega" },
  { value: "10", label: "Álvaro Castro Gil" },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function DGTPage() {
  const [tramites, setTramites] = React.useState<TramiteDGT[]>(MOCK_TRAMITES)
  const [search, setSearch] = React.useState("")
  const [filtroTipo, setFiltroTipo] = React.useState<string>("todos")
  const [filtroEstado, setFiltroEstado] = React.useState<string>("todos")

  // Detail sheet
  const [selectedTramite, setSelectedTramite] = React.useState<TramiteDGT | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  // New tramite dialog
  const [formOpen, setFormOpen] = React.useState(false)
  const [newAlumnoId, setNewAlumnoId] = React.useState("")
  const [newTipo, setNewTipo] = React.useState<TipoTramite>("alta_alumno")
  const [newCentro, setNewCentro] = React.useState(CENTROS_DGT[0])
  const [newDocsEntregados, setNewDocsEntregados] = React.useState<string[]>([])

  const filtered = React.useMemo(() => {
    return tramites.filter((t) => {
      const matchSearch =
        !search || t.alumno_nombre.toLowerCase().includes(search.toLowerCase())
      const matchTipo = filtroTipo === "todos" || t.tipo === filtroTipo
      const matchEstado = filtroEstado === "todos" || t.estado === filtroEstado
      return matchSearch && matchTipo && matchEstado
    })
  }, [tramites, search, filtroTipo, filtroEstado])

  const hasActiveFilters = search || filtroTipo !== "todos" || filtroEstado !== "todos"

  const stats = React.useMemo(() => {
    const pendientes = tramites.filter((t) => t.estado === "pendiente").length
    const enProceso = tramites.filter((t) => t.estado === "en_proceso").length
    const completadosMes = tramites.filter((t) => {
      if (t.estado !== "completado" || !t.fecha_resolucion) return false
      const d = new Date(t.fecha_resolucion)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    const tasasPendientes = tramites
      .filter((t) => !t.tasa_pagada)
      .reduce((sum, t) => sum + t.importe_tasa, 0)
    return { pendientes, enProceso, completadosMes, tasasPendientes }
  }, [tramites])

  function clearFilters() {
    setSearch("")
    setFiltroTipo("todos")
    setFiltroEstado("todos")
  }

  function handleRowClick(tramite: TramiteDGT) {
    setSelectedTramite(tramite)
    setSheetOpen(true)
  }

  function handleUpdateTramite(id: string, updates: Partial<TramiteDGT>) {
    setTramites((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
    // Also update selected tramite for the sheet
    setSelectedTramite((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
  }

  function resetForm() {
    setNewAlumnoId("")
    setNewTipo("alta_alumno")
    setNewCentro(CENTROS_DGT[0])
    setNewDocsEntregados([])
  }

  function handleCreateTramite() {
    const alumno = MOCK_ALUMNOS.find((a) => a.value === newAlumnoId)
    if (!alumno) {
      toast.error("Selecciona un alumno")
      return
    }

    const newTramite: TramiteDGT = {
      id: `t${Date.now()}`,
      alumno_id: newAlumnoId,
      alumno_nombre: alumno.label,
      tipo: newTipo,
      estado: "pendiente",
      fecha_inicio: new Date().toISOString().split("T")[0],
      fecha_resolucion: null,
      numero_expediente: null,
      centro_dgt: newCentro,
      documentos: DOCUMENTOS_POR_TIPO[newTipo],
      documentos_entregados: newDocsEntregados,
      notas: null,
      tasa_pagada: false,
      importe_tasa: 94.05,
    }

    setTramites((prev) => [newTramite, ...prev])
    setFormOpen(false)
    resetForm()
    toast.success("Trámite creado correctamente")
  }

  // Keep form docs in sync with tipo
  const newDocumentos = DOCUMENTOS_POR_TIPO[newTipo]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Trámites DGT</h1>
            <p className="text-sm text-muted-foreground">
              {tramites.length} trámite{tramites.length !== 1 ? "s" : ""} registrados
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ExportButton
            onExport={() =>
              exportToCSV(filtered, [
                { key: "alumno_nombre", label: "Alumno" },
                { key: "tipo", label: "Tipo", format: (v) => TIPO_TRAMITE_LABELS[v as TipoTramite] ?? String(v) },
                { key: "estado", label: "Estado", format: (v) => ESTADO_TRAMITE_LABELS[v as EstadoTramite] ?? String(v) },
                { key: "centro_dgt", label: "Centro DGT" },
                { key: "fecha_inicio", label: "Fecha inicio", format: (v) => exportFormatDate(v as string) },
                { key: "numero_expediente", label: "Expediente", format: (v) => (v as string) ?? "" },
                { key: "importe_tasa", label: "Tasa", format: (v) => exportFormatCurrency(v as number) },
                { key: "tasa_pagada", label: "Tasa pagada", format: (v) => (v ? "Sí" : "No") },
              ], "tramites-dgt")
            }
          />
          <Button onClick={() => { resetForm(); setFormOpen(true) }}>
            <Plus className="size-4" data-icon="inline-start" />
            Nuevo trámite
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Pendientes", value: stats.pendientes, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "En proceso", value: stats.enProceso, color: "text-blue-600 dark:text-blue-400" },
          { label: "Completados este mes", value: stats.completadosMes, color: "text-green-600 dark:text-green-400" },
          {
            label: "Tasas pendientes",
            value: stats.tasasPendientes.toLocaleString("es-ES", { style: "currency", currency: "EUR" }),
            color: "text-red-600 dark:text-red-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por alumno..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filtroTipo} onValueChange={(val) => setFiltroTipo(val ?? "todos")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            {TIPOS_TRAMITE.map((t) => (
              <SelectItem key={t} value={t}>{TIPO_TRAMITE_LABELS[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroEstado} onValueChange={(val) => setFiltroEstado(val ?? "todos")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ESTADOS_TRAMITE.map((e) => (
              <SelectItem key={e} value={e}>{ESTADO_TRAMITE_LABELS[e]}</SelectItem>
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
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Centro DGT</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha inicio</TableHead>
                <TableHead className="hidden lg:table-cell">Expediente</TableHead>
                <TableHead className="text-right">Tasa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tramite) => (
                <TableRow
                  key={tramite.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(tramite)}
                >
                  <TableCell className="font-medium">{tramite.alumno_nombre}</TableCell>
                  <TableCell>
                    <Badge className={`border-0 ${TIPO_TRAMITE_COLORS[tramite.tipo]}`}>
                      {TIPO_TRAMITE_LABELS[tramite.tipo]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border-0 ${ESTADO_TRAMITE_COLORS[tramite.estado]}`}>
                      {ESTADO_TRAMITE_LABELS[tramite.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {tramite.centro_dgt}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(tramite.fecha_inicio)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-muted-foreground">
                    {tramite.numero_expediente ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tramite.tasa_pagada ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {tramite.importe_tasa.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </span>
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
          <h3 className="text-lg font-semibold">No se encontraron trámites</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {hasActiveFilters
              ? "Prueba a cambiar los filtros de búsqueda o limpiar los filtros."
              : "Aún no hay trámites. Haz clic en \"Nuevo trámite\" para empezar."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Detail sheet */}
      <TramiteDetailSheet
        tramite={selectedTramite}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={handleUpdateTramite}
      />

      {/* New tramite dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo trámite DGT</DialogTitle>
            <DialogDescription>
              Registra un nuevo trámite para gestionar con la DGT.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Alumno</Label>
              <Combobox
                options={MOCK_ALUMNOS}
                value={newAlumnoId}
                onValueChange={setNewAlumnoId}
                placeholder="Seleccionar alumno..."
                searchPlaceholder="Buscar alumno..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tipo de trámite</Label>
              <Select value={newTipo} onValueChange={(v) => { setNewTipo(v as TipoTramite); setNewDocsEntregados([]) }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_TRAMITE.map((t) => (
                    <SelectItem key={t} value={t}>{TIPO_TRAMITE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Centro DGT</Label>
              <Select value={newCentro} onValueChange={(v) => { if (v) setNewCentro(v) }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CENTROS_DGT.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Documentos requeridos</Label>
              <DocumentoChecklist
                documentos={newDocumentos}
                entregados={newDocsEntregados}
                onChange={setNewDocsEntregados}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTramite}>
              Crear trámite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
