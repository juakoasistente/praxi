"use client"

import * as React from "react"
import { Settings, Upload, Palette } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { getAutoescuela, getUsuarios } from "@/lib/services/configuracion"
import type { Autoescuela } from "@/lib/services/configuracion"
import { AutoescuelaForm } from "@/components/configuracion/autoescuela-form"

const ROL_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  profesor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  secretario: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
}

const ROL_LABELS: Record<string, string> = {
  admin: "Admin",
  profesor: "Profesor",
  secretario: "Secretario",
}

export default function ConfiguracionPage() {
  const { data: autoescuela, loading: loadingAE } = useSupabaseQuery(() => getAutoescuela())
  const { data: usuarios, loading: loadingU } = useSupabaseQuery(() => getUsuarios())

  const [currentAutoescuela, setCurrentAutoescuela] = React.useState<Autoescuela | null>(null)

  React.useEffect(() => {
    if (autoescuela) setCurrentAutoescuela(autoescuela)
  }, [autoescuela])

  if (loadingAE || loadingU) return <LoadingSkeleton />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
          <Settings className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Ajustes generales de la autoescuela
          </p>
        </div>
      </div>

      {/* Sección: Datos de la autoescuela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos de la autoescuela</CardTitle>
        </CardHeader>
        <CardContent>
          {currentAutoescuela && (
            <AutoescuelaForm
              autoescuela={currentAutoescuela}
              onUpdate={setCurrentAutoescuela}
            />
          )}
        </CardContent>
      </Card>

      {/* Sección: Usuarios del sistema */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Usuarios del sistema</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Próximamente")}
          >
            Invitar usuario
          </Button>
        </CardHeader>
        <CardContent>
          {usuarios && usuarios.length > 0 ? (
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.nombre} {u.apellidos}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-0 ${ROL_COLORS[u.rol] ?? ""}`}>
                          {ROL_LABELS[u.rol] ?? u.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`border-0 ${
                            u.activo
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {u.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay usuarios registrados.</p>
          )}
        </CardContent>
      </Card>

      {/* Sección: Personalización */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personalización</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo upload placeholder */}
          <div>
            <p className="text-sm font-medium mb-2">Logo de la autoescuela</p>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="size-8" />
                <p className="text-sm">Subir logo — Próximamente</p>
              </div>
            </div>
          </div>

          {/* Color picker placeholder */}
          <div>
            <p className="text-sm font-medium mb-2">Color principal de marca</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border px-4 py-2 text-muted-foreground">
                <Palette className="size-4" />
                <span className="text-sm">Selector de color — Próximamente</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
