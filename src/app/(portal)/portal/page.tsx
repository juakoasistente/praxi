'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_ALUMNOS } from '@/components/alumnos/mock-data'
import { ESTADO_LABELS, ESTADO_COLORS } from '@/components/alumnos/types'
import { MOCK_CLASES, VEHICULOS, PROFESORES_CLASES } from '@/components/clases/mock-data'
import { BookOpen, GraduationCap, Calendar } from 'lucide-react'

const STUDENT_ID = '1'

const ESTADO_PROGRESS: Record<string, number> = {
  matriculado: 10,
  en_curso: 40,
  teorico_aprobado: 60,
  practico_aprobado: 85,
  completado: 100,
  baja: 0,
}

export default function PortalPage() {
  const alumno = MOCK_ALUMNOS.find((a) => a.id === STUDENT_ID)!
  const clases = MOCK_CLASES.filter((c) => c.alumno_id === STUDENT_ID)
  const completadas = clases.filter((c) => c.estado === 'completada').length

  const proxima = clases
    .filter((c) => c.estado === 'programada')
    .sort((a, b) => `${a.fecha}${a.hora_inicio}`.localeCompare(`${b.fecha}${b.hora_inicio}`))[0]

  const profesor = proxima
    ? PROFESORES_CLASES.find((p) => p.id === proxima.profesor_id)
    : null
  const vehiculo = proxima
    ? VEHICULOS.find((v) => v.id === proxima.vehiculo_id)
    : null

  const progress = ESTADO_PROGRESS[alumno.estado] ?? 0

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">
          ¡Hola, {alumno.nombre}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Aquí tienes un resumen de tu progreso
        </p>
      </div>

      {/* Progress card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="size-5" />
            Mi progreso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={ESTADO_COLORS[alumno.estado]}>
              {ESTADO_LABELS[alumno.estado]}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground">
              Permiso {alumno.permiso}
            </span>
          </div>
          <div className="space-y-1">
            <div className="h-2.5 w-full rounded-full bg-muted">
              <div
                className="h-2.5 rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {progress}%
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {/* Permiso */}
        <Card>
          <CardContent className="pt-5">
            <p className="text-2xl font-bold">{alumno.permiso}</p>
            <p className="text-xs text-muted-foreground">Permiso</p>
          </CardContent>
        </Card>

        {/* Clases realizadas */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-muted-foreground" />
              <p className="text-2xl font-bold">{completadas}</p>
            </div>
            <p className="text-xs text-muted-foreground">Clases realizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Next class */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-5" />
            Próxima clase
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proxima ? (
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {new Date(proxima.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
              <p className="text-muted-foreground">
                {proxima.hora_inicio} – {proxima.hora_fin}
              </p>
              {profesor && (
                <p className="text-muted-foreground">
                  Prof. {profesor.nombre} {profesor.apellidos}
                </p>
              )}
              {vehiculo && (
                <p className="text-muted-foreground">
                  {vehiculo.modelo} ({vehiculo.matricula})
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No tienes clases programadas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
