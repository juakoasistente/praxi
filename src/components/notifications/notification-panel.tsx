"use client"

import {
  Bell,
  Calendar,
  ClipboardCheck,
  Receipt,
  ShieldCheck,
} from "lucide-react"
import type { Notificacion, TipoNotificacion } from "./types"

const ICONOS: Record<TipoNotificacion, React.ComponentType<{ className?: string }>> = {
  examen: ClipboardCheck,
  factura: Receipt,
  itv: ShieldCheck,
  clase: Calendar,
  general: Bell,
}

function tiempoRelativo(fecha: string): string {
  const ahora = new Date(2026, 2, 20, 14, 0, 0) // viernes 20 marzo 14:00
  const d = new Date(fecha)
  const diffMs = ahora.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMin / 60)
  const diffDias = Math.floor(diffHoras / 24)

  if (diffMin < 1) return "Ahora"
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHoras < 24) return `Hace ${diffHoras} h`
  if (diffDias === 1) return "Ayer"
  if (diffDias < 7) return `Hace ${diffDias} días`
  return `Hace ${Math.floor(diffDias / 7)} semanas`
}

function agrupar(notificaciones: Notificacion[]) {
  const hoy = new Date(2026, 2, 20)
  const ayer = new Date(2026, 2, 19)

  const grupos: { label: string; items: Notificacion[] }[] = [
    { label: "Hoy", items: [] },
    { label: "Ayer", items: [] },
    { label: "Anteriores", items: [] },
  ]

  for (const n of notificaciones) {
    const d = new Date(n.fecha)
    if (d.toDateString() === hoy.toDateString()) {
      grupos[0].items.push(n)
    } else if (d.toDateString() === ayer.toDateString()) {
      grupos[1].items.push(n)
    } else {
      grupos[2].items.push(n)
    }
  }

  return grupos.filter((g) => g.items.length > 0)
}

export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
}: {
  notifications: Notificacion[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onNavigate?: (enlace: string) => void
}) {
  const grupos = agrupar(notifications)
  const hayNoLeidas = notifications.some((n) => !n.leida)

  return (
    <div className="w-80 sm:w-96 max-h-[70vh] flex flex-col rounded-lg border bg-popover text-popover-foreground shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Notificaciones</h3>
        {hayNoLeidas && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-primary hover:underline"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Bell className="mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">No hay notificaciones</p>
          </div>
        ) : (
          grupos.map((grupo) => (
            <div key={grupo.label}>
              <p className="bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                {grupo.label}
              </p>
              {grupo.items.map((n) => {
                const Icono = ICONOS[n.tipo]
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!n.leida) onMarkAsRead(n.id)
                      if (n.enlace && onNavigate) onNavigate(n.enlace)
                    }}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
                      n.prioridad === "alta" ? "border-l-2 border-l-destructive" : ""
                    } ${!n.leida ? "bg-accent/20" : ""}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <Icono className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-tight ${
                          !n.leida ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {n.titulo}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.descripcion}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">
                        {tiempoRelativo(n.fecha)}
                      </p>
                    </div>
                    {!n.leida && (
                      <div className="mt-1.5 shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
