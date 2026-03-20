"use client"

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
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// --- Datos mock para los gráficos ---

const CLASES_SEMANA = [
  { dia: "Lun", clases: 8 },
  { dia: "Mar", clases: 12 },
  { dia: "Mié", clases: 10 },
  { dia: "Jue", clases: 14 },
  { dia: "Vie", clases: 11 },
  { dia: "Sáb", clases: 6 },
  { dia: "Dom", clases: 0 },
]

const PROXIMAS_CLASES = [
  {
    id: "1",
    alumno: "María García López",
    profesor: "Carlos Ruiz",
    fecha: "21/03/2026",
    hora: "09:00 - 10:00",
    vehiculo: "Seat León (1234 ABC)",
  },
  {
    id: "2",
    alumno: "Pedro Sánchez Muñoz",
    profesor: "Laura Martín",
    fecha: "21/03/2026",
    hora: "10:00 - 11:00",
    vehiculo: "Citroën C3 (5678 DEF)",
  },
  {
    id: "3",
    alumno: "Ana Torres Vega",
    profesor: "Carlos Ruiz",
    fecha: "21/03/2026",
    hora: "11:00 - 12:00",
    vehiculo: "Renault Clio (9012 GHI)",
  },
  {
    id: "4",
    alumno: "Luis Fernández Díaz",
    profesor: "Laura Martín",
    fecha: "22/03/2026",
    hora: "09:00 - 10:00",
    vehiculo: "Seat León (1234 ABC)",
  },
  {
    id: "5",
    alumno: "Carmen López Ruiz",
    profesor: "Carlos Ruiz",
    fecha: "22/03/2026",
    hora: "10:00 - 11:00",
    vehiculo: "Citroën C3 (5678 DEF)",
  },
]

const RESULTADOS_EXAMENES = [
  { name: "Aprobados", value: 18, color: "#16a34a" },
  { name: "Suspendidos", value: 7, color: "#dc2626" },
  { name: "Pendientes", value: 4, color: "#2563eb" },
]

const FACTURAS_PENDIENTES = [
  {
    id: "1",
    numero: "FAC-2026-008",
    alumno: "Pedro Sánchez Muñoz",
    importe: 450,
    vencimiento: "2026-03-05",
    diasVencida: 15,
  },
  {
    id: "2",
    numero: "FAC-2026-010",
    alumno: "Luis Fernández Díaz",
    importe: 700,
    vencimiento: "2026-03-10",
    diasVencida: 10,
  },
  {
    id: "3",
    numero: "FAC-2026-011",
    alumno: "Carmen López Ruiz",
    importe: 250,
    vencimiento: "2026-03-18",
    diasVencida: 2,
  },
  {
    id: "4",
    numero: "FAC-2026-012",
    alumno: "Ana Torres Vega",
    importe: 350,
    vencimiento: "2026-03-25",
    diasVencida: 0,
  },
]

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

export function DashboardCharts() {
  return (
    <div className="space-y-6">
      {/* Gráficos en 2 columnas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Actividad de la semana */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actividad de la semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLASES_SEMANA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="dia"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [`${value} clases`, "Clases"]}
                  />
                  <Bar
                    dataKey="clases"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resultados de exámenes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Resultados de exámenes (último mes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RESULTADOS_EXAMENES}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {RESULTADOS_EXAMENES.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                      fontSize: "13px",
                    }}
                  />
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
      </div>

      {/* Listas en 2 columnas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Próximas clases */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximas clases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PROXIMAS_CLASES.map((clase) => (
              <div
                key={clase.id}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{clase.alumno}</p>
                  <p className="text-xs text-muted-foreground">
                    {clase.profesor} · {clase.vehiculo}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{clase.fecha}</p>
                  <p className="text-xs text-muted-foreground">{clase.hora}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Facturas pendientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facturas pendientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {FACTURAS_PENDIENTES.map((factura) => (
              <div
                key={factura.id}
                className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${
                  factura.diasVencida > 0
                    ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
                    : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-medium">
                      {factura.numero}
                    </p>
                    {factura.diasVencida > 0 && (
                      <Badge className="border-0 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px]">
                        Vencida
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {factura.alumno}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">
                    {formatCurrency(factura.importe)}
                  </p>
                  {factura.diasVencida > 0 ? (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {factura.diasVencida} días vencida
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Vence {new Date(factura.vencimiento).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
