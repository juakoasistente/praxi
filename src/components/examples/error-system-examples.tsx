"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  showErrorToast,
  showSuccessToast,
  showPermissionError,
  showNetworkError,
  showValidationError,
  showCreationError
} from "@/components/ui/error-toast"
import { useErrorDialog } from "@/components/ui/error-dialog"

export function ErrorSystemExamples() {
  const { showErrorDialog, ErrorDialogComponent } = useErrorDialog()

  const handleShowPermissionError = () => {
    showPermissionError("No tienes acceso a esta sección")
  }

  const handleShowNetworkError = () => {
    showNetworkError("No se pudo conectar con el servidor")
  }

  const handleShowValidationError = () => {
    showValidationError("El email introducido no es válido")
  }

  const handleShowCreationError = () => {
    showCreationError("el alumno")
  }

  const handleShowSuccess = () => {
    showSuccessToast("Alumno creado correctamente")
  }

  const handleShowCriticalError = () => {
    showErrorDialog({
      title: "Error crítico",
      message: "No se pudo conectar con la base de datos. Por favor, contacta con soporte técnico.",
      details: "Connection timeout: database.example.com:5432\nError code: ECONNREFUSED\nStack trace: ...",
      onRetry: () => {
        console.log("Reintentando operación...")
        showSuccessToast("Reintentando...")
      },
      retryLabel: "Reintentar conexión"
    })
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Sistema de Notificaciones de Error</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Errores con Toast</h3>
          <Button onClick={handleShowPermissionError} variant="destructive">
            Error de Permisos
          </Button>
          <Button onClick={handleShowNetworkError} variant="outline">
            Error de Red
          </Button>
          <Button onClick={handleShowValidationError} variant="outline">
            Error de Validación
          </Button>
          <Button onClick={handleShowCreationError} variant="outline">
            Error de Creación
          </Button>
          <Button onClick={handleShowSuccess} variant="default">
            Éxito
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Error Crítico (Dialog)</h3>
          <Button onClick={handleShowCriticalError} variant="destructive">
            Mostrar Error Crítico
          </Button>
        </div>
      </div>

      <ErrorDialogComponent />
    </div>
  )
}