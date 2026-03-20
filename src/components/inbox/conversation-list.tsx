import { Search, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  type Conversacion,
  type CanalMensaje,
  type EstadoConversacion,
  CANAL_COLORS,
  CANAL_LABELS,
  ESTADO_CONV_COLORS,
  ESTADO_CONV_LABELS,
} from "./types"
import { useMemo, useState } from "react"

function formatTimeAgo(fecha: string): string {
  const now = new Date()
  const d = new Date(fecha)
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "Ahora"
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHrs < 24) return `Hace ${diffHrs}h`
  if (diffDays === 1) {
    return `Ayer ${d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
  }
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function CanalIcon({ canal }: { canal: CanalMensaje }) {
  const labels: Record<CanalMensaje, string> = {
    whatsapp: "WA",
    instagram: "IG",
    email: "EM",
  }
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${CANAL_COLORS[canal]}`}>
      {labels[canal]}
    </span>
  )
}

interface ConversationListProps {
  conversaciones: Conversacion[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversaciones, selectedId, onSelect }: ConversationListProps) {
  const [search, setSearch] = useState("")
  const [canalFilter, setCanalFilter] = useState<CanalMensaje | "todos">("todos")
  const [estadoFilter, setEstadoFilter] = useState<EstadoConversacion | "todos">("todos")

  const totalUnread = conversaciones.reduce((s, c) => s + c.mensajes_no_leidos, 0)
  const countByCanal = useMemo(() => {
    const counts = { whatsapp: 0, instagram: 0, email: 0 }
    conversaciones.forEach((c) => counts[c.canal]++)
    return counts
  }, [conversaciones])

  const filtered = useMemo(() => {
    return conversaciones
      .filter((c) => {
        if (canalFilter !== "todos" && c.canal !== canalFilter) return false
        if (estadoFilter !== "todos" && c.estado !== estadoFilter) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            c.contacto_nombre.toLowerCase().includes(q) ||
            c.ultimo_mensaje.toLowerCase().includes(q) ||
            c.etiquetas.some((e) => e.toLowerCase().includes(q))
          )
        }
        return true
      })
      .sort((a, b) => new Date(b.ultimo_mensaje_fecha).getTime() - new Date(a.ultimo_mensaje_fecha).getTime())
  }, [conversaciones, canalFilter, estadoFilter, search])

  const canalTabs: { value: CanalMensaje | "todos"; label: string; count?: number }[] = [
    { value: "todos", label: "Todos", count: conversaciones.length },
    { value: "whatsapp", label: "WhatsApp", count: countByCanal.whatsapp },
    { value: "instagram", label: "Instagram", count: countByCanal.instagram },
    { value: "email", label: "Email", count: countByCanal.email },
  ]

  return (
    <div className="flex h-full flex-col border-r">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <MessageSquare className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">Inbox</h2>
        {totalUnread > 0 && (
          <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-[10px]">
            {totalUnread}
          </Badge>
        )}
      </div>

      {/* Canal filter tabs */}
      <div className="flex gap-1 border-b px-3 py-2">
        {canalTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCanalFilter(tab.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              canalFilter === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 opacity-70">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search + estado filter */}
      <div className="flex gap-2 border-b px-3 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar conversación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value as EstadoConversacion | "todos")}
          className="h-8 rounded-md border bg-background px-2 text-xs"
        >
          <option value="todos">Estado</option>
          {(Object.keys(ESTADO_CONV_LABELS) as EstadoConversacion[]).map((e) => (
            <option key={e} value={e}>{ESTADO_CONV_LABELS[e]}</option>
          ))}
        </select>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageSquare className="mb-2 size-8 opacity-40" />
            <p className="text-sm">No se encontraron conversaciones</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = conv.id === selectedId
            const hasUnread = conv.mensajes_no_leidos > 0
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`flex w-full gap-3 border-b px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? "bg-accent"
                    : "hover:bg-muted/50"
                }`}
              >
                {/* Canal icon + estado dot */}
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <CanalIcon canal={conv.canal} />
                  <span className={`size-2 rounded-full ${ESTADO_CONV_COLORS[conv.estado].split(" ")[0]}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${hasUnread ? "font-bold" : "font-medium"}`}>
                      {conv.contacto_nombre}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatTimeAgo(conv.ultimo_mensaje_fecha)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`truncate text-xs ${hasUnread ? "text-foreground" : "text-muted-foreground"}`}>
                      {conv.ultimo_mensaje}
                    </p>
                    {hasUnread && (
                      <Badge variant="destructive" className="shrink-0 px-1.5 py-0 text-[10px]">
                        {conv.mensajes_no_leidos}
                      </Badge>
                    )}
                  </div>
                  {conv.etiquetas.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {conv.etiquetas.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
