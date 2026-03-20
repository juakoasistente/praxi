'use client'

import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    setOnline(navigator.onLine)

    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="flex items-center gap-2 bg-amber-500 px-4 py-1.5 text-xs font-medium text-white">
      <WifiOff className="size-3.5" />
      Sin conexión — Los datos pueden no estar actualizados
    </div>
  )
}
