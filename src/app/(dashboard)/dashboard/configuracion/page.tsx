"use client"

import * as React from "react"
import { Settings, Upload, Palette, Shield, Eye, EyeOff, UserCog, Check } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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

interface UserPermission {
  section: string
  label: string
  description: string
}

const AVAILABLE_PERMISSIONS: UserPermission[] = [
  { section: "alumnos", label: "Alumnos", description: "Gestión completa de alumnos" },
  { section: "profesores", label: "Profesores", description: "Gestión de profesores" },
  { section: "clases", label: "Clases", description: "Planificación y gestión de clases" },
  { section: "vehiculos", label: "Vehículos", description: "Gestión del parque móvil" },
  { section: "examenes", label: "Exámenes", description: "Gestión de exámenes" },
  { section: "facturacion", label: "Facturación", description: "Facturación y pagos" },
  { section: "contratos", label: "Contratos", description: "Gestión de contratos" },
  { section: "fichajes", label: "Fichajes", description: "Control de fichajes" },
  { section: "inbox", label: "Inbox", description: "Centro de comunicaciones" },
  { section: "dgt", label: "Trámites DGT", description: "Gestión de trámites oficiales" },
  { section: "estadisticas", label: "Estadísticas", description: "Reportes y análisis" },
  { section: "informes", label: "Informes", description: "Informes personalizados" },
]

export default function ConfiguracionPage() {
  const { data: autoescuela, loading: loadingAE } = useSupabaseQuery(() => getAutoescuela())
  const { data: usuarios, loading: loadingU } = useSupabaseQuery(() => getUsuarios())

  const [currentAutoescuela, setCurrentAutoescuela] = React.useState<Autoescuela | null>(null)
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({})
  const [changingPassword, setChangingPassword] = React.useState(false)
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false
  })
  const [permissionsDialogOpen, setPermissionsDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const [userPermissions, setUserPermissions] = React.useState<string[]>([])

  React.useEffect(() => {
    if (autoescuela) setCurrentAutoescuela(autoescuela)
  }, [autoescuela])

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordErrors({})

    // Validation
    const errors: Record<string, string> = {}
    if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "La contraseña debe tener al menos 6 caracteres"
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "La nueva contraseña es obligatoria"
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setChangingPassword(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (error) {
        throw error
      }

      toast.success("Contraseña cambiada correctamente")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      toast.error("Error al cambiar la contraseña", {
        description: error.message
      })
    } finally {
      setChangingPassword(false)
    }
  }

  function openPermissionsDialog(user: any) {
    if (user.rol === "admin") {
      toast.info("Los administradores tienen acceso completo")
      return
    }

    setSelectedUser(user)

    // Load existing custom permissions from localStorage (in production would be from database)
    const savedPermissions = localStorage.getItem(`user_permissions_${user.id}`)
    if (savedPermissions) {
      setUserPermissions(JSON.parse(savedPermissions))
    } else {
      // Set default permissions based on role
      const defaultPermissions = user.rol === "secretario"
        ? ["alumnos", "clases", "examenes", "facturacion", "fichajes", "contratos", "inbox", "dgt"]
        : ["clases", "fichajes"] // profesor
      setUserPermissions(defaultPermissions)
    }

    setPermissionsDialogOpen(true)
  }

  function saveUserPermissions() {
    if (!selectedUser) return

    // Save to localStorage (in production would save to database)
    localStorage.setItem(`user_permissions_${selectedUser.id}`, JSON.stringify(userPermissions))

    toast.success("Permisos actualizados correctamente")
    setPermissionsDialogOpen(false)
    setSelectedUser(null)
  }

  function togglePermission(section: string) {
    setUserPermissions(prev =>
      prev.includes(section)
        ? prev.filter(p => p !== section)
        : [...prev, section]
    )
  }

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
                    <TableRow
                      key={u.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openPermissionsDialog(u)}
                    >
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
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`border-0 ${
                              u.activo
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {u.activo ? "Activo" : "Inactivo"}
                          </Badge>
                          {u.rol !== "admin" && (
                            <UserCog className="size-4 text-muted-foreground" />
                          )}
                        </div>
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

      {/* Sección: Seguridad */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <CardTitle className="text-base">Seguridad</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="pr-10"
                    placeholder="Tu contraseña actual (no es necesaria para Supabase)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="pr-10"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pr-10"
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? "Cambiando..." : "Cambiar contraseña"}
              </Button>
            </div>
          </form>
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

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="size-5" />
              Permisos de usuario
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  Configurar permisos para <strong>{selectedUser.nombre} {selectedUser.apellidos}</strong> (
                  <Badge className={`border-0 ${ROL_COLORS[selectedUser.rol] ?? ""}`}>
                    {ROL_LABELS[selectedUser.rol] ?? selectedUser.rol}
                  </Badge>
                  )
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-3">
              {AVAILABLE_PERMISSIONS.map((permission) => {
                const isIncluded = userPermissions.includes(permission.section)
                const isDisabled = selectedUser?.rol === "admin" // Admin always has all permissions

                return (
                  <div
                    key={permission.section}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${
                      isIncluded
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      id={permission.section}
                      checked={isIncluded || isDisabled}
                      onCheckedChange={() => !isDisabled && togglePermission(permission.section)}
                      disabled={isDisabled}
                      className="mt-0.5"
                    />
                    <div className="grid gap-1 flex-1 min-w-0">
                      <label
                        htmlFor={permission.section}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {permission.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                    {isIncluded && (
                      <Check className="size-4 text-green-600 dark:text-green-400 mt-0.5" />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="size-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Permisos base por rol:</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedUser?.rol === "secretario"
                      ? "Secretarios tienen acceso base a alumnos, clases, exámenes, facturación, fichajes, contratos, inbox y DGT."
                      : selectedUser?.rol === "profesor"
                      ? "Profesores tienen acceso base a clases y fichajes únicamente."
                      : "Los administradores tienen acceso completo a todo el sistema."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button onClick={saveUserPermissions} disabled={selectedUser?.rol === "admin"}>
              Guardar permisos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
