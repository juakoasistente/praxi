"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Clock,
  Users,
  Settings,
  Calendar,
  AlertTriangle,
  Shield,
  Download,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useUserRole } from "@/hooks/use-user-role"
import { useSede } from "@/hooks/use-sede"

// Import new components
import { RelojFichar } from "@/components/fichajes/reloj-fichar"
import { TimelineDia } from "@/components/fichajes/timeline-dia"
import { ResumenSemana } from "@/components/fichajes/resumen-semana"
import { IncidenciaFormDialog } from "@/components/fichajes/incidencia-form-dialog"
import { AdminFichajesTable } from "@/components/fichajes/admin-fichajes-table"
import { RequireWrite } from "@/components/auth/require-write"
import { exportToCSV, exportFormatDate } from "@/lib/export"

// Import types
import {
  RegistroFichaje,
  Incidencia,
  TipoRegistro,
  TipoPausa,
  EstadoEmpleado,
  TipoIncidencia
} from "@/components/fichajes/types"

// Mock data for demonstration
const MOCK_EMPLEADOS = [
  { id: "1", nombre: "Miguel Santos Rivas" },
  { id: "2", nombre: "Ana García López" },
  { id: "3", nombre: "Carlos Ruiz Martín" },
  { id: "4", nombre: "Elena Fernández Torres" },
  { id: "5", nombre: "David Pérez Gómez" },
  { id: "6", nombre: "Sara Moreno Silva" },
  { id: "7", nombre: "Javier López Díaz" },
  { id: "8", nombre: "Carmen Rodríguez Vega" }
]

// Generate realistic demo data
function generateMockData() {
  const registros: RegistroFichaje[] = []
  const incidencias: Incidencia[] = []
  const today = new Date().toISOString().split('T')[0]

  // Generate realistic work patterns for each employee
  MOCK_EMPLEADOS.forEach((empleado, index) => {
    // Some employees work different patterns
    const isPartTime = index === 5 || index === 6
    const isLateStarter = index === 3

    // Generate registros for today
    if (Math.random() > 0.1) { // 90% chance employee worked today
      let currentTime = new Date(today + "T" + (isLateStarter ? "09:30:00" : "08:45:00"))

      // Morning entrance
      registros.push({
        id: `reg_${empleado.id}_1`,
        usuario_id: empleado.id,
        usuario_nombre: empleado.nombre,
        tipo: "entrada",
        timestamp: currentTime.toISOString(),
        sede_id: "1",
        metodo: Math.random() > 0.5 ? "app" : "manual",
        tipo_pausa: null,
        notas: null
      })

      // Coffee break
      if (!isPartTime) {
        currentTime = new Date(currentTime.getTime() + (2.5 * 60 * 60 * 1000)) // +2.5 hours
        registros.push({
          id: `reg_${empleado.id}_2`,
          usuario_id: empleado.id,
          usuario_nombre: empleado.nombre,
          tipo: "pausa_inicio",
          timestamp: currentTime.toISOString(),
          sede_id: "1",
          metodo: "app",
          tipo_pausa: "cafe",
          notas: null
        })

        // End coffee break
        currentTime = new Date(currentTime.getTime() + (15 * 60 * 1000)) // +15 minutes
        registros.push({
          id: `reg_${empleado.id}_3`,
          usuario_id: empleado.id,
          usuario_nombre: empleado.nombre,
          tipo: "pausa_fin",
          timestamp: currentTime.toISOString(),
          sede_id: "1",
          metodo: "app",
          tipo_pausa: null,
          notas: null
        })
      }

      // Lunch break
      currentTime = new Date(today + "T14:00:00")
      registros.push({
        id: `reg_${empleado.id}_4`,
        usuario_id: empleado.id,
        usuario_nombre: empleado.nombre,
        tipo: "pausa_inicio",
        timestamp: currentTime.toISOString(),
        sede_id: "1",
        metodo: "app",
        tipo_pausa: "comida",
        notas: null
      })

      // End lunch break
      currentTime = new Date(currentTime.getTime() + (60 * 60 * 1000)) // +1 hour
      registros.push({
        id: `reg_${empleado.id}_5`,
        usuario_id: empleado.id,
        usuario_nombre: empleado.nombre,
        tipo: "pausa_fin",
        timestamp: currentTime.toISOString(),
        sede_id: "1",
        metodo: "app",
        tipo_pausa: null,
        notas: null
      })

      // End of day (only if still working)
      if (index < 4) { // First 4 employees have already left
        const endTime = isPartTime ? "16:00:00" : "17:30:00"
        currentTime = new Date(today + "T" + endTime)
        registros.push({
          id: `reg_${empleado.id}_6`,
          usuario_id: empleado.id,
          usuario_nombre: empleado.nombre,
          tipo: "salida",
          timestamp: currentTime.toISOString(),
          sede_id: "1",
          metodo: "app",
          tipo_pausa: null,
          notas: null
        })
      }
    }

    // Generate some incidencias
    if (Math.random() > 0.8) { // 20% chance of having an incidencia
      const tipos: TipoIncidencia[] = ["llegada_tarde", "ausencia_justificada", "teletrabajo"]
      const tipoRandom = tipos[Math.floor(Math.random() * tipos.length)]

      incidencias.push({
        id: `inc_${empleado.id}`,
        usuario_id: empleado.id,
        usuario_nombre: empleado.nombre,
        fecha: today,
        tipo: tipoRandom,
        descripcion: tipoRandom === "llegada_tarde" ? "Retraso por tráfico" :
                    tipoRandom === "ausencia_justificada" ? "Cita médica programada" :
                    "Trabajo remoto autorizado por supervisor",
        aprobada: Math.random() > 0.5 ? true : null
      })
    }
  })

  return { registros, incidencias }
}

export default function FichajesPage() {
  const userRole = useUserRole()
  const { selectedSede } = useSede()
  const [activeTab, setActiveTab] = useState<"empleado" | "admin">("empleado")

  // Mock state management
  const [mockData, setMockData] = useState(() => generateMockData())
  const [currentUserId] = useState("1") // Miguel Santos Rivas for demo
  const fechaHoy = new Date().toISOString().split('T')[0]

  // Calculate current employee state
  const estadoEmpleadoActual = useMemo((): {
    estado: EstadoEmpleado
    horaEntrada?: string
    horaPausa?: string
    tipoPausa?: TipoPausa
  } => {
    const registrosHoy = mockData.registros
      .filter(r => r.usuario_id === currentUserId && r.timestamp.startsWith(fechaHoy))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    let estado: EstadoEmpleado = "fuera"
    let horaEntrada: string | undefined
    let horaPausa: string | undefined
    let tipoPausa: TipoPausa | undefined

    for (const registro of registrosHoy) {
      const hora = new Date(registro.timestamp).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
      })

      if (registro.tipo === "entrada") {
        if (!horaEntrada) horaEntrada = hora
        estado = "trabajando"
        horaPausa = undefined
        tipoPausa = undefined
      } else if (registro.tipo === "salida") {
        estado = "fuera"
        horaEntrada = undefined
        horaPausa = undefined
        tipoPausa = undefined
      } else if (registro.tipo === "pausa_inicio") {
        estado = "en_pausa"
        horaPausa = hora
        tipoPausa = registro.tipo_pausa || "otro"
      } else if (registro.tipo === "pausa_fin") {
        estado = "trabajando"
        horaPausa = undefined
        tipoPausa = undefined
      }
    }

    return { estado, horaEntrada, horaPausa, tipoPausa }
  }, [mockData.registros, currentUserId, fechaHoy])

  const handleFichar = (tipo: TipoRegistro, tipoPausa?: TipoPausa) => {
    const nuevoRegistro: RegistroFichaje = {
      id: `reg_${Date.now()}`,
      usuario_id: currentUserId,
      usuario_nombre: "Miguel Santos Rivas",
      tipo,
      timestamp: new Date().toISOString(),
      sede_id: selectedSede || "1",
      metodo: "app",
      tipo_pausa: tipoPausa || null,
      notas: null
    }

    setMockData(prev => ({
      ...prev,
      registros: [nuevoRegistro, ...prev.registros]
    }))

    const accionTexto = tipo === "entrada" ? "entrada" :
                      tipo === "salida" ? "salida" :
                      tipo === "pausa_inicio" ? `inicio de pausa (${tipoPausa})` :
                      "fin de pausa"

    toast.success(`Fichaje de ${accionTexto} registrado`)
  }

  const handleIncidencia = (incidencia: Omit<Incidencia, "id" | "aprobada">) => {
    const nuevaIncidencia: Incidencia = {
      ...incidencia,
      id: `inc_${Date.now()}`,
      aprobada: null
    }

    setMockData(prev => ({
      ...prev,
      incidencias: [nuevaIncidencia, ...prev.incidencias]
    }))
  }

  const handleExportCSV = () => {
    const fechaActual = new Date().toISOString().split('T')[0]
    const registrosFecha = mockData.registros.filter(r => r.timestamp.startsWith(fechaActual))

    exportToCSV(
      registrosFecha.map((r) => ({
        empleado: r.usuario_nombre,
        fecha: exportFormatDate(r.timestamp),
        hora: new Date(r.timestamp).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        tipo: r.tipo === "entrada" ? "Entrada" :
              r.tipo === "salida" ? "Salida" :
              r.tipo === "pausa_inicio" ? "Inicio pausa" :
              "Fin pausa",
        tipo_pausa: r.tipo_pausa || "",
        metodo: r.metodo === "app" ? "App" : "Manual",
        sede: "Central",
        notas: r.notas || ""
      })),
      [
        { key: "empleado", label: "Empleado" },
        { key: "fecha", label: "Fecha" },
        { key: "hora", label: "Hora" },
        { key: "tipo", label: "Tipo" },
        { key: "tipo_pausa", label: "Tipo Pausa" },
        { key: "metodo", label: "Método" },
        { key: "sede", label: "Sede" },
        { key: "notas", label: "Notas" }
      ],
      "fichajes_inspeccion_laboral"
    )

    toast.success("Fichajes exportados para inspección laboral")
  }

  const handleVerDetalle = (empleadoId: string, empleadoNombre: string) => {
    toast.info(`Ver detalle de ${empleadoNombre}`)
    // En una implementación real, esto abriría un modal o navegaría a una página de detalle
  }

  // Check if user should see admin view
  const showAdminTab = userRole === "admin" || userRole === "secretario"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Fichajes</h1>
            <p className="text-muted-foreground">
              Sistema de control horario - Real Decreto-ley 8/2019
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RequireWrite entity="fichajes">
            <IncidenciaFormDialog
              empleados={MOCK_EMPLEADOS}
              onIncidencia={handleIncidencia}
            >
              <Button variant="outline" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Nueva incidencia
              </Button>
            </IncidenciaFormDialog>
          </RequireWrite>
          <Button onClick={handleExportCSV} size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Legal compliance notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 py-4">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Cumplimiento legal:</strong> Este sistema registra la jornada laboral
              según el Real Decreto-ley 8/2019. Los datos se conservan 4 años para
              inspecciones de trabajo (art. 34.9 ET). Multas por incumplimiento:
              751€-7.500€ (falta de sistema), hasta 225.018€ (fraude).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Employee and Admin views */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "empleado" | "admin")}>
        <TabsList className="grid w-full max-w-[400px]" style={{ gridTemplateColumns: showAdminTab ? "1fr 1fr" : "1fr" }}>
          <TabsTrigger value="empleado" className="gap-2">
            <Clock className="h-4 w-4" />
            Vista Empleado
          </TabsTrigger>
          {showAdminTab && (
            <TabsTrigger value="admin" className="gap-2">
              <Users className="h-4 w-4" />
              Vista Admin
            </TabsTrigger>
          )}
        </TabsList>

        {/* Employee View */}
        <TabsContent value="empleado" className="space-y-6">
          {/* Main Clock and Actions */}
          <RelojFichar
            estadoActual={estadoEmpleadoActual.estado}
            horaEntrada={estadoEmpleadoActual.horaEntrada}
            horaPausa={estadoEmpleadoActual.horaPausa}
            tipoPausa={estadoEmpleadoActual.tipoPausa}
            onFichar={handleFichar}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Timeline */}
            <TimelineDia
              registros={mockData.registros}
              fecha={fechaHoy}
              empleadoNombre="Miguel Santos Rivas"
            />

            {/* Week Summary */}
            <ResumenSemana
              registros={mockData.registros}
              fechaActual={new Date()}
              empleadoId={currentUserId}
            />
          </div>
        </TabsContent>

        {/* Admin View */}
        {showAdminTab && (
          <TabsContent value="admin" className="space-y-6">
            <AdminFichajesTable
              empleados={MOCK_EMPLEADOS}
              registros={mockData.registros}
              incidencias={mockData.incidencias}
              fecha={fechaHoy}
              onExportCSV={handleExportCSV}
              onVerDetalle={handleVerDetalle}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Debug info for development */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-800">Debug Info (solo desarrollo)</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-yellow-700">
            <p>Usuario actual: Miguel Santos Rivas (ID: {currentUserId})</p>
            <p>Estado: {estadoEmpleadoActual.estado}</p>
            <p>Registros hoy: {mockData.registros.filter(r => r.usuario_id === currentUserId && r.timestamp.startsWith(fechaHoy)).length}</p>
            <p>Incidencias hoy: {mockData.incidencias.filter(i => i.usuario_id === currentUserId && i.fecha === fechaHoy).length}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
