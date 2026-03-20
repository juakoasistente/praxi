import { useState, useRef, useEffect, useMemo } from "react"
import {
  ArrowLeft,
  Send,
  Paperclip,
  UserCircle,
  Tag,
  MoreVertical,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  type Conversacion,
  type Mensaje,
  type EstadoConversacion,
  CANAL_COLORS,
  CANAL_LABELS,
  ESTADO_CONV_LABELS,
  ESTADO_CONV_COLORS,
  PRIORIDAD_LABELS,
  PRIORIDAD_COLORS,
} from "./types"
import { MessageBubble, DateSeparator } from "./message-bubble"

function formatDateGroup(fecha: string): string {
  const d = new Date(fecha)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return "Hoy"
  if (d.toDateString() === yesterday.toDateString()) return "Ayer"
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

interface ConversationDetailProps {
  conversacion: Conversacion
  mensajes: Mensaje[]
  onBack: () => void
  onSendMessage: (conversacionId: string, contenido: string) => void
  onChangeEstado: (conversacionId: string, estado: EstadoConversacion) => void
}

export function ConversationDetail({
  conversacion,
  mensajes,
  onBack,
  onSendMessage,
  onChangeEstado,
}: ConversationDetailProps) {
  const [draft, setDraft] = useState("")
  const [showEstadoMenu, setShowEstadoMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    onSendMessage(conversacion.id, text)
    setDraft("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value)
    const ta = e.target
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px"
  }

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Mensaje[] }[] = []
    let currentDate = ""
    for (const msg of mensajes) {
      const dateStr = formatDateGroup(msg.fecha)
      if (dateStr !== currentDate) {
        currentDate = dateStr
        groups.push({ date: dateStr, messages: [msg] })
      } else {
        groups[groups.length - 1].messages.push(msg)
      }
    }
    return groups
  }, [mensajes])

  const contactInfo = conversacion.contacto_telefono
    || conversacion.contacto_email
    || conversacion.contacto_instagram
    || ""

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{conversacion.contacto_nombre}</h3>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${CANAL_COLORS[conversacion.canal]}`}>
              {CANAL_LABELS[conversacion.canal]}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">{contactInfo}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge className={`text-[10px] ${PRIORIDAD_COLORS[conversacion.prioridad]}`}>
            {PRIORIDAD_LABELS[conversacion.prioridad]}
          </Badge>

          {/* Estado dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowEstadoMenu(!showEstadoMenu)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${ESTADO_CONV_COLORS[conversacion.estado]}`}
            >
              {ESTADO_CONV_LABELS[conversacion.estado]}
            </button>
            {showEstadoMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowEstadoMenu(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border bg-popover p-1 shadow-md">
                  {(Object.keys(ESTADO_CONV_LABELS) as EstadoConversacion[]).map((est) => (
                    <button
                      key={est}
                      onClick={() => {
                        onChangeEstado(conversacion.id, est)
                        setShowEstadoMenu(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent"
                    >
                      <span className={`size-2 rounded-full ${ESTADO_CONV_COLORS[est].split(" ")[0]}`} />
                      {ESTADO_CONV_LABELS[est]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {conversacion.asignado_a && (
            <div className="hidden items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] sm:flex">
              <UserCircle className="size-3" />
              {conversacion.asignado_a}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-1">
          {groupedMessages.map((group) => (
            <div key={group.date}>
              <DateSeparator date={group.date} />
              <div className="space-y-2">
                {group.messages.map((msg) => (
                  <MessageBubble key={msg.id} mensaje={msg} />
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="border-t px-4 py-3">
        <p className="mb-2 text-center text-[10px] text-muted-foreground">
          Conexión con canales próximamente — Los mensajes se guardan localmente
        </p>
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground" disabled>
            <Paperclip className="size-4" />
          </Button>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 resize-none rounded-xl border bg-muted/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!draft.trim()}
            className="shrink-0 rounded-full"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      <MessageSquare className="mb-3 size-12 opacity-30" />
      <p className="text-sm font-medium">Selecciona una conversación</p>
      <p className="mt-1 text-xs">Elige una conversación del panel izquierdo para ver los mensajes</p>
    </div>
  )
}
