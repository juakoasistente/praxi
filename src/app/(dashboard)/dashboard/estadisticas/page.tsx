"use client"

import * as React from "react"
import { BarChart3, Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { exportToCSV, exportFormatCurrency } from "@/lib/export"
import { Examen } from "@/components/examenes/types"
import { Vehiculo, CosteVehiculo } from "@/components/vehiculos/types"
import { Factura } from "@/components/facturacion/types"

// --- Derived data ---

const PROFESORES = ["Carlos Ruiz", "Laura Martín", "Miguel Ángel Torres", "Ana Belén Díaz"]

const TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid hsl(var(--border))",
  backgroundColor: "hsl(var(--background))",
  fontSize: "13px",
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
}

// Assign professors to exams deterministically
function getProfesor(examId: string) {
  const idx = parseInt(examId, 10) % PROFESORES.length
  return PROFESORES[idx]
}

export default function EstadisticasPage() {
  // --- Tasa de aprobados ---
  const examenes: Examen[] = []
  const aprobados = examenes.filter((e) => e.resultado === "aprobado").length
  const suspendidos = examenes.filter((e) => e.resultado === "suspendido").length
  const pendientes = examenes.filter((e) => e.resultado === "pendiente").length
  const noPresentados = examenes.filter((e) => e.resultado === "no_presentado").length
  const totalConResultado = aprobados + suspendidos + noPresentados
  const pctAprobados = totalConResultado > 0 ? Math.round((aprobados / totalConResultado) * 100) : 0

  const donutData = [
    { name: "Aprobados", value: aprobados, color: "#16a34a" },
    { name: "Suspendidos", value: suspendidos, color: "#dc2626" },
    { name: "Pendientes", value: pendientes, color: "#2563eb" },
    { name: "No presentados", value: noPresentados, color: "#9ca3af" },
  ].filter((d) => d.value > 0)

  // Breakdown by tipo
  const teoricoExams = examenes.filter((e) => e.tipo === "teorico")
  const practicoExams = examenes.filter((e) => e.tipo === "practico")
  const teoricoAprobados = teoricoExams.filter((e) => e.resultado === "aprobado").length
  const teoricoTotal = teoricoExams.filter((e) => e.resultado !== "pendiente").length
  const practicoAprobados = practicoExams.filter((e) => e.resultado === "aprobado").length
  const practicoTotal = practicoExams.filter((e) => e.resultado !== "pendiente").length

  // --- Aprobados por profesor ---
  const profesorStats = React.useMemo(() => {
    const stats: Record<string, { total: number; aprobados: number }> = {}
    examenes.forEach((e) => {
      if (e.resultado === "pendiente") return
      const prof = getProfesor(e.id)
      if (!stats[prof]) stats[prof] = { total: 0, aprobados: 0 }
      stats[prof].total++
      if (e.resultado === "aprobado") stats[prof].aprobados++
    })
    return PROFESORES.map((p) => ({
      profesor: p.split(" ").slice(0, 2).join(" "),
      tasa: stats[p] ? Math.round((stats[p].aprobados / stats[p].total) * 100) : 0,
    }))
  }, [])

  // --- Actividad mensual (last 6 months) ---
  const MONTH_NAMES_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

  const actividadMensual = React.useMemo(() => {
    const now = new Date(2026, 2, 20) // March 2026
    const months: { mes: string; teorico: number; practico: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const y = d.getFullYear()
      const m = d.getMonth()
      const label = `${MONTH_NAMES_SHORT[m]} ${y.toString().slice(2)}`
      const teorico = examenes.filter((e) => {
        const ed = new Date(e.fecha)
        return ed.getFullYear() === y && ed.getMonth() === m && e.tipo === "teorico"
      }).length
      const practico = examenes.filter((e) => {
        const ed = new Date(e.fecha)
        return ed.getFullYear() === y && ed.getMonth() === m && e.tipo === "practico"
      }).length
      months.push({ mes: label, teorico, practico })
    }
    return months
  }, [])

  // --- Vehículos: coste por km ---
  const costePorKm = React.useMemo(() => {
    const vehiculos: Vehiculo[] = []
    const costes: CosteVehiculo[] = []
    return vehiculos
      .filter((v) => v.km_actuales > 0 && v.estado !== "baja")
      .map((v) => {
        const costesVehiculo = costes.filter((c) => c.vehiculo_id === v.id)
          .reduce((sum, c) => sum + c.importe, 0)
        const total = v.precio_adquisicion + costesVehiculo
        return {
          vehiculo: `${v.marca} ${v.modelo}`,
          costePorKm: parseFloat((total / v.km_actuales).toFixed(2)),
        }
      })
      .sort((a, b) => b.costePorKm - a.costePorKm)
  }, [])

  // --- Resumen financiero (last 6 months) ---
  const resumenFinanciero = React.useMemo(() => {
    const facturas: Factura[] = []
    const now = new Date(2026, 2, 20)
    const months: { mes: string; facturado: number; cobrado: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const y = d.getFullYear()
      const m = d.getMonth()
      const label = `${MONTH_NAMES_SHORT[m]} ${y.toString().slice(2)}`
      const facturado = facturas
        .filter((f) => {
          if (f.estado === "anulada") return false
          const fd = new Date(f.fecha_emision)
          return fd.getFullYear() === y && fd.getMonth() === m
        })
        .reduce((sum, f) => sum + f.total, 0)
      const cobrado = facturas
        .filter((f) => {
          if (!f.fecha_pago) return false
          const pd = new Date(f.fecha_pago)
          return pd.getFullYear() === y && pd.getMonth() === m
        })
        .reduce((sum, f) => sum + f.total, 0)
      months.push({ mes: label, facturado, cobrado })
    }
    return months
  }, [])

  const facturas: Factura[] = []
  const totalFacturado = facturas
    .filter((f) => f.estado !== "anulada")
    .reduce((sum, f) => sum + f.total, 0)
  const totalCobrado = facturas
    .filter((f) => f.estado === "pagada")
    .reduce((sum, f) => sum + f.total, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
          <BarChart3 className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Estadísticas</h1>
          <p className="text-sm text-muted-foreground">
            Rendimiento y métricas de la autoescuela
          </p>
        </div>
      </div>

      {/* Tasa de aprobados - Main metric + donut */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Tasa de aprobados</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exportToCSV(donutData, [
                  { key: "name", label: "Resultado" },
                  { key: "value", label: "Cantidad" },
                ], "estadisticas-aprobados")
              }
            >
              <Download className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-green-600">{pctAprobados}%</p>
              <p className="text-sm text-muted-foreground mt-1">de aprobados</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Desglose por tipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Teórico</span>
                  <span className="font-medium">
                    {teoricoAprobados}/{teoricoTotal} aprobados
                    ({teoricoTotal > 0 ? Math.round((teoricoAprobados / teoricoTotal) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${teoricoTotal > 0 ? (teoricoAprobados / teoricoTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Práctico</span>
                  <span className="font-medium">
                    {practicoAprobados}/{practicoTotal} aprobados
                    ({practicoTotal > 0 ? Math.round((practicoAprobados / practicoTotal) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${practicoTotal > 0 ? (practicoAprobados / practicoTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{aprobados}</p>
                <p className="text-xs text-muted-foreground">Aprobados</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{suspendidos}</p>
                <p className="text-xs text-muted-foreground">Suspendidos</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{pendientes}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-gray-500">{noPresentados}</p>
                <p className="text-xs text-muted-foreground">No presentados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aprobados por profesor + Actividad mensual */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Aprobados por profesor</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exportToCSV(profesorStats, [
                  { key: "profesor", label: "Profesor" },
                  { key: "tasa", label: "Tasa aprobados (%)" },
                ], "estadisticas-profesores")
              }
            >
              <Download className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profesorStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="profesor"
                    width={100}
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value) => [`${value}%`, "Tasa de aprobados"]}
                  />
                  <Bar
                    dataKey="tasa"
                    fill="#16a34a"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Actividad mensual de exámenes</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exportToCSV(actividadMensual, [
                  { key: "mes", label: "Mes" },
                  { key: "teorico", label: "Teórico" },
                  { key: "practico", label: "Práctico" },
                ], "estadisticas-actividad-mensual")
              }
            >
              <Download className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={actividadMensual}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-sm text-foreground">
                        {value === "teorico" ? "Teórico" : "Práctico"}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="teorico"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="teorico"
                  />
                  <Line
                    type="monotone"
                    dataKey="practico"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="practico"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehículos coste/km + Resumen financiero */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Coste por km por vehículo</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exportToCSV(costePorKm, [
                  { key: "vehiculo", label: "Vehículo" },
                  { key: "costePorKm", label: "Coste por km (€)", format: (v) => `${Number(v).toFixed(2)} €` },
                ], "estadisticas-coste-km")
              }
            >
              <Download className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costePorKm}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="vehiculo"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `${v}€`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value) => [`${value} €/km`, "Coste"]}
                  />
                  <Bar
                    dataKey="costePorKm"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Resumen financiero</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exportToCSV(resumenFinanciero, [
                  { key: "mes", label: "Mes" },
                  { key: "facturado", label: "Facturado", format: (v) => exportFormatCurrency(Number(v)) },
                  { key: "cobrado", label: "Cobrado", format: (v) => exportFormatCurrency(Number(v)) },
                ], "estadisticas-financiero")
              }
            >
              <Download className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 rounded-lg border p-3 text-center">
                <p className="text-lg font-bold">{formatCurrency(totalFacturado)}</p>
                <p className="text-xs text-muted-foreground">Total facturado</p>
              </div>
              <div className="flex-1 rounded-lg border p-3 text-center">
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(totalCobrado)}
                </p>
                <p className="text-xs text-muted-foreground">Total cobrado</p>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumenFinanciero}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `${v}€`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      name === "facturado" ? "Facturado" : "Cobrado",
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-sm text-foreground">
                        {value === "facturado" ? "Facturado" : "Cobrado"}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="facturado"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="cobrado"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
