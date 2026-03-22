"use client"

import { useState } from "react"
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ErrorDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  message: string
  details?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorDialog({
  open,
  onClose,
  title = "Ha ocurrido un error",
  message,
  details,
  onRetry,
  retryLabel = "Reintentar"
}: ErrorDialogProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left mt-3">
            {message}
          </DialogDescription>
        </DialogHeader>

        {details && (
          <div className="space-y-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showDetails ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Detalles técnicos
            </button>

            {showDetails && (
              <div className="rounded-md bg-muted p-3 text-sm font-mono text-muted-foreground max-h-32 overflow-y-auto">
                {details}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {onRetry && (
              <Button onClick={onRetry}>
                {retryLabel}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for managing error dialog state
export function useErrorDialog() {
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean
    title?: string
    message: string
    details?: string
    onRetry?: () => void
    retryLabel?: string
  }>({
    open: false,
    message: "",
  })

  const showErrorDialog = (props: Omit<typeof errorDialog, "open">) => {
    setErrorDialog({ ...props, open: true })
  }

  const closeErrorDialog = () => {
    setErrorDialog(prev => ({ ...prev, open: false }))
  }

  const ErrorDialogComponent = () => (
    <ErrorDialog
      {...errorDialog}
      onClose={closeErrorDialog}
    />
  )

  return {
    showErrorDialog,
    closeErrorDialog,
    ErrorDialogComponent,
  }
}