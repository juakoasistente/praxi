"use client"

import * as React from "react"
import { Zap, Plus, Search, Send, Eye, MessageSquare, Clock, Settings2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MOCK_PLANTILLAS, MOCK_CONFIG, MOCK_HISTORIAL } from "@/components/whatsapp/mock-data"
import type { PlantillaWhatsApp, ConfigWhatsApp, HistorialEnvio, TipoPlantilla, EstadoPlantilla } from "@/components/whatsapp/types"
import {
  TIPO_LABELS,
  TIPO_COLORS,
  ESTADO_PLANTILLA_LABELS,
  ESTADO_PLANTILLA_COLORS,
} from "@/components/whatsapp/types"

const SAMPLE_DATA: Record<string, string> = {
  alumno_nombre: "María García",
  fecha_clase: "21/03/2026",
  hora_clase: "10:00",
  profesor_nombre: "Carlos Ruiz",
  tipo_examen: "teórico",
  resultado: "APTO",
  mensaje_extra: "¡Enhorabuena!",
  numero_factura: "F-2026-042",
  importe: "350",
  autoescuela_nombre: "Autoescuela Praxi",
  permiso: "B",
}

function renderPreview(contenido: string): string {
  return contenido.replace(/\{\{(\w+)\}\}/g, (_, key) => SAMPLE_DATA[key] ?? `{{${key}}}`)
}

const VARIABLES_DISPONIBLES: Record<TipoPlantilla, string[]> = {
  recordatorio_clase: ["alumno_nombre", "fecha_clase", "hora_clase", "profesor_nombre"],
  resultado_examen: ["alumno_nombre", "tipo_examen", "resultado", "mensaje_extra"],
  aviso_pago: ["alumno_nombre", "numero_factura", "importe"],
  bienvenida: ["autoescuela_nombre", "alumno_nombre", "permiso"],
  personalizado: ["alumno_nombre"],
}

export default function AutomatizacionesPage() {
  const [plantillas, setPlantillas] = React.useState<PlantillaWhatsApp[]>(MOCK_PLANTILLAS)
  const [config, setConfig] = React.useState<ConfigWhatsApp>(MOCK_CONFIG)
  const [historial] = React.useState<HistorialEnvio[]>(MOCK_HISTORIAL)

  // Editor state
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editingPlantilla, setEditingPlantilla] = React.useState<PlantillaWhatsApp | null>(null)
  const [editorNombre, setEditorNombre] = React.useState("")
  const [editorTipo, setEditorTipo] = React.useState<TipoPlantilla>("recordatorio_clase")
  const [editorContenido, setEditorContenido] = React.useState("")
  const [editorEstado, setEditorEstado] = React.useState<EstadoPlantilla>("borrador")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  function openEditor(plantilla?: PlantillaWhatsApp) {
    if (plantilla) {
      setEditingPlantilla(plantilla)
      setEditorNombre(plantilla.nombre)
      setEditorTipo(plantilla.tipo)
      setEditorContenido(plantilla.contenido)
      setEditorEstado(plantilla.estado)
    } else {
      setEditingPlantilla(null)
      setEditorNombre("")
      setEditorTipo("personalizado")
      setEditorContenido("")
      setEditorEstado("borrador")
    }
    setEditorOpen(true)
  }

  function handleSavePlantilla() {
    if (!editorNombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }
    const variables = Array.from(editorContenido.matchAll(/\{\{(\w+)\}\}/g)).map((m) => m[1])

    if (editingPlantilla) {
      setPlantillas((prev) =>
        prev.map((p) =>
          p.id === editingPlantilla.id
            ? { ...p, nombre: editorNombre, tipo: editorTipo, contenido: editorContenido, estado: editorEstado, variables }
            : p
        )
      )
      toast.success("Plantilla actualizada")
    } else {
      const newPlantilla: PlantillaWhatsApp = {
        id: `wp${Date.now()}`,
        nombre: editorNombre,
        tipo: editorTipo,
        contenido: editorContenido,
        variables,
        estado: editorEstado,
        envios_totales: 0,
        ultimo_envio: null,
      }
      setPlantillas((prev) => [newPlantilla, ...prev])
      toast.success("Plantilla creada")
    }
    setEditorOpen(false)
  }

  function insertVariable(variable: string) {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const tag = `{{${variable}}}`
    const newContent = editorContenido.slice(0, start) + tag + editorContenido.slice(end)
    setEditorContenido(newContent)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + tag.length
    })
  }

  function toggleEstado(id: string) {
    setPlantillas((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next: EstadoPlantilla = p.estado === "activa" ? "inactiva" : "activa"
        return { ...p, estado: next }
      })
    )
  }

  function handleSaveConfig() {
    toast.success("Configuración guardada")
  }

  const currentVariables = VARIABLES_DISPONIBLES[editorTipo]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Automatizaciones</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona plantillas y automatizaciones de WhatsApp
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="plantillas">
        <TabsList>
          <TabsTrigger value="plantillas">
            <MessageSquare className="size-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="configuracion">
            <Settings2 className="size-4" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="historial">
            <Clock className="size-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        {/* Tab: Plantillas */}
        <TabsContent value="plantillas">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openEditor()}>
                <Plus className="size-4" data-icon="inline-start" />
                Nueva plantilla
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plantillas.map((plantilla) => (
                <div
                  key={plantilla.id}
                  className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  onClick={() => openEditor(plantilla)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-snug">{plantilla.nombre}</h3>
                    <Badge className={`shrink-0 border-0 ${ESTADO_PLANTILLA_COLORS[plantilla.estado]}`}>
                      {ESTADO_PLANTILLA_LABELS[plantilla.estado]}
                    </Badge>
                  </div>

                  <div className="mt-2">
                    <Badge className={`border-0 text-xs ${TIPO_COLORS[plantilla.tipo]}`}>
                      {TIPO_LABELS[plantilla.tipo]}
                    </Badge>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                    {plantilla.contenido || "Sin contenido"}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Send className="size-3" />
                      {plantilla.envios_totales} envíos
                    </span>
                    {plantilla.ultimo_envio && (
                      <span>Último: {new Date(plantilla.ultimo_envio).toLocaleDateString("es-ES")}</span>
                    )}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleEstado(plantilla.id)
                      }}
                    >
                      {plantilla.estado === "activa" ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Configuración */}
        <TabsContent value="configuracion">
          <div className="max-w-xl space-y-6">
            {/* Toggle principal */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Automatizaciones WhatsApp activas</p>
                <p className="text-sm text-muted-foreground">
                  Activa o desactiva todos los envíos automáticos
                </p>
              </div>
              <Button
                variant={config.activo ? "default" : "outline"}
                size="sm"
                onClick={() => setConfig((c) => ({ ...c, activo: !c.activo }))}
              >
                {config.activo ? "Activado" : "Desactivado"}
              </Button>
            </div>

            {/* Conexión */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">Conexión WhatsApp Business</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Teléfono del negocio</Label>
                  <Input
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={config.telefono_negocio ?? ""}
                    onChange={(e) => setConfig((c) => ({ ...c, telefono_negocio: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>API Key WhatsApp Business</Label>
                  <Input
                    type="password"
                    placeholder="••••••••••••••••"
                    value={config.api_key ?? ""}
                    onChange={(e) => setConfig((c) => ({ ...c, api_key: e.target.value || null }))}
                  />
                </div>
              </div>
            </div>

            {/* Tiempos */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">Tiempos de envío</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Recordatorio de clase</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      value={config.recordatorio_clase_horas}
                      onChange={(e) => setConfig((c) => ({ ...c, recordatorio_clase_horas: Number(e.target.value) }))}
                    />
                    <span className="text-sm text-muted-foreground">horas antes</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Recordatorio de examen</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      value={config.recordatorio_examen_dias}
                      onChange={(e) => setConfig((c) => ({ ...c, recordatorio_examen_dias: Number(e.target.value) }))}
                    />
                    <span className="text-sm text-muted-foreground">días antes</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Aviso de pago</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      value={config.aviso_pago_dias}
                      onChange={(e) => setConfig((c) => ({ ...c, aviso_pago_dias: Number(e.target.value) }))}
                    />
                    <span className="text-sm text-muted-foreground">días después del vencimiento</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bienvenida */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Enviar mensaje de bienvenida al matricular</p>
                <p className="text-sm text-muted-foreground">
                  Envía automáticamente la plantilla de bienvenida
                </p>
              </div>
              <Button
                variant={config.enviar_bienvenida ? "default" : "outline"}
                size="sm"
                onClick={() => setConfig((c) => ({ ...c, enviar_bienvenida: !c.enviar_bienvenida }))}
              >
                {config.enviar_bienvenida ? "Activado" : "Desactivado"}
              </Button>
            </div>

            <Button onClick={handleSaveConfig}>
              Guardar configuración
            </Button>

            <p className="text-xs text-muted-foreground">
              Para conectar WhatsApp Business necesitas una cuenta verificada en Meta Business.
            </p>
          </div>
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="historial">
          {historial.length > 0 ? (
            <div className="rounded-lg border overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Plantilla</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historial.map((envio) => (
                    <TableRow key={envio.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(envio.fecha).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="font-medium">{envio.alumno_nombre}</TableCell>
                      <TableCell>{envio.plantilla_nombre}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{envio.estado}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Clock className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Sin historial de envíos</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                El historial aparecerá cuando se conecte WhatsApp Business
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Template editor dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlantilla ? "Editar plantilla" : "Nueva plantilla"}
            </DialogTitle>
            <DialogDescription>
              Configura el contenido y las variables de la plantilla de WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input
                  value={editorNombre}
                  onChange={(e) => setEditorNombre(e.target.value)}
                  placeholder="Nombre de la plantilla"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={editorTipo} onValueChange={(v) => setEditorTipo(v as TipoPlantilla)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TIPO_LABELS) as TipoPlantilla[]).map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>{TIPO_LABELS[tipo]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Contenido del mensaje</Label>
              <Textarea
                ref={textareaRef}
                value={editorContenido}
                onChange={(e) => setEditorContenido(e.target.value)}
                placeholder="Escribe el mensaje aquí. Usa {{variable}} para insertar datos dinámicos."
                rows={5}
              />
            </div>

            {/* Variable chips */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Variables disponibles (clic para insertar)</Label>
              <div className="flex flex-wrap gap-1.5">
                {currentVariables.map((variable) => (
                  <button
                    key={variable}
                    type="button"
                    className="rounded-md bg-muted px-2 py-1 text-xs font-mono hover:bg-muted/80 transition-colors"
                    onClick={() => insertVariable(variable)}
                  >
                    {`{{${variable}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {editorContenido && (
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="size-3" />
                  Vista previa
                </Label>
                <div className="rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-3 text-sm">
                  {renderPreview(editorContenido)}
                </div>
              </div>
            )}

            {/* Estado */}
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={editorEstado} onValueChange={(v) => setEditorEstado(v as EstadoPlantilla)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlantilla}>
              {editingPlantilla ? "Guardar cambios" : "Crear plantilla"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
