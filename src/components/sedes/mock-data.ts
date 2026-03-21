import type { Sede } from "./types"

export const MOCK_SEDES: Sede[] = [
  {
    id: "1",
    autoescuela_id: "1",
    nombre: "Sede Central - Gran Vía",
    direccion: "Gran Vía 42, 28013 Madrid",
    telefono: "91 234 56 78",
    email: "central@autoescuela.com",
    es_principal: true,
    activa: true,
  },
  {
    id: "2",
    autoescuela_id: "1",
    nombre: "Sede Chamberí",
    direccion: "Calle Santa Engracia 125, 28003 Madrid",
    telefono: "91 345 67 89",
    email: "chamberi@autoescuela.com",
    es_principal: false,
    activa: true,
  },
  {
    id: "3",
    autoescuela_id: "1",
    nombre: "Sede Getafe",
    direccion: "Calle Madrid 15, 28901 Getafe",
    telefono: "91 456 78 90",
    email: "getafe@autoescuela.com",
    es_principal: false,
    activa: true,
  },
]