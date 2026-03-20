"use client"

interface DocumentoChecklistProps {
  documentos: string[]
  entregados: string[]
  onChange?: (entregados: string[]) => void
  readonly?: boolean
}

export function DocumentoChecklist({ documentos, entregados, onChange, readonly }: DocumentoChecklistProps) {
  const completados = entregados.length
  const total = documentos.length
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0

  function toggleDocumento(doc: string) {
    if (readonly || !onChange) return
    if (entregados.includes(doc)) {
      onChange(entregados.filter((d) => d !== doc))
    } else {
      onChange([...entregados, doc])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Documentación</span>
        <span className="font-medium">
          {completados}/{total} ({porcentaje}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <div className="space-y-1">
        {documentos.map((doc) => {
          const checked = entregados.includes(doc)
          return (
            <button
              key={doc}
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50 text-left"
              onClick={() => toggleDocumento(doc)}
              disabled={readonly}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded border text-xs">
                {checked ? "✅" : ""}
              </span>
              <span className={checked ? "text-muted-foreground line-through" : ""}>
                {doc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
