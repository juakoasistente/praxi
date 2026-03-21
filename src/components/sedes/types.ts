export interface Sede {
  id: string
  autoescuela_id: string
  nombre: string
  direccion: string | null
  telefono: string | null
  email: string | null
  es_principal: boolean
  activa: boolean
}

export const SEDE_ALL_OPTION = "todas"