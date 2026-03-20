"use client"

import { useMemo } from "react"
import { type Clase, VEHICULOS, ESTADO_COLORS, ESTADO_DOT_COLORS } from "./mock-data"

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8..20

interface WeeklyCalendarProps {
  clases: Clase[]
  weekStart: Date // Monday
  onClaseClick: (clase: Clase) => void
  onSlotClick: (fecha: string, hora: string) => void
}

function getDayDates(monday: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie"]

export function WeeklyCalendar({ clases, weekStart, onClaseClick, onSlotClick }: WeeklyCalendarProps) {
  const days = useMemo(() => getDayDates(weekStart), [weekStart])

  const clasesBySlot = useMemo(() => {
    const map = new Map<string, Clase>()
    for (const c of clases) {
      const h = parseInt(c.hora_inicio.split(":")[0])
      map.set(`${c.fecha}_${h}`, c)
    }
    return map
  }, [clases])

  const today = new Date()
  const todayStr = fmtDate(today)

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <div
        className="grid min-w-[700px]"
        style={{
          gridTemplateColumns: "64px repeat(5, 1fr)",
          gridTemplateRows: `48px repeat(${HOURS.length}, 60px)`,
        }}
      >
        {/* Header: empty corner */}
        <div className="border-b border-r border-border bg-muted/50" />

        {/* Header: day columns */}
        {days.map((d, i) => {
          const isToday = fmtDate(d) === todayStr
          return (
            <div
              key={i}
              className={`border-b border-r border-border last:border-r-0 flex flex-col items-center justify-center text-sm font-medium ${
                isToday ? "bg-primary/5" : "bg-muted/50"
              }`}
            >
              <span className={isToday ? "text-primary font-semibold" : "text-muted-foreground"}>
                {DAY_NAMES[i]}
              </span>
              <span
                className={`text-xs ${
                  isToday
                    ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                    : "text-muted-foreground"
                }`}
              >
                {d.getDate()}
              </span>
            </div>
          )
        })}

        {/* Grid body */}
        {HOURS.map((hour) => (
          <>
            {/* Time label */}
            <div
              key={`t-${hour}`}
              className="border-b border-r border-border flex items-start justify-end pr-2 pt-1 text-xs text-muted-foreground bg-muted/30"
            >
              {String(hour).padStart(2, "0")}:00
            </div>

            {/* Day cells */}
            {days.map((d, dayIdx) => {
              const fecha = fmtDate(d)
              const key = `${fecha}_${hour}`
              const clase = clasesBySlot.get(key)
              const isToday = fecha === todayStr

              return (
                <div
                  key={`${dayIdx}-${hour}`}
                  className={`border-b border-r border-border last:border-r-0 p-0.5 cursor-pointer hover:bg-accent/40 transition-colors ${
                    isToday ? "bg-primary/[0.02]" : ""
                  }`}
                  onClick={() => {
                    if (clase) {
                      onClaseClick(clase)
                    } else {
                      onSlotClick(fecha, `${String(hour).padStart(2, "0")}:00`)
                    }
                  }}
                >
                  {clase && <ClaseBlock clase={clase} />}
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}

function ClaseBlock({ clase }: { clase: Clase }) {
  const vehiculo = VEHICULOS.find((v) => v.id === clase.vehiculo_id)

  return (
    <div
      className={`relative h-full rounded-md border px-1.5 py-1 text-xs leading-tight flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-md ${ESTADO_COLORS[clase.estado]}`}
    >
      <div className="font-semibold truncate">
        {clase.alumno_nombre} {clase.alumno_apellidos.split(" ")[0]}
      </div>
      <div className="flex items-center justify-between gap-1 mt-auto">
        <span className="opacity-80">
          {clase.hora_inicio}–{clase.hora_fin}
        </span>
        {vehiculo && (
          <span className="truncate opacity-70">{vehiculo.matricula}</span>
        )}
      </div>
      <div className={`w-1.5 h-1.5 rounded-full absolute top-1 right-1 ${ESTADO_DOT_COLORS[clase.estado]}`} />
    </div>
  )
}
