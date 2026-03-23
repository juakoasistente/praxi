'use client'

import { Check, Building2, ChevronDown, MapPin, Globe } from 'lucide-react'
import { useSede } from '@/hooks/use-sede'
import { SEDE_ALL_OPTION } from '@/components/sedes/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SedeSelector() {
  const { sedes, loading, selectedSede, setSelectedSede, getSelectedSedeData } = useSede()

  const currentSede = getSelectedSedeData()
  const isAll = selectedSede === SEDE_ALL_OPTION
  const displayText = loading
    ? 'Cargando sedes...'
    : isAll
    ? 'Todas las sedes'
    : currentSede?.nombre || 'Seleccionar sede'

  // Hide selector when no sedes exist
  if (!loading && sedes.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center gap-2.5 rounded-md border border-sidebar-border bg-sidebar px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors cursor-pointer outline-none">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
          {isAll ? (
            <Globe className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Building2 className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs font-medium truncate">{displayText}</p>
          {!isAll && currentSede?.direccion && (
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{currentSede.direccion}</p>
          )}
          {isAll && (
            <p className="text-[10px] text-sidebar-foreground/50">{sedes.length} sedes</p>
          )}
        </div>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={4} className="w-64 p-1.5">
        {/* All sedes option */}
        <button
          onClick={() => setSelectedSede(SEDE_ALL_OPTION)}
          className={`w-full flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors cursor-pointer ${
            isAll
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-accent text-foreground'
          }`}
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
            isAll ? 'bg-primary/20' : 'bg-muted'
          }`}>
            <Globe className="h-4 w-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">Todas las sedes</p>
            <p className="text-xs text-muted-foreground">{sedes.length} sedes activas</p>
          </div>
          {isAll && <Check className="h-4 w-4 text-primary shrink-0" />}
        </button>

        {/* Separator */}
        <div className="my-1.5 h-px bg-border" />

        {/* Individual sedes */}
        <div className="space-y-0.5">
          {sedes.map((sede) => {
            const isSelected = selectedSede === sede.id
            return (
              <button
                key={sede.id}
                onClick={() => setSelectedSede(sede.id)}
                className={`w-full flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                  isSelected ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{sede.nombre}</p>
                  {sede.direccion && (
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5 shrink-0" />
                      {sede.direccion}
                    </p>
                  )}
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                {sede.es_principal && !isSelected && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                    Principal
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
