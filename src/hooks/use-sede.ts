'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { MOCK_SEDES } from '@/components/sedes/mock-data'
import { SEDE_ALL_OPTION } from '@/components/sedes/types'
import type { Sede } from '@/components/sedes/types'

interface SedeContextType {
  sedes: Sede[]
  selectedSede: string // sede id or "todas"
  setSelectedSede: (sedeId: string) => void
  getSelectedSedeData: () => Sede | null
}

const SedeContext = createContext<SedeContextType | undefined>(undefined)

const STORAGE_KEY = 'selected-sede'

interface SedeProviderProps {
  children: ReactNode
}

export function SedeProvider({ children }: SedeProviderProps) {
  const [selectedSede, setSelectedSedeState] = useState<string>(SEDE_ALL_OPTION)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (stored === SEDE_ALL_OPTION || MOCK_SEDES.find(s => s.id === stored))) {
      setSelectedSedeState(stored)
    }
    setMounted(true)
  }, [])

  const setSelectedSede = (sedeId: string) => {
    setSelectedSedeState(sedeId)
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, sedeId)
    }
  }

  const getSelectedSedeData = (): Sede | null => {
    if (selectedSede === SEDE_ALL_OPTION) return null
    return MOCK_SEDES.find(s => s.id === selectedSede) || null
  }

  const contextValue: SedeContextType = {
    sedes: MOCK_SEDES,
    selectedSede,
    setSelectedSede,
    getSelectedSedeData,
  }

  return React.createElement(
    SedeContext.Provider,
    { value: contextValue },
    children
  )
}

export function useSede() {
  const context = useContext(SedeContext)
  if (context === undefined) {
    throw new Error('useSede must be used within a SedeProvider')
  }
  return context
}