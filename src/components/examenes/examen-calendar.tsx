"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Examen } from "./types"
import type { ResultadoExamen } from "./types"

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

const RESULTADO_DOT_COLORS: Record<ResultadoExamen, string> = {
  aprobado: "bg-green-500",
  suspendido: "bg-red-500",
  pendiente: "bg-blue-500",
  no_presentado: "bg-gray-400",
}

interface ExamenCalendarProps {
  exams: Examen[]
  onExamClick: (examen: Examen) => void
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  // Convert Sunday=0 to Monday-based (Mon=0, Sun=6)
  return day === 0 ? 6 : day - 1
}

export function ExamenCalendar({ exams, onExamClick }: ExamenCalendarProps) {
  const today = new Date()
  const [year, setYear] = React.useState(today.getFullYear())
  const [month, setMonth] = React.useState(today.getMonth())
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Group exams by day for this month
  const examsByDay = React.useMemo(() => {
    const map: Record<number, Examen[]> = {}
    exams.forEach((e) => {
      const d = new Date(e.fecha)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(e)
      }
    })
    return map
  }, [exams, year, month])

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
    setSelectedDay(null)
  }

  const todayDay =
    today.getFullYear() === year && today.getMonth() === month
      ? today.getDate()
      : null

  const selectedExams = selectedDay ? examsByDay[selectedDay] ?? [] : []

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {MONTH_NAMES[month]} {year}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[72px] border-b border-r p-1" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayExams = examsByDay[day] ?? []
            const isToday = day === todayDay
            const isSelected = day === selectedDay

            return (
              <div
                key={day}
                className={`min-h-[72px] border-b border-r p-1 cursor-pointer transition-colors hover:bg-muted/50 ${
                  isSelected ? "bg-primary/10" : ""
                }`}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
              >
                <span
                  className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  {day}
                </span>
                {dayExams.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {dayExams.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={`size-2 rounded-full ${RESULTADO_DOT_COLORS[e.resultado]}`}
                        title={`${e.alumno_nombre} - ${e.tipo}`}
                      />
                    ))}
                    {dayExams.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{dayExams.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day exams */}
      {selectedDay !== null && (
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold mb-3">
            {selectedDay} de {MONTH_NAMES[month]} {year}
            {selectedExams.length > 0 && (
              <span className="text-muted-foreground font-normal ml-2">
                ({selectedExams.length} examen{selectedExams.length !== 1 ? "es" : ""})
              </span>
            )}
          </h3>
          {selectedExams.length > 0 ? (
            <div className="space-y-2">
              {selectedExams.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onExamClick(e)}
                >
                  <span
                    className={`size-2.5 rounded-full shrink-0 ${RESULTADO_DOT_COLORS[e.resultado]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {e.alumno_nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.tipo === "teorico" ? "Teórico" : "Práctico"}
                      {e.hora ? ` · ${e.hora}` : ""}
                      {e.centro_examen ? ` · ${e.centro_examen}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    Intento {e.intento}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay exámenes programados para este día.
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-500" /> Aprobado
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-red-500" /> Suspendido
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-blue-500" /> Pendiente
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-gray-400" /> No presentado
        </div>
      </div>
    </div>
  )
}
