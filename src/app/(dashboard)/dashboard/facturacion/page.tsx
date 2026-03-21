"use client"

import * as React from "react"
import { Search, Plus, X, Receipt, Euro, AlertTriangle, Clock } from "lucide-react"
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
import { FacturaFormDialog } from "@/components/facturacion/factura-form-dialog"
import { FacturaDetailSheet } from "@/components/facturacion/factura-detail-sheet"
import { MOCK_FACTURAS, MOCK_PAGOS } from "@/components/facturacion/mock-data"
import type { Factura, PagoFactura } from "@/components/facturacion/types"
import {
  ESTADO_FACTURA_LABELS,
  ESTADO_FACTURA_COLORS,
  ESTADOS_FACTURA,
  METODO_PAGO_LABELS,
} from "@/components/facturacion/types"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { getFacturas, createFactura, updateFactura } from "@/lib/services/facturacion"
import { RequireWrite } from "@/components/auth/require-write"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV, exportFormatDate, exportFormatCurrency } from "@/lib/export"
import type { EstadoFactura } from "@/components/facturacion/types"
import { toast } from "sonner"
import { useSede } from "@/hooks/use-sede"
import { SEDE_ALL_OPTION } from "@/components/sedes/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

export default function FacturacionPage() {
  const { data: sbFacturas, loading, refetch } = useSupabaseQuery(() => getFacturas())
  const [facturas, setFacturas] = React.useState<Factura[]>(MOCK_FACTURAS)
  const [pagos, setPagos] = React.useState<PagoFactura[]>(MOCK_PAGOS)

  React.useEffect(() => {
    if (sbFacturas) setFacturas(sbFacturas)
  }, [sbFacturas])

  const [search, setSearch] = React.useState("")
  const [filtroEstado, setFiltroEstado] = React.useState<string>("todos")

  // Dialog states
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingFactura, setEditingFactura] = React.useState<Factura | null>(null)
  const [detailFactura, setDetailFactura] = React.useState<Factura | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    return facturas.filter((f) => {
      const matchSearch =
        !search ||
        f.alumno_nombre.toLowerCase().includes(search.toLowerCase()) ||
        f.numero.toLowerCase().includes(search.toLowerCase())
      const matchEstado = filtroEstado === "todos" || f.estado === filtroEstado
      return matchSearch && matchEstado
    })
  }, [facturas, search, filtroEstado])

  const hasActiveFilters = search || filtroEstado !== "todos"

  // Stats - calculate "Cobrado" from actual payments
  const totalFacturado = facturas
    .filter((f) => f.estado !== "anulada")
    .reduce((sum, f) => sum + f.total, 0)
  const cobrado = React.useMemo(() => {
    return pagos
      .filter((p) => {
        const factura = facturas.find((f) => f.id === p.factura_id)
        return factura && factura.estado !== "anulada"
      })
      .reduce((sum, p) => sum + p.importe, 0)
  }, [pagos, facturas])
  const pendienteCobro = facturas
    .filter((f) => f.estado === "pendiente" || f.estado === "parcial")
    .reduce((sum, f) => {
      const pagado = pagos
        .filter((p) => p.factura_id === f.id)
        .reduce((s, p) => s + p.importe, 0)
      return sum + (f.total - pagado)
    }, 0)
  const vencido = facturas
    .filter((f) => f.estado === "vencida")
    .reduce((sum, f) => sum + f.total, 0)

  // Next invoice number
  const nextNumero = React.useMemo(() => {
    const maxNum = facturas.reduce((max, f) => {
      const num = parseInt(f.numero.split("-").pop() || "0", 10)
      return num > max ? num : max
    }, 0)
    return `FAC-2026-${String(maxNum + 1).padStart(3, "0")}`
  }, [facturas])

  async function handleSave(data: Omit<Factura, "id">) {
    try {
      if (editingFactura) {
        await updateFactura(editingFactura.id, data)
        toast.success("Factura actualizada correctamente")
      } else {
        await createFactura(data)
        toast.success("Factura creada correctamente")
      }
      refetch()
    } catch {
      // Fallback to local state on error
      if (editingFactura) {
        setFacturas((prev) =>
          prev.map((f) =>
            f.id === editingFactura.id ? { ...f, ...data } : f
          )
        )
      } else {
        const newFactura: Factura = {
          ...data,
          id: String(Date.now()),
        }
        setFacturas((prev) => [...prev, newFactura])
      }
      toast.error("Error al guardar en servidor, cambios aplicados localmente")
    }
    setEditingFactura(null)
  }

  function handleEdit(factura: Factura) {
    setEditingFactura(factura)
    setFormOpen(true)
  }

  async function handleMarkPaid(factura: Factura) {
    const totalPagado = pagos
      .filter((p) => p.factura_id === factura.id)
      .reduce((sum, p) => sum + p.importe, 0)
    const remaining = factura.total - totalPagado

    // Record the remaining payment
    if (remaining > 0) {
      const newPago: PagoFactura = {
        id: `p-${Date.now()}`,
        factura_id: factura.id,
        importe: remaining,
        fecha: new Date().toISOString().split("T")[0],
        metodo_pago: factura.metodo_pago ?? "efectivo",
        notas: "Pago completo restante",
      }
      setPagos((prev) => [...prev, newPago])
    }

    try {
      await updateFactura(factura.id, {
        estado: "pagada",
        fecha_pago: new Date().toISOString().split("T")[0],
      })
      toast.success("Factura marcada como pagada")
      refetch()
    } catch {
      setFacturas((prev) =>
        prev.map((f) =>
          f.id === factura.id
            ? {
                ...f,
                estado: "pagada" as const,
                fecha_pago: new Date().toISOString().split("T")[0],
              }
            : f
        )
      )
      toast.error("Error al actualizar en servidor, cambios aplicados localmente")
    }
    setSheetOpen(false)
    setDetailFactura(null)
  }

  async function handleAnular(factura: Factura) {
    try {
      await updateFactura(factura.id, { estado: "anulada" })
      toast.success("Factura anulada correctamente")
      refetch()
    } catch {
      setFacturas((prev) =>
        prev.map((f) =>
          f.id === factura.id ? { ...f, estado: "anulada" as const } : f
        )
      )
      toast.error("Error al anular en servidor, cambios aplicados localmente")
    }
    setSheetOpen(false)
    setDetailFactura(null)
  }

  function handleAddPago(data: Omit<PagoFactura, "id">) {
    const newPago: PagoFactura = {
      ...data,
      id: `p-${Date.now()}`,
    }
    setPagos((prev) => [...prev, newPago])

    // Check if fully paid
    const factura = facturas.find((f) => f.id === data.factura_id)
    if (factura) {
      const totalPagado = pagos
        .filter((p) => p.factura_id === factura.id)
        .reduce((sum, p) => sum + p.importe, 0) + data.importe

      if (totalPagado >= factura.total) {
        setFacturas((prev) =>
          prev.map((f) =>
            f.id === factura.id
              ? { ...f, estado: "pagada" as const, fecha_pago: data.fecha }
              : f
          )
        )
        toast.success("Pago registrado. Factura completamente pagada.")
      } else {
        setFacturas((prev) =>
          prev.map((f) =>
            f.id === factura.id
              ? { ...f, estado: "parcial" as const }
              : f
          )
        )
        toast.success("Pago parcial registrado correctamente.")
      }
    }
  }

  function clearFilters() {
    setSearch("")
    setFiltroEstado("todos")
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
            <Receipt className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Facturación</h1>
            <p className="text-sm text-muted-foreground">
              {facturas.length} factura{facturas.length !== 1 ? "s" : ""} registrada{facturas.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ExportButton
            onExport={() =>
              exportToCSV(filtered, [
                { key: "numero", label: "Nº Factura" },
                { key: "alumno_nombre", label: "Alumno" },
                { key: "fecha_emision", label: "Fecha emisión", format: (v) => exportFormatDate(v as string) },
                { key: "total", label: "Total", format: (v) => exportFormatCurrency(Number(v)) },
                { key: "estado", label: "Estado", format: (v) => ESTADO_FACTURA_LABELS[v as EstadoFactura] ?? String(v) },
                { key: "fecha_pago", label: "Fecha pago", format: (v) => v ? exportFormatDate(v as string) : "" },
              ], "facturacion")
            }
          />
          <RequireWrite entity="facturacion">
            <Button
              onClick={() => {
                setEditingFactura(null)
                setFormOpen(true)
              }}
            >
              <Plus className="size-4" data-icon="inline-start" />
              Nueva factura
            </Button>
          </RequireWrite>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Receipt className="size-4" />
            Total facturado
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalFacturado)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Euro className="size-4 text-green-600" />
            Cobrado
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(cobrado)}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Clock className="size-4 text-amber-600" />
            Pendiente de cobro
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {formatCurrency(pendienteCobro)}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <AlertTriangle className="size-4 text-red-600" />
            Vencido
          </div>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(vencido)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por alumno o nº factura..."
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
            {ESTADOS_FACTURA.map((e) => (
              <SelectItem key={e} value={e}>
                {ESTADO_FACTURA_LABELS[e]}
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
                <TableHead>Nº Factura</TableHead>
                <TableHead>Alumno</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Método pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((factura) => (
                <TableRow
                  key={factura.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setDetailFactura(factura)
                    setSheetOpen(true)
                  }}
                >
                  <TableCell className="font-mono text-xs font-medium">
                    {factura.numero}
                  </TableCell>
                  <TableCell className="font-medium">
                    {factura.alumno_nombre}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(factura.fecha_emision)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(factura.total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${ESTADO_FACTURA_COLORS[factura.estado]}`}
                    >
                      {ESTADO_FACTURA_LABELS[factura.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {factura.metodo_pago
                      ? METODO_PAGO_LABELS[factura.metodo_pago]
                      : "—"}
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
          <h3 className="text-lg font-semibold">No se encontraron facturas</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {hasActiveFilters
              ? "Prueba a cambiar los filtros de búsqueda o limpiar los filtros."
              : "Aún no hay facturas registradas. Haz clic en \"Nueva factura\" para empezar."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Dialogs & Sheet */}
      <FacturaFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingFactura(null)
        }}
        factura={editingFactura}
        onSave={handleSave}
        nextNumero={nextNumero}
      />
      <FacturaDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        factura={detailFactura}
        pagos={pagos}
        onEdit={handleEdit}
        onMarkPaid={handleMarkPaid}
        onAnular={handleAnular}
        onAddPago={handleAddPago}
      />
    </div>
  )
}
