import { createClient } from "@/lib/supabase/client"
import type { Fichaje } from "@/components/fichajes/types"

const supabase = createClient()

export async function getFichajes(): Promise<Fichaje[]> {
  const { data, error } = await supabase
    .from("fichaje")
    .select(`
      id,
      usuario:usuario_id (
        nombre,
        apellidos,
        rol
      ),
      tipo,
      timestamp,
      metodo,
      sede_id
    `)
    .order("timestamp", { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row: Record<string, unknown>) => {
    const usuario = row.usuario as {
      nombre: string
      apellidos: string
      rol: string
    } | null
    return {
      id: row.id as string,
      usuario_nombre: usuario?.nombre ?? "",
      usuario_apellidos: usuario?.apellidos ?? "",
      usuario_rol: (usuario?.rol ?? "admin") as Fichaje["usuario_rol"],
      tipo: row.tipo as Fichaje["tipo"],
      timestamp: row.timestamp as string,
      metodo: row.metodo as Fichaje["metodo"],
      sede_id: row.sede_id as string,
    }
  })
}

export async function createFichaje(fichaje: {
  usuario_id: string
  tipo: Fichaje["tipo"]
  metodo?: Fichaje["metodo"]
  sede_id: string
}): Promise<void> {
  const { error } = await supabase.from("fichaje").insert({
    usuario_id: fichaje.usuario_id,
    tipo: fichaje.tipo,
    metodo: fichaje.metodo ?? "manual",
    sede_id: fichaje.sede_id,
  })

  if (error) throw new Error(error.message)
}

export async function getUserProfile(): Promise<{
  id: string
  nombre: string
  apellidos: string
  rol: string
} | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("usuario")
    .select("id, nombre, apellidos, rol")
    .eq("id", user.id)
    .single()

  if (error) return null
  return data
}
