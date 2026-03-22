import { toast } from "sonner"

type ErrorType = "permission" | "creation" | "network" | "validation" | "generic"

const errorConfig = {
  permission: {
    title: "Acceso denegado",
    defaultMessage: "No tienes permisos para realizar esta acción",
  },
  creation: {
    title: "Error al crear",
    defaultMessage: "Error al crear el elemento",
  },
  network: {
    title: "Error de conexión",
    defaultMessage: "Error de conexión. Comprueba tu internet.",
  },
  validation: {
    title: "Datos no válidos",
    defaultMessage: "Los datos introducidos no son válidos",
  },
  generic: {
    title: "Error",
    defaultMessage: "Ha ocurrido un error inesperado",
  },
}

export function showError(type: ErrorType, details?: string) {
  const config = errorConfig[type]
  const message = details || config.defaultMessage

  toast.error(message, {
    description: config.title,
    duration: 6000,
    position: 'top-right',
  })
}

export function showSuccess(message: string) {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  })
}

// Utility functions for common error scenarios
export function handleSupabaseError(error: any, operation: string = "operación") {
  console.error(`Error en ${operation}:`, error)

  // Handle specific Supabase error codes
  if (error?.code === 'PGRST116') {
    showError("validation", "El elemento no existe o no tienes permisos para acceder a él")
    return
  }

  if (error?.code === '23505') {
    showError("validation", "Ya existe un registro con estos datos")
    return
  }

  if (error?.code === '42501') {
    showError("permission", "No tienes permisos suficientes para realizar esta acción")
    return
  }

  // Network-related errors
  if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
    showError("network")
    return
  }

  // Generic error fallback
  showError("generic", error?.message || `Error en ${operation}`)
}

export function handleNetworkError() {
  showError("network")
}

export function handlePermissionError(details?: string) {
  showError("permission", details)
}

export function handleValidationError(details?: string) {
  showError("validation", details)
}

export function handleCreationError(itemType: string = "elemento") {
  showError("creation", `Error al crear el ${itemType}`)
}