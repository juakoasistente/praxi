"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, CheckCircle } from "lucide-react"
import { FirmaPad } from "./firma-pad"
import type { Contrato } from "./types"
import { ESTADO_LABELS, ESTADO_COLORS } from "./types"

interface ContratoPreviewProps {
  contrato: Contrato
  onFirmar?: (firmaDataUrl: string) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

export function ContratoPreview({ contrato, onFirmar }: ContratoPreviewProps) {
  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{contrato.alumno_nombre}</h3>
          <p className="text-sm text-muted-foreground">
            Permiso {contrato.tipo_permiso} · Creado el {formatDate(contrato.fecha_creacion)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`border-0 ${ESTADO_COLORS[contrato.estado]}`}>
            {ESTADO_LABELS[contrato.estado]}
          </Badge>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="size-4" data-icon="inline-start" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Amounts summary */}
      <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
        <div>
          <p className="text-xs text-muted-foreground">Matrícula</p>
          <p className="text-sm font-semibold">{formatCurrency(contrato.importe_matricula)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Clases</p>
          <p className="text-sm font-semibold">{formatCurrency(contrato.importe_clases)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-primary">{formatCurrency(contrato.total)}</p>
        </div>
      </div>

      {/* Contract text */}
      <div
        className="rounded-lg border bg-white p-6 text-black print:border-0 print:p-0"
        dangerouslySetInnerHTML={{ __html: contrato.contenido }}
      />

      {/* Signature area */}
      <div className="rounded-lg border p-6 print:break-before-page">
        <h4 className="text-sm font-semibold mb-4">Firma del alumno/a</h4>
        {contrato.estado === "firmado" && contrato.firma_alumno ? (
          <div className="space-y-2">
            <div className="rounded-lg border bg-white p-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={contrato.firma_alumno}
                alt="Firma del alumno"
                className="max-h-32"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="size-4" />
              Firmado el {contrato.fecha_firma ? formatDate(contrato.fecha_firma) : "—"}
            </div>
          </div>
        ) : contrato.estado === "enviado" && onFirmar ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Dibuje su firma en el recuadro inferior para firmar el contrato.
            </p>
            <FirmaPad onSave={onFirmar} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {contrato.estado === "borrador"
              ? "El contrato debe enviarse al alumno antes de poder firmarlo."
              : contrato.estado === "cancelado"
                ? "Este contrato ha sido cancelado."
                : "Pendiente de firma."}
          </p>
        )}
      </div>
    </div>
  )
}
