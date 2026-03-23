'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getSedes } from '@/lib/services/sedes'
import { SEDE_ALL_OPTION } from '@/components/sedes/types'
import type { Sede } from '@/components/sedes/types'

interface SedeContextType {
  sedes: Sede[]
  loading: boolean
  selectedSede: string // sede id or "todas"
  setSelectedSede: (sedeId: string) => void
  getSelectedSedeData: () => Sede | null
  refreshSedes: () => Promise<void>
}

const SedeContext = createContext<SedeContextType | undefined>(undefined)

const STORAGE_KEY = 'selected-sede'

interface SedeProviderProps {
  children: ReactNode
}

export function SedeProvider({ children }: SedeProviderProps) {
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSede, setSelectedSedeState] = useState<string>(SEDE_ALL_OPTION)
  const [mounted, setMounted] = useState(false)

  const loadSedes = async () => {
    try {
      setLoading(true)
      const data = await getSedes()
      setSedes(data)
    } catch (error) {
      console.error('Error loading sedes:', error)
      setSedes([])
    } finally {
      setLoading(false)
    }
  }

  // Load sedes on mount
  useEffect(() => {
    loadSedes()
  }, [])

  // Load selected sede from localStorage after sedes are loaded
  useEffect(() => {
    if (!loading && sedes.length > 0) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && (stored === SEDE_ALL_OPTION || sedes.find(s => s.id === stored))) {
        setSelectedSedeState(stored)
      }
      setMounted(true)
    }
  }, [loading, sedes])

  const setSelectedSede = (sedeId: string) => {
    setSelectedSedeState(sedeId)
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, sedeId)
    }
  }

  const getSelectedSedeData = (): Sede | null => {
    if (selectedSede === SEDE_ALL_OPTION) return null
    return sedes.find(s => s.id === selectedSede) || null
  }

  const refreshSedes = async () => {
    await loadSedes()
  }

  const contextValue: SedeContextType = {
    sedes,
    loading,
    selectedSede,
    setSelectedSede,
    getSelectedSedeData,
    refreshSedes,
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