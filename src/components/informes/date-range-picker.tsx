"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface DateRange {
  from: string
  to: string
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

function getPresets(): { label: string; range: DateRange }[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const firstOfMonth = new Date(year, month, 1).toISOString().split("T")[0]
  const todayStr = today.toISOString().split("T")[0]

  const firstOfLastMonth = new Date(year, month - 1, 1).toISOString().split("T")[0]
  const lastOfLastMonth = new Date(year, month, 0).toISOString().split("T")[0]

  const quarterStart = new Date(year, month - 3, 1).toISOString().split("T")[0]

  const yearStart = new Date(year, 0, 1).toISOString().split("T")[0]

  return [
    { label: "Este mes", range: { from: firstOfMonth, to: todayStr } },
    { label: "Último mes", range: { from: firstOfLastMonth, to: lastOfLastMonth } },
    { label: "Último trimestre", range: { from: quarterStart, to: todayStr } },
    { label: "Este año", range: { from: yearStart, to: todayStr } },
  ]
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const presets = React.useMemo(() => getPresets(), [])

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Desde</Label>
        <Input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="w-40"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Hasta</Label>
        <Input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="w-40"
        />
      </div>
      <div className="flex gap-1 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => onChange(preset.range)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
