import { FileText, ImageIcon, Check, CheckCheck } from "lucide-react"
import type { Mensaje } from "./types"

function formatTime(fecha: string): string {
  const d = new Date(fecha)
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

export function MessageBubble({ mensaje }: { mensaje: Mensaje }) {
  const isIncoming = mensaje.es_entrante

  return (
    <div className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isIncoming
            ? "rounded-tl-sm bg-muted text-foreground"
            : "rounded-tr-sm bg-primary text-primary-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{mensaje.contenido}</p>

        {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
          <div className="mt-2 flex flex-col gap-1.5">
            {mensaje.adjuntos.map((adj) => (
              <div
                key={adj.nombre}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                  isIncoming
                    ? "bg-background/50"
                    : "bg-primary-foreground/10"
                }`}
              >
                {adj.tipo.startsWith("image/") ? (
                  <ImageIcon className="size-4 shrink-0" />
                ) : (
                  <FileText className="size-4 shrink-0" />
                )}
                <span className="truncate">{adj.nombre}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] ${
            isIncoming ? "text-muted-foreground" : "text-primary-foreground/70"
          }`}
        >
          <span>{formatTime(mensaje.fecha)}</span>
          {!isIncoming && (
            mensaje.leido ? (
              <CheckCheck className="size-3.5" />
            ) : (
              <Check className="size-3.5" />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-muted-foreground">{date}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
