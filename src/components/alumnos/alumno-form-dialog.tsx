"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Alumno, PermisoType, EstadoAlumno } from "./types"
import { PERMISOS, ESTADOS, ESTADO_LABELS } from "./types"
import { alumnoSchema } from "@/lib/validations/alumno"
import { createAlumnoAccount } from "@/lib/services/alumnos"

type AlumnoFormData = Omit<Alumno, "id">

const EMPTY_FORM: AlumnoFormData = {
  nombre: "",
  apellidos: "",
  dni: "",
  email: null,
  telefono: "",
  fecha_nacimiento: "",
  direccion: null,
  permiso: "B",
  estado: "matriculado",
  fecha_matricula: new Date().toISOString().split("T")[0],
  notas: null,
  sede_id: "1", // Default to Central sede
}

interface AlumnoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumno?: Alumno | null
  onSave: (data: AlumnoFormData) => void
}

export function AlumnoFormDialog({
  open,
  onOpenChange,
  alumno,
  onSave,
}: AlumnoFormDialogProps) {
  const [form, setForm] = React.useState<AlumnoFormData>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [createAccount, setCreateAccount] = React.useState(false)
  const [accountPassword, setAccountPassword] = React.useState("")
  const [showAccountPassword, setShowAccountPassword] = React.useState(false)
  const [accountCredentials, setAccountCredentials] = React.useState<{ email: string; password: string } | null>(null)
  const isEditing = !!alumno

  React.useEffect(() => {
    if (alumno) {
      const { id: _, ...rest } = alumno
      setForm(rest)
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
    setCreateAccount(false)
    setAccountPassword("")
    setShowAccountPassword(false)
    setAccountCredentials(null)
  }, [alumno, open])

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setAccountPassword(password)
  }

  React.useEffect(() => {
    if (createAccount && form.email) {
      // Auto-generate password when email is filled
      if (!accountPassword) {
        generatePassword()
      }
    }
  }, [createAccount, form.email, accountPassword])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validate alumno data
    const result = alumnoSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    // Validate account creation if enabled
    if (createAccount) {
      if (!form.email) {
        setErrors({ email: "El email es obligatorio para crear una cuenta" })
        return
      }
      if (!accountPassword) {
        setErrors({ accountPassword: "La contraseña es obligatoria" })
        return
      }
    }

    setErrors({})

    try {
      // Save alumno data first
      onSave(form)

      // Create account if requested
      if (createAccount && form.email && accountPassword) {
        try {
          await createAlumnoAccount(form.email, accountPassword)
          setAccountCredentials({
            email: form.email,
            password: accountPassword
          })
          toast.success("Alumno matriculado y cuenta creada", {
            description: `Credenciales: ${form.email} / ${accountPassword}`
          })
        } catch (error: any) {
          toast.error("Alumno matriculado pero error al crear cuenta", {
            description: error.message
          })
        }
      } else {
        toast.success("Alumno matriculado correctamente")
      }

      onOpenChange(false)
    } catch (error: any) {
      toast.error("Error al matricular alumno", {
        description: error.message
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar alumno" : "Nuevo alumno"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del alumno."
              : "Rellena los datos para matricular un nuevo alumno."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => {
                  setForm({ ...form, nombre: e.target.value })
                  clearError("nombre")
                }}
              />
              {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input
                id="apellidos"
                value={form.apellidos}
                onChange={(e) => {
                  setForm({ ...form, apellidos: e.target.value })
                  clearError("apellidos")
                }}
              />
              {errors.apellidos && <p className="text-xs text-destructive mt-1">{errors.apellidos}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                placeholder="12345678A"
                value={form.dni}
                onChange={(e) => {
                  setForm({ ...form, dni: e.target.value })
                  clearError("dni")
                }}
              />
              {errors.dni && <p className="text-xs text-destructive mt-1">{errors.dni}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                placeholder="612 345 678"
                value={form.telefono}
                onChange={(e) => {
                  setForm({ ...form, telefono: e.target.value })
                  clearError("telefono")
                }}
              />
              {errors.telefono && <p className="text-xs text-destructive mt-1">{errors.telefono}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email ?? ""}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value || null })
                clearError("email")
              }}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={form.fecha_nacimiento}
                onChange={(e) => {
                  setForm({ ...form, fecha_nacimiento: e.target.value })
                  clearError("fecha_nacimiento")
                }}
              />
              {errors.fecha_nacimiento && <p className="text-xs text-destructive mt-1">{errors.fecha_nacimiento}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fecha_matricula">Fecha de matrícula *</Label>
              <Input
                id="fecha_matricula"
                type="date"
                value={form.fecha_matricula}
                onChange={(e) => {
                  setForm({ ...form, fecha_matricula: e.target.value })
                  clearError("fecha_matricula")
                }}
              />
              {errors.fecha_matricula && <p className="text-xs text-destructive mt-1">{errors.fecha_matricula}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={form.direccion ?? ""}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value || null })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Permiso *</Label>
              <Select
                value={form.permiso}
                onValueChange={(val) =>
                  val && setForm({ ...form, permiso: val as PermisoType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERMISOS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEditing && (
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Select
                  value={form.estado}
                  onValueChange={(val) =>
                    val && setForm({ ...form, estado: val as EstadoAlumno })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {ESTADO_LABELS[e]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notas">Notas</Label>
            <textarea
              id="notas"
              className="flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              value={form.notas ?? ""}
              onChange={(e) =>
                setForm({ ...form, notas: e.target.value || null })
              }
            />
          </div>

          {/* Account Creation Section - Only for new alumnos */}
          {!isEditing && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createAccount"
                    checked={createAccount}
                    onCheckedChange={(checked) => setCreateAccount(!!checked)}
                  />
                  <Label htmlFor="createAccount" className="text-sm font-medium">
                    Crear cuenta de acceso al portal
                  </Label>
                </div>

                {createAccount && (
                  <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Se creará una cuenta para que el alumno pueda acceder al portal.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="accountEmail">Email para la cuenta</Label>
                        <Input
                          id="accountEmail"
                          type="email"
                          value={form.email ?? ""}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value || null })
                            clearError("email")
                          }}
                          placeholder="email@ejemplo.com"
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="accountPassword">Contraseña</Label>
                        <div className="flex gap-1">
                          <div className="relative flex-1">
                            <Input
                              id="accountPassword"
                              type={showAccountPassword ? "text" : "password"}
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              placeholder="Contraseña generada"
                              className="pr-8"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                              onClick={() => setShowAccountPassword(!showAccountPassword)}
                            >
                              {showAccountPassword ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generatePassword}
                            className="px-2"
                          >
                            <RefreshCw className="size-3" />
                          </Button>
                        </div>
                        {errors.accountPassword && <p className="text-xs text-destructive">{errors.accountPassword}</p>}
                      </div>
                    </div>

                    {accountCredentials && (
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <p className="text-xs text-green-800 dark:text-green-200 font-medium">
                          ✓ Cuenta creada: {accountCredentials.email} / {accountCredentials.password}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Guardar cambios" : "Matricular alumno"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
