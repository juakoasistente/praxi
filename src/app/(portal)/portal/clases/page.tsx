'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MOCK_CLASES,
  VEHICULOS,
  PROFESORES_CLASES,
  ESTADO_LABELS,
  ESTADO_COLORS,
} from '@/components/clases/mock-data'

const STUDENT_ID = '1'

export default function PortalClasesPage() {
  const clases = MOCK_CLASES.filter((c) => c.alumno_id === STUDENT_ID).sort(
    (a, b) =>
      `${b.fecha}${b.hora_inicio}`.localeCompare(`${a.fecha}${a.hora_inicio}`)
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Mis clases</h1>
        <p className="text-sm text-muted-foreground">
          {clases.length} clases en total
        </p>
      </div>

      <div className="space-y-3">
        {clases.map((clase) => {
          const profesor = PROFESORES_CLASES.find(
            (p) => p.id === clase.profesor_id
          )
          const vehiculo = VEHICULOS.find((v) => v.id === clase.vehiculo_id)

          return (
            <Card key={clase.id}>
              <CardContent className="flex items-start justify-between gap-3 pt-4">
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {new Date(clase.fecha + 'T00:00:00').toLocaleDateString(
                      'es-ES',
                      {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      }
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {clase.hora_inicio} – {clase.hora_fin}
                  </p>
                  {profesor && (
                    <p className="text-muted-foreground">
                      Prof. {profesor.nombre} {profesor.apellidos}
                    </p>
                  )}
                  {vehiculo && (
                    <p className="text-xs text-muted-foreground">
                      {vehiculo.modelo} ({vehiculo.matricula})
                    </p>
                  )}
                </div>
                <Badge className={ESTADO_COLORS[clase.estado]}>
                  {ESTADO_LABELS[clase.estado]}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
