'use client'

import { Check, Building, ChevronDown } from 'lucide-react'
import { useSede } from '@/hooks/use-sede'
import { SEDE_ALL_OPTION } from '@/components/sedes/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SedeSelector() {
  const { sedes, selectedSede, setSelectedSede, getSelectedSedeData } = useSede()

  const currentSede = getSelectedSedeData()
  const displayText = selectedSede === SEDE_ALL_OPTION
    ? 'Todas las sedes'
    : currentSede?.nombre || 'Seleccionar sede'

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-full justify-between text-xs font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 h-8 px-2 bg-transparent border-none cursor-pointer rounded-md flex items-center"
        >
          <div className="flex items-center gap-2 truncate">
            <Building className="h-3 w-3 shrink-0" />
            <span className="truncate text-left">{displayText}</span>
          </div>
          <ChevronDown className="h-3 w-3 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() => setSelectedSede(SEDE_ALL_OPTION)}
            className="flex items-center justify-between"
          >
            <span>Todas las sedes</span>
            {selectedSede === SEDE_ALL_OPTION && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          {sedes.map((sede) => (
            <DropdownMenuItem
              key={sede.id}
              onClick={() => setSelectedSede(sede.id)}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span>{sede.nombre}</span>
                {sede.direccion && (
                  <span className="text-xs text-muted-foreground truncate">
                    {sede.direccion}
                  </span>
                )}
              </div>
              {selectedSede === sede.id && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}