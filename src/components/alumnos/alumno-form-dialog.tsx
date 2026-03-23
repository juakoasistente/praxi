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
import { Textarea } from "@/components/ui/textarea"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  UserCheck,
  Home,
  GraduationCap,
  FileText
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Alumno, PermisoType, EstadoAlumno } from "./types"
import {
  PERMISOS,
  ESTADOS,
  ESTADO_LABELS,
  ESTUDIOS_OPTIONS,
  COMO_CONOCIO_OPTIONS,
  RELACION_TUTOR_OPTIONS
} from "./types"
import { useSede } from "@/hooks/use-sede"
import { createAlumnoAccount } from "@/lib/services/alumnos"

type AlumnoFormData = Omit<Alumno, "id">

const EMPTY_FORM: AlumnoFormData = {
  codigo: null,
  sede_id: "",
  // Personal
  nombre: "",
  apellido1: "",
  apellido2: null,
  dni: "",
  sexo: null,
  fecha_nacimiento: "",
  pais_nacimiento: "España",
  nacionalidad: "Española",
  estudios: null,
  telefono_fijo: null,
  telefono_movil: "",
  email: null,
  foto_url: null,
  como_conocio: null,
  observaciones: null,
  // Tutor
  tutor_nombre: null,
  tutor_apellidos: null,
  tutor_dni: null,
  tutor_relacion: null,
  // Address
  direccion: null,
  codigo_postal: null,
  poblacion: null,
  provincia: null,
  pais: "España",
  // Billing
  facturacion_diferente: false,
  facturacion_nif: null,
  facturacion_nombre: null,
  facturacion_direccion: null,
  // Banking
  titular_cuenta: null,
  iban: null,
  fecha_mandato_sepa: null,
  // Enrollment
  permiso: "B",
  estado: "matriculado",
  fecha_matricula: new Date().toISOString().split("T")[0],
  notas: null,
  // Backward compat
  apellidos: "",
  telefono: "",
}

interface AlumnoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumno?: Alumno | null
  onSave: (data: AlumnoFormData) => void
}

const STEPS = [
  { id: 1, label: "Datos personales", icon: UserCheck },
  { id: 2, label: "Domicilio", icon: Home },
  { id: 3, label: "Matrícula", icon: GraduationCap },
  { id: 4, label: "Resumen", icon: FileText },
]

function isMinor(fechaNacimiento: string): boolean {
  if (!fechaNacimiento) return false
  const birthDate = new Date(fechaNacimiento)
  const now = new Date()
  const age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    return age - 1 < 18
  }
  return age < 18
}

export function AlumnoFormDialog({
  open,
  onOpenChange,
  alumno,
  onSave,
}: AlumnoFormDialogProps) {
  const { sedes, loading: sedesLoading } = useSede()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [quickMode, setQuickMode] = React.useState(true)
  const [form, setForm] = React.useState<AlumnoFormData>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [createAccount, setCreateAccount] = React.useState(false)
  const [accountPassword, setAccountPassword] = React.useState("")
  const [showAccountPassword, setShowAccountPassword] = React.useState(false)
  const [showBilling, setShowBilling] = React.useState(false)
  const [showBanking, setShowBanking] = React.useState(false)
  const isEditing = !!alumno
  const showTutor = isMinor(form.fecha_nacimiento)

  // Reset form only when dialog opens/closes
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (open && !prevOpen.current) {
      // Dialog just opened
      if (alumno) {
        const { id: _, ...rest } = alumno
        setForm(rest)
        setQuickMode(false)
      } else {
        setForm({ ...EMPTY_FORM })
        setQuickMode(true)
      }
      setCurrentStep(1)
      setErrors({})
      setCreateAccount(false)
      setAccountPassword("")
      setShowAccountPassword(false)
      setShowBilling(false)
      setShowBanking(false)
    }
    prevOpen.current = open
  }, [open, alumno])

  // Compute backward compatibility fields on save, not in useEffect (avoids infinite loop)
  const computeBackwardCompat = (data: AlumnoFormData) => ({
    ...data,
    apellidos: data.apellido1 + (data.apellido2 ? ` ${data.apellido2}` : ""),
    telefono: data.telefono_movil,
  })

  function clearError(field: string) {
    if (errors[field]) {
      setErrors(prev => {
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

  function validateCurrentStep(): boolean {
    const stepErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!form.nombre) stepErrors.nombre = "El nombre es obligatorio"
      if (!form.apellido1) stepErrors.apellido1 = "El primer apellido es obligatorio"
      if (!form.dni) stepErrors.dni = "El DNI es obligatorio"
      if (form.dni && !/^\d{8}[A-Z]$/.test(form.dni)) {
        stepErrors.dni = "DNI inválido (ej: 12345678A)"
      }
      if (!form.telefono_movil) stepErrors.telefono_movil = "El teléfono móvil es obligatorio"
      if (form.telefono_movil && form.telefono_movil.length < 9) {
        stepErrors.telefono_movil = "Teléfono debe tener al menos 9 dígitos"
      }
      if (!form.sede_id) stepErrors.sede_id = "La sede es obligatoria"

      // Tutor validation if minor
      if (showTutor) {
        if (!form.tutor_nombre) stepErrors.tutor_nombre = "El nombre del tutor es obligatorio para menores"
        if (!form.tutor_apellidos) stepErrors.tutor_apellidos = "Los apellidos del tutor son obligatorios para menores"
        if (!form.tutor_dni) stepErrors.tutor_dni = "El DNI del tutor es obligatorio para menores"
        if (!form.tutor_relacion) stepErrors.tutor_relacion = "La relación con el tutor es obligatoria para menores"
      }
    }

    if (currentStep === 3) {
      if (!form.permiso) stepErrors.permiso = "El permiso es obligatorio"
      if (!form.fecha_matricula) stepErrors.fecha_matricula = "La fecha de matrícula es obligatoria"
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  function handleNext() {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  function handlePrevious() {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  function canJumpToStep(stepId: number): boolean {
    // Can always go back
    if (stepId <= currentStep) return true

    // For forward jumps, validate all intermediate steps
    for (let step = currentStep; step < stepId; step++) {
      const originalStep = currentStep
      setCurrentStep(step)
      const valid = validateCurrentStep()
      setCurrentStep(originalStep)
      if (!valid) return false
    }
    return true
  }

  async function handleQuickSave() {
    if (!validateCurrentStep()) return

    try {
      const formWithDefaults = { ...form }

      // Add account creation if requested
      if (createAccount && form.email && accountPassword) {
        try {
          await createAlumnoAccount(form.email, accountPassword)
          toast.success("Alumno creado rápidamente y cuenta creada", {
            description: `Credenciales: ${form.email} / ${accountPassword}`
          })
        } catch (error: any) {
          toast.error("Alumno creado pero error al crear cuenta", {
            description: error.message
          })
        }
      } else {
        toast.success("Alumno creado rápidamente")
      }

      onSave(computeBackwardCompat(formWithDefaults))
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Error al crear alumno", {
        description: error.message
      })
    }
  }

  async function handleFinalSubmit() {
    try {
      // Add account creation if requested
      if (createAccount && form.email && accountPassword) {
        try {
          await createAlumnoAccount(form.email, accountPassword)
          toast.success("Alumno matriculado y cuenta creada", {
            description: `Credenciales: ${form.email} / ${accountPassword}`
          })
        } catch (error: any) {
          toast.error("Alumno matriculado pero error al crear cuenta", {
            description: error.message
          })
        }
      } else {
        toast.success(isEditing ? "Alumno actualizado correctamente" : "Alumno matriculado correctamente")
      }

      onSave(computeBackwardCompat(form))
      onOpenChange(false)
    } catch (error: any) {
      toast.error(isEditing ? "Error al actualizar alumno" : "Error al matricular alumno", {
        description: error.message
      })
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.id < currentStep
        const canJump = canJumpToStep(step.id)
        const Icon = step.icon

        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => canJump && setCurrentStep(step.id)}
              disabled={!canJump}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
                isActive && "bg-primary/10 text-primary",
                isCompleted && "text-green-600",
                !canJump && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  !isActive && !isCompleted && "border-muted-foreground/30"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className="text-xs font-medium">{step.label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div className="w-8 h-0.5 bg-muted-foreground/20" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  const PersonalDataStep = () => (
    <div className="space-y-4">
      {!isEditing && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-2 p-1 bg-muted/50 rounded-lg">
            <Button
              type="button"
              variant={quickMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setQuickMode(true)}
            >
              Alta rápida
            </Button>
            <Button
              type="button"
              variant={!quickMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setQuickMode(false)}
            >
              Formulario completo
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="dni">DNI *</Label>
          <Input
            id="dni"
            placeholder="12345678A"
            value={form.dni}
            onChange={(e) => {
              setForm({ ...form, dni: e.target.value.toUpperCase() })
              clearError("dni")
            }}
          />
          {errors.dni && <p className="text-xs text-destructive">{errors.dni}</p>}
        </div>
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
          {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="apellido1">Primer apellido *</Label>
          <Input
            id="apellido1"
            value={form.apellido1}
            onChange={(e) => {
              setForm({ ...form, apellido1: e.target.value })
              clearError("apellido1")
            }}
          />
          {errors.apellido1 && <p className="text-xs text-destructive">{errors.apellido1}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="apellido2">Segundo apellido</Label>
          <Input
            id="apellido2"
            value={form.apellido2 ?? ""}
            onChange={(e) => {
              setForm({ ...form, apellido2: e.target.value || null })
            }}
          />
        </div>
      </div>

      {(!quickMode || isEditing) && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sexo</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={form.sexo === "hombre" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm({ ...form, sexo: "hombre" })}
                >
                  Hombre
                </Button>
                <Button
                  type="button"
                  variant={form.sexo === "mujer" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm({ ...form, sexo: "mujer" })}
                >
                  Mujer
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={form.fecha_nacimiento}
                onChange={(e) => {
                  setForm({ ...form, fecha_nacimiento: e.target.value })
                  clearError("fecha_nacimiento")
                }}
              />
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="telefono_movil">Teléfono móvil *</Label>
          <Input
            id="telefono_movil"
            placeholder="612 345 678"
            value={form.telefono_movil}
            onChange={(e) => {
              setForm({ ...form, telefono_movil: e.target.value })
              clearError("telefono_movil")
            }}
          />
          {errors.telefono_movil && <p className="text-xs text-destructive">{errors.telefono_movil}</p>}
        </div>
        {(!quickMode || isEditing) && (
          <div className="space-y-1.5">
            <Label htmlFor="telefono_fijo">Teléfono fijo</Label>
            <Input
              id="telefono_fijo"
              placeholder="912 345 678"
              value={form.telefono_fijo ?? ""}
              onChange={(e) => {
                setForm({ ...form, telefono_fijo: e.target.value || null })
              }}
            />
          </div>
        )}
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
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {(!quickMode || isEditing) && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pais_nacimiento">País de nacimiento</Label>
              <Input
                id="pais_nacimiento"
                value={form.pais_nacimiento ?? ""}
                onChange={(e) => {
                  setForm({ ...form, pais_nacimiento: e.target.value || null })
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nacionalidad">Nacionalidad</Label>
              <Input
                id="nacionalidad"
                value={form.nacionalidad ?? ""}
                onChange={(e) => {
                  setForm({ ...form, nacionalidad: e.target.value || null })
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Estudios</Label>
            <Select
              value={form.estudios ?? ""}
              onValueChange={(val) => setForm({ ...form, estudios: val || null })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estudios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No especificado</SelectItem>
                {ESTUDIOS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>¿Cómo nos conoció?</Label>
            <Select
              value={form.como_conocio ?? ""}
              onValueChange={(val) => setForm({ ...form, como_conocio: val || null })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No especificado</SelectItem>
                {COMO_CONOCIO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              rows={2}
              value={form.observaciones ?? ""}
              onChange={(e) => {
                setForm({ ...form, observaciones: e.target.value || null })
              }}
            />
          </div>
        </>
      )}

      {/* Tutor section */}
      {showTutor && (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Datos del tutor (menor de edad)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tutor_nombre">Nombre del tutor *</Label>
                <Input
                  id="tutor_nombre"
                  value={form.tutor_nombre ?? ""}
                  onChange={(e) => {
                    setForm({ ...form, tutor_nombre: e.target.value || null })
                    clearError("tutor_nombre")
                  }}
                />
                {errors.tutor_nombre && <p className="text-xs text-destructive">{errors.tutor_nombre}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tutor_apellidos">Apellidos del tutor *</Label>
                <Input
                  id="tutor_apellidos"
                  value={form.tutor_apellidos ?? ""}
                  onChange={(e) => {
                    setForm({ ...form, tutor_apellidos: e.target.value || null })
                    clearError("tutor_apellidos")
                  }}
                />
                {errors.tutor_apellidos && <p className="text-xs text-destructive">{errors.tutor_apellidos}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tutor_dni">DNI del tutor *</Label>
                <Input
                  id="tutor_dni"
                  placeholder="12345678A"
                  value={form.tutor_dni ?? ""}
                  onChange={(e) => {
                    setForm({ ...form, tutor_dni: e.target.value.toUpperCase() || null })
                    clearError("tutor_dni")
                  }}
                />
                {errors.tutor_dni && <p className="text-xs text-destructive">{errors.tutor_dni}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Relación *</Label>
                <Select
                  value={form.tutor_relacion ?? ""}
                  onValueChange={(val) => {
                    setForm({ ...form, tutor_relacion: val || null })
                    clearError("tutor_relacion")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar relación" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELACION_TUTOR_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tutor_relacion && <p className="text-xs text-destructive">{errors.tutor_relacion}</p>}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <Label>Sede *</Label>
        <Select
          value={form.sede_id}
          onValueChange={(val) => {
            if (val) {
              setForm({ ...form, sede_id: val })
              clearError("sede_id")
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar sede" />
          </SelectTrigger>
          <SelectContent>
            {sedes.map((sede) => (
              <SelectItem key={sede.id} value={sede.id}>
                {sede.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sede_id && <p className="text-xs text-destructive">{errors.sede_id}</p>}
      </div>

      {quickMode && !isEditing && (
        <>
          <Separator />
          <div className="space-y-3">
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
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  const AddressStep = () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          placeholder="Calle, número, piso, puerta"
          value={form.direccion ?? ""}
          onChange={(e) => setForm({ ...form, direccion: e.target.value || null })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="codigo_postal">Código postal</Label>
          <Input
            id="codigo_postal"
            placeholder="28001"
            value={form.codigo_postal ?? ""}
            onChange={(e) => setForm({ ...form, codigo_postal: e.target.value || null })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="poblacion">Población</Label>
          <Input
            id="poblacion"
            value={form.poblacion ?? ""}
            onChange={(e) => setForm({ ...form, poblacion: e.target.value || null })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="provincia">Provincia</Label>
          <Input
            id="provincia"
            value={form.provincia ?? ""}
            onChange={(e) => setForm({ ...form, provincia: e.target.value || null })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pais">País</Label>
          <Input
            id="pais"
            value={form.pais ?? ""}
            onChange={(e) => setForm({ ...form, pais: e.target.value || null })}
          />
        </div>
      </div>

      {/* Billing section */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-sm text-muted-foreground p-0 h-auto"
          onClick={() => setShowBilling(!showBilling)}
        >
          <ChevronRight className={cn("w-4 h-4 mr-2 transition-transform", showBilling && "rotate-90")} />
          Datos de facturación diferentes
        </Button>

        {showBilling && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="facturacion_diferente"
                checked={form.facturacion_diferente}
                onCheckedChange={(checked) => setForm({ ...form, facturacion_diferente: !!checked })}
              />
              <Label htmlFor="facturacion_diferente" className="text-sm">
                Usar datos de facturación diferentes
              </Label>
            </div>

            {form.facturacion_diferente && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="facturacion_nif">NIF</Label>
                  <Input
                    id="facturacion_nif"
                    value={form.facturacion_nif ?? ""}
                    onChange={(e) => setForm({ ...form, facturacion_nif: e.target.value || null })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="facturacion_nombre">Nombre</Label>
                  <Input
                    id="facturacion_nombre"
                    value={form.facturacion_nombre ?? ""}
                    onChange={(e) => setForm({ ...form, facturacion_nombre: e.target.value || null })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="facturacion_direccion">Dirección</Label>
                  <Input
                    id="facturacion_direccion"
                    value={form.facturacion_direccion ?? ""}
                    onChange={(e) => setForm({ ...form, facturacion_direccion: e.target.value || null })}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Banking section */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-sm text-muted-foreground p-0 h-auto"
          onClick={() => setShowBanking(!showBanking)}
        >
          <ChevronRight className={cn("w-4 h-4 mr-2 transition-transform", showBanking && "rotate-90")} />
          Datos bancarios
        </Button>

        {showBanking && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="space-y-1.5">
              <Label htmlFor="titular_cuenta">Titular de la cuenta</Label>
              <Input
                id="titular_cuenta"
                value={form.titular_cuenta ?? ""}
                onChange={(e) => setForm({ ...form, titular_cuenta: e.target.value || null })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                placeholder="ES00 0000 0000 0000 0000 0000"
                value={form.iban ?? ""}
                onChange={(e) => setForm({ ...form, iban: e.target.value || null })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fecha_mandato_sepa">Fecha mandato SEPA</Label>
              <Input
                id="fecha_mandato_sepa"
                type="date"
                value={form.fecha_mandato_sepa ?? ""}
                onChange={(e) => setForm({ ...form, fecha_mandato_sepa: e.target.value || null })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const EnrollmentStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Permiso *</Label>
          <Select
            value={form.permiso}
            onValueChange={(val) => {
              setForm({ ...form, permiso: val as PermisoType })
              clearError("permiso")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar permiso" />
            </SelectTrigger>
            <SelectContent>
              {PERMISOS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.permiso && <p className="text-xs text-destructive">{errors.permiso}</p>}
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
          {errors.fecha_matricula && <p className="text-xs text-destructive">{errors.fecha_matricula}</p>}
        </div>
      </div>

      {isEditing && (
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select
            value={form.estado}
            onValueChange={(val) => setForm({ ...form, estado: val as EstadoAlumno })}
          >
            <SelectTrigger>
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

      <div className="space-y-1.5">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          rows={3}
          value={form.notas ?? ""}
          onChange={(e) => setForm({ ...form, notas: e.target.value || null })}
        />
      </div>

      {!quickMode && !isEditing && (
        <>
          <Separator />
          <div className="space-y-3">
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
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  const SummaryStep = () => {
    const selectedSede = sedes.find(s => s.id === form.sede_id)
    const missingFields: string[] = []

    // Check for required fields
    if (!form.nombre) missingFields.push("Nombre")
    if (!form.apellido1) missingFields.push("Primer apellido")
    if (!form.dni) missingFields.push("DNI")
    if (!form.telefono_movil) missingFields.push("Teléfono móvil")
    if (!form.sede_id) missingFields.push("Sede")
    if (!form.permiso) missingFields.push("Permiso")
    if (!form.fecha_matricula) missingFields.push("Fecha de matrícula")

    return (
      <div className="space-y-6">
        {missingFields.length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
              Faltan campos obligatorios:
            </p>
            <ul className="text-sm text-red-700 dark:text-red-300 mt-1">
              {missingFields.map(field => (
                <li key={field} className="ml-2">• {field}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Datos personales</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Nombre:</span> {form.nombre} {form.apellido1} {form.apellido2}</p>
              <p><span className="font-medium">DNI:</span> {form.dni}</p>
              <p><span className="font-medium">Teléfono:</span> {form.telefono_movil}</p>
              {form.email && <p><span className="font-medium">Email:</span> {form.email}</p>}
              {form.fecha_nacimiento && <p><span className="font-medium">Fecha nacimiento:</span> {form.fecha_nacimiento}</p>}
              {selectedSede && <p><span className="font-medium">Sede:</span> {selectedSede.nombre}</p>}
            </div>
          </div>

          {(form.direccion || form.poblacion) && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Domicilio</h4>
              <div className="space-y-1 text-sm">
                {form.direccion && <p><span className="font-medium">Dirección:</span> {form.direccion}</p>}
                {form.codigo_postal && <p><span className="font-medium">CP:</span> {form.codigo_postal}</p>}
                {form.poblacion && <p><span className="font-medium">Población:</span> {form.poblacion}</p>}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Matrícula</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Permiso:</span> {form.permiso}</p>
              <p><span className="font-medium">Fecha matrícula:</span> {form.fecha_matricula}</p>
              <p><span className="font-medium">Estado:</span> {ESTADO_LABELS[form.estado]}</p>
            </div>
          </div>

          {showTutor && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Tutor</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Nombre:</span> {form.tutor_nombre} {form.tutor_apellidos}</p>
                <p><span className="font-medium">DNI:</span> {form.tutor_dni}</p>
                <p><span className="font-medium">Relación:</span> {form.tutor_relacion}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDataStep />
      case 2:
        return <AddressStep />
      case 3:
        return <EnrollmentStep />
      case 4:
        return <SummaryStep />
      default:
        return <PersonalDataStep />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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

        <StepIndicator />

        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>

          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
          )}

          {quickMode && currentStep === 1 && !isEditing && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleQuickSave}
            >
              Crear directamente
            </Button>
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinalSubmit}
            >
              {isEditing ? "Guardar cambios" : "Crear alumno"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
