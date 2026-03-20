"use client"

import * as React from "react"
import { FileSignature, Plus, Search, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ExportButton } from "@/components/ui/export-button"
import { RequireWrite } from "@/components/auth/require-write"
import { exportToCSV, exportFormatDate, exportFormatCurrency } from "@/lib/export"
import { MOCK_CONTRATOS } from "@/components/contratos/mock-data"
import { ContratoFormDialog } from "@/components/contratos/contrato-form-dialog"
import { ContratoPreview } from "@/components/contratos/contrato-preview"
import type { Contrato, EstadoContrato } from "@/components/contratos/types"
import {
  ESTADO_LABELS,
  ESTADO_COLORS,
  ESTADOS_CONTRATO,
} from "@/components/contratos/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
}

export default function ContratosPage() {
  const [contratos, setContratos] = React.useState<Contrato[]>(MOCK_CONTRATOS)
  const [search, setSearch] = React.useState("")
  const [filtroEstado, setFiltroEstado] = React.useState<string>("todos")
  const [formOpen, setFormOpen] = React.useState(false)
  const [previewContrato, setPreviewContrato] = React.useState<Contrato | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    return contratos.filter((c) => {
      const matchSearch =
        !search || c.alumno_nombre.toLowerCase().includes(search.toLowerCase())
      const matchEstado = filtroEstado === "todos" || c.estado === filtroEstado
      return matchSearch && matchEstado
    })
  }, [contratos, search, filtroEstado])

  const hasActiveFilters = search || filtroEstado !== "todos"

  const stats = React.useMemo(() => {
    const total = contratos.length
    const firmados = contratos.filter((c) => c.estado === "firmado").length
    const pendientes = contratos.filter((c) => c.estado === "enviado").length
    const borradores = contratos.filter((c) => c.estado === "borrador").length
    return { total, firmados, pendientes, borradores }
  }, [contratos])

  function handleCreate(data: Omit<Contrato, "id">) {
    const newContrato: Contrato = { ...data, id: `c${Date.now()}` }
    setContratos((prev) => [newContrato, ...prev])
    toast.success("Contrato creado correctamente")
  }

  function handleFirmar(firmaDataUrl: string) {
    if (!previewContrato) return
    setContratos((prev) =>
      prev.map((c) =>
        c.id === previewContrato.id
          ? {
              ...c,
              estado: "firmado" as const,
              firma_alumno: firmaDataUrl,
              fecha_firma: new Date().toISOString().split("T")[0],
            }
          : c
      )
    )
    setPreviewContrato((prev) =>
      prev
        ? {
            ...prev,
            estado: "firmado",
            firma_alumno: firmaDataUrl,
            fecha_firma: new Date().toISOString().split("T")[0],
          }
        : null
    )
    toast.success("Contrato firmado correctamente")
  }

  function clearFilters() {
    setSearch("")
    setFiltroEstado("todos")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <FileSignature className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Contratos</h1>
            <p className="text-sm text-muted-foreground">
              {contratos.length} contrato{contratos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ExportButton
            onExport={() =>
              exportToCSV(filtered, [
                { key: "alumno_nombre", label: "Alumno" },
                { key: "tipo_permiso", label: "Permiso" },
                { key: "fecha_creacion", label: "Fecha creación", format: (v) => exportFormatDate(v as string) },
                { key: "estado", label: "Estado", format: (v) => ESTADO_LABELS[v as EstadoContrato] ?? String(v) },
                { key: "total", label: "Total", format: (v) => exportFormatCurrency(v as number) },
              ], "contratos")
            }
          />
          <RequireWrite entity="contratos">
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="size-4" data-icon="inline-start" />
              Nuevo contrato
            </Button>
          </RequireWrite>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Firmados", value: stats.firmados, color: "text-green-600 dark:text-green-400" },
          { label: "Pendientes de firma", value: stats.pendientes, color: "text-blue-600 dark:text-blue-400" },
          { label: "Borradores", value: stats.borradores, color: "text-gray-600 dark:text-gray-400" },
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
        <Select value={filtroEstado} onValueChange={(val) => setFiltroEstado(val ?? "todos")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ESTADOS_CONTRATO.map((e) => (
              <SelectItem key={e} value={e}>{ESTADO_LABELS[e]}</SelectItem>
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
                <TableHead>Permiso</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((contrato) => (
                <TableRow
                  key={contrato.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setPreviewContrato(contrato)
                    setPreviewOpen(true)
                  }}
                >
                  <TableCell className="font-medium">{contrato.alumno_nombre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{contrato.tipo_permiso}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(contrato.fecha_creacion)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(contrato.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`border-0 ${ESTADO_COLORS[contrato.estado]}`}>
                      {ESTADO_LABELS[contrato.estado]}
                    </Badge>
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
          <h3 className="text-lg font-semibold">No se encontraron contratos</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {hasActiveFilters
              ? "Prueba a cambiar los filtros de búsqueda o limpiar los filtros."
              : "Aún no hay contratos. Haz clic en \"Nuevo contrato\" para empezar."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Form dialog */}
      <ContratoFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleCreate}
      />

      {/* Preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {previewContrato && (
            <ContratoPreview
              contrato={previewContrato}
              onFirmar={handleFirmar}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
