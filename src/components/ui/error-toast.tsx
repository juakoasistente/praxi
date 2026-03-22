"use client"

import { toast } from "sonner"
import {
  ShieldAlert,
  XCircle,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Info,
  X
} from "lucide-react"

type ErrorType = "permission" | "creation" | "network" | "validation" | "generic"
type ToastType = ErrorType | "success" | "info"

const toastConfig = {
  permission: {
    title: "Acceso denegado",
    defaultMessage: "No tienes permisos para realizar esta acción",
    icon: ShieldAlert,
    className: "border-l-4 border-l-destructive bg-destructive/5",
    iconClassName: "text-destructive",
  },
  creation: {
    title: "Error al crear",
    defaultMessage: "Error al crear el elemento",
    icon: XCircle,
    className: "border-l-4 border-l-destructive bg-destructive/5",
    iconClassName: "text-destructive",
  },
  network: {
    title: "Error de conexión",
    defaultMessage: "Error de conexión. Comprueba tu internet.",
    icon: WifiOff,
    className: "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20",
    iconClassName: "text-orange-600 dark:text-orange-400",
  },
  validation: {
    title: "Datos no válidos",
    defaultMessage: "Los datos introducidos no son válidos",
    icon: AlertTriangle,
    className: "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
    iconClassName: "text-yellow-600 dark:text-yellow-400",
  },
  generic: {
    title: "Error",
    defaultMessage: "Ha ocurrido un error inesperado",
    icon: XCircle,
    className: "border-l-4 border-l-destructive bg-destructive/5",
    iconClassName: "text-destructive",
  },
  success: {
    title: "Éxito",
    defaultMessage: "Operación completada correctamente",
    icon: CheckCircle,
    className: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20",
    iconClassName: "text-green-600 dark:text-green-400",
  },
  info: {
    title: "Información",
    defaultMessage: "Información",
    icon: Info,
    className: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20",
    iconClassName: "text-blue-600 dark:text-blue-400",
  },
}

interface ToastAction {
  label: string
  onClick: () => void
  variant?: "default" | "destructive"
}

export function showToast(
  type: ToastType,
  message?: string,
  options?: {
    title?: string
    action?: ToastAction
    duration?: number
    dismissible?: boolean
  }
) {
  const config = toastConfig[type]
  const finalMessage = message || config.defaultMessage
  const finalTitle = options?.title || config.title

  toast.custom(
    (t) => (
      <div className={`flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-[500px] ${config.className}`}>
        <div className="flex-shrink-0 mt-0.5">
          <config.icon className={`h-5 w-5 ${config.iconClassName}`} aria-hidden="true" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="font-semibold text-sm text-foreground">
            {finalTitle}
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {finalMessage}
          </div>
          {options?.action && (
            <div className="pt-2">
              <button
                onClick={() => {
                  options.action!.onClick()
                  toast.dismiss(t)
                }}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  options.action.variant === "destructive"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {options.action.label}
              </button>
            </div>
          )}
        </div>

        {(options?.dismissible !== false) && (
          <button
            onClick={() => toast.dismiss(t)}
            className="flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        )}
      </div>
    ),
    {
      duration: options?.duration ?? (type === "success" ? 4000 : 6000),
      position: 'top-right',
    }
  )
}

// Specific toast functions for easier usage
export function showErrorToast(type: ErrorType, message?: string, options?: Parameters<typeof showToast>[2]) {
  showToast(type, message, options)
}

export function showSuccessToast(message?: string, options?: Parameters<typeof showToast>[2]) {
  showToast("success", message, options)
}

export function showInfoToast(message?: string, options?: Parameters<typeof showToast>[2]) {
  showToast("info", message, options)
}

// Convenience functions for common scenarios
export function showPermissionError(details?: string) {
  showErrorToast("permission", details)
}

export function showNetworkError(details?: string) {
  showErrorToast("network", details)
}

export function showValidationError(details?: string) {
  showErrorToast("validation", details)
}

export function showCreationError(itemType?: string) {
  const message = itemType ? `Error al crear ${itemType}` : undefined
  showErrorToast("creation", message)
}

export function showUpdateError(itemType?: string) {
  const message = itemType ? `Error al actualizar ${itemType}` : "Error al actualizar el elemento"
  showErrorToast("generic", message)
}

export function showDeleteError(itemType?: string) {
  const message = itemType ? `Error al eliminar ${itemType}` : "Error al eliminar el elemento"
  showErrorToast("generic", message)
}

export function showGenericError(message?: string) {
  showErrorToast("generic", message)
}