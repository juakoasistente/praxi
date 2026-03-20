import { createClient } from "@/lib/supabase/client"

export interface Autoescuela {
  id: string
  nombre: string
  direccion: string | null
  telefono: string | null
  email: string | null
  cif: string | null
}

export interface Usuario {
  id: string
  nombre: string
  apellidos: string
  email: string
  rol: "admin" | "profesor" | "secretario"
  activo: boolean
}

const MOCK_AUTOESCUELA: Autoescuela = {
  id: "1",
  nombre: "Autoescuela Praxi",
  direccion: "C/ Gran Vía 42, 28013 Madrid",
  telefono: "912 345 678",
  email: "info@autoescuelapraxi.es",
  cif: "B12345678",
}

const MOCK_USUARIOS: Usuario[] = [
  { id: "1", nombre: "Miguel", apellidos: "Santos Rivas", email: "miguel@praxi.es", rol: "admin", activo: true },
  { id: "2", nombre: "Carlos", apellidos: "Ruiz López", email: "carlos@praxi.es", rol: "profesor", activo: true },
  { id: "3", nombre: "Laura", apellidos: "Martín García", email: "laura@praxi.es", rol: "profesor", activo: true },
  { id: "4", nombre: "Ana", apellidos: "López Fernández", email: "ana@praxi.es", rol: "secretario", activo: true },
  { id: "5", nombre: "Pedro", apellidos: "García Ruiz", email: "pedro@praxi.es", rol: "profesor", activo: false },
]

export async function getAutoescuela(): Promise<Autoescuela> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("autoescuela")
      .select("*")
      .single()

    if (error) throw error
    return data as Autoescuela
  } catch {
    return MOCK_AUTOESCUELA
  }
}

export async function updateAutoescuela(
  id: string,
  updates: Partial<Omit<Autoescuela, "id">>
): Promise<Autoescuela> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("autoescuela")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Autoescuela
  } catch {
    return { ...MOCK_AUTOESCUELA, ...updates }
  }
}

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("usuario")
      .select("id, nombre, apellidos, email, rol, activo")
      .order("nombre")

    if (error) throw error
    return data as Usuario[]
  } catch {
    return MOCK_USUARIOS
  }
}
