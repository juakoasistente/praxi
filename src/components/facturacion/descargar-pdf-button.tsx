"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import type { Factura } from "./types"

interface DescargarPdfButtonProps {
  factura: Factura
}

export function DescargarPdfButton({ factura }: DescargarPdfButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      // Dynamic import to avoid SSR issues with react-pdf
      const { pdf } = await import("@react-pdf/renderer")
      const { FacturaPdf } = await import("./factura-pdf")

      const blob = await pdf(<FacturaPdf factura={factura} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${factura.numero}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al generar PDF:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="flex-1"
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {loading ? "Generando..." : "Descargar PDF"}
    </Button>
  )
}
