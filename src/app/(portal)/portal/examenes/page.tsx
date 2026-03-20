'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_EXAMENES } from '@/components/examenes/mock-data'
import {
  TIPO_LABELS,
  RESULTADO_LABELS,
  RESULTADO_COLORS,
} from '@/components/examenes/types'

const STUDENT_ID = '1'

export default function PortalExamenesPage() {
  const examenes = MOCK_EXAMENES.filter(
    (e) => e.alumno_id === STUDENT_ID
  ).sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Mis exámenes</h1>
        <p className="text-sm text-muted-foreground">
          Historial de convocatorias
        </p>
      </div>

      <div className="space-y-3">
        {examenes.map((examen) => (
          <Card key={examen.id}>
            <CardContent className="flex items-start justify-between gap-3 pt-4">
              <div className="space-y-1 text-sm">
                <p className="font-medium">{TIPO_LABELS[examen.tipo]}</p>
                <p className="text-muted-foreground">
                  {new Date(examen.fecha + 'T00:00:00').toLocaleDateString(
                    'es-ES',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }
                  )}
                  {examen.hora && ` — ${examen.hora}`}
                </p>
                {examen.convocatoria && (
                  <p className="text-xs text-muted-foreground">
                    {examen.convocatoria}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Intento {examen.intento}
                </p>
              </div>
              <Badge className={RESULTADO_COLORS[examen.resultado]}>
                {RESULTADO_LABELS[examen.resultado]}
              </Badge>
            </CardContent>
          </Card>
        ))}

        {examenes.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tienes exámenes registrados
          </p>
        )}
      </div>
    </div>
  )
}
