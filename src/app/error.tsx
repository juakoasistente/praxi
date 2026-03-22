'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error page:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <AlertTriangle className="size-20 text-destructive mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">¡Ups!</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Ha ocurrido un error
        </h2>
        <p className="text-muted-foreground mb-8">
          Algo salió mal. Por favor, inténtalo de nuevo.
          Si el problema persiste, contacta con soporte técnico.
        </p>
        {error.message && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground font-mono">
              {error.message}
            </p>
          </div>
        )}
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Intentar de nuevo
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/dashboard'}
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}