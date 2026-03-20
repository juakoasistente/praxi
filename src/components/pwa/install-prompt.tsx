'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('praxi-install-dismissed')) return

    setDismissed(false)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (dismissed || !deferredPrompt) return null

  const handleInstall = async () => {
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
    setDismissed(true)
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('praxi-install-dismissed', '1')
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl border bg-background p-4 shadow-lg md:left-auto md:right-6 md:max-w-sm">
      <div className="flex-1">
        <p className="text-sm font-medium">Instalar Praxi</p>
        <p className="text-xs text-muted-foreground">
          Accede más rápido desde tu pantalla de inicio
        </p>
      </div>
      <Button size="sm" onClick={handleInstall}>
        <Download className="mr-1.5 size-4" />
        Instalar
      </Button>
      <button
        onClick={handleDismiss}
        className="rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
