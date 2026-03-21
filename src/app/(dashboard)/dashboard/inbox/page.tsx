"use client"

import { useState, useCallback } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ConversationList } from "@/components/inbox/conversation-list"
import { ConversationDetail, EmptyState } from "@/components/inbox/conversation-detail"
import type { Conversacion, Mensaje, EstadoConversacion } from "@/components/inbox/types"

export default function InboxPage() {
  const isMobile = useIsMobile()
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [mensajes, setMensajes] = useState<Record<string, Mensaje[]>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedConv = conversaciones.find((c) => c.id === selectedId) ?? null
  const selectedMensajes = selectedId ? mensajes[selectedId] ?? [] : []

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    // Mark as read
    setConversaciones((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mensajes_no_leidos: 0 } : c))
    )
    setMensajes((prev) => {
      const msgs = prev[id]
      if (!msgs) return prev
      return {
        ...prev,
        [id]: msgs.map((m) => ({ ...m, leido: true })),
      }
    })
  }, [])

  const handleBack = useCallback(() => {
    setSelectedId(null)
  }, [])

  const handleSendMessage = useCallback((conversacionId: string, contenido: string) => {
    const newMsg: Mensaje = {
      id: `msg-local-${Date.now()}`,
      conversacion_id: conversacionId,
      contenido,
      fecha: new Date().toISOString(),
      es_entrante: false,
      leido: false,
      adjuntos: null,
    }
    setMensajes((prev) => ({
      ...prev,
      [conversacionId]: [...(prev[conversacionId] ?? []), newMsg],
    }))
    setConversaciones((prev) =>
      prev.map((c) =>
        c.id === conversacionId
          ? { ...c, ultimo_mensaje: contenido, ultimo_mensaje_fecha: newMsg.fecha }
          : c
      )
    )
  }, [])

  const handleChangeEstado = useCallback((conversacionId: string, estado: EstadoConversacion) => {
    setConversaciones((prev) =>
      prev.map((c) => (c.id === conversacionId ? { ...c, estado } : c))
    )
  }, [])

  // Mobile: show list OR detail
  if (isMobile) {
    if (selectedId && selectedConv) {
      return (
        <div className="-m-6 flex h-[calc(100vh-3.5rem)] flex-col">
          <ConversationDetail
            conversacion={selectedConv}
            mensajes={selectedMensajes}
            onBack={handleBack}
            onSendMessage={handleSendMessage}
            onChangeEstado={handleChangeEstado}
          />
        </div>
      )
    }
    return (
      <div className="-m-6 flex h-[calc(100vh-3.5rem)] flex-col">
        <ConversationList
          conversaciones={conversaciones}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>
    )
  }

  // Desktop: side by side
  return (
    <div className="-m-6 flex h-[calc(100vh-0px)] lg:-m-8 lg:h-[calc(100vh-0px)]">
      <div className="w-[380px] shrink-0">
        <ConversationList
          conversaciones={conversaciones}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>
      <div className="flex-1">
        {selectedConv ? (
          <ConversationDetail
            conversacion={selectedConv}
            mensajes={selectedMensajes}
            onBack={handleBack}
            onSendMessage={handleSendMessage}
            onChangeEstado={handleChangeEstado}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
