'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_FACTURAS, MOCK_PAGOS } from '@/components/facturacion/mock-data'
import {
  ESTADO_FACTURA_LABELS,
  ESTADO_FACTURA_COLORS,
} from '@/components/facturacion/types'

const STUDENT_ID = '1'

export default function PortalPagosPage() {
  const facturas = MOCK_FACTURAS.filter(
    (f) => f.alumno_id === STUDENT_ID
  ).sort((a, b) => b.fecha_emision.localeCompare(a.fecha_emision))

  const totalPendiente = facturas
    .filter((f) => f.estado === 'pendiente' || f.estado === 'parcial' || f.estado === 'vencida')
    .reduce((sum, f) => {
      const pagado = MOCK_PAGOS.filter((p) => p.factura_id === f.id).reduce(
        (s, p) => s + p.importe,
        0
      )
      return sum + (f.total - pagado)
    }, 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Mis pagos</h1>
        <p className="text-sm text-muted-foreground">
          Facturas y estado de pagos
        </p>
      </div>

      {totalPendiente > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
              Saldo pendiente
            </p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
              {totalPendiente.toFixed(2)} €
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {facturas.map((factura) => {
          const pagos = MOCK_PAGOS.filter((p) => p.factura_id === factura.id)
          const pagado = pagos.reduce((s, p) => s + p.importe, 0)
          const saldoPendiente = factura.total - pagado

          return (
            <Card key={factura.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{factura.numero}</p>
                    <p className="text-muted-foreground">
                      {new Date(
                        factura.fecha_emision + 'T00:00:00'
                      ).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge className={ESTADO_FACTURA_COLORS[factura.estado]}>
                    {ESTADO_FACTURA_LABELS[factura.estado]}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1 border-t pt-3">
                  {factura.lineas.map((linea) => (
                    <div
                      key={linea.id}
                      className="flex justify-between text-xs text-muted-foreground"
                    >
                      <span>{linea.descripcion}</span>
                      <span>{linea.subtotal.toFixed(2)} €</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 text-sm font-medium">
                    <span>Total</span>
                    <span>{factura.total.toFixed(2)} €</span>
                  </div>
                  {saldoPendiente > 0 &&
                    factura.estado !== 'anulada' && (
                      <div className="flex justify-between text-xs text-amber-600 dark:text-amber-400">
                        <span>Pendiente</span>
                        <span>{saldoPendiente.toFixed(2)} €</span>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {facturas.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tienes facturas registradas
          </p>
        )}
      </div>
    </div>
  )
}
