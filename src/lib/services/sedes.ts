import { createClient } from "@/lib/supabase/client"
import type { Sede } from "@/components/sedes/types"
import { handleSupabaseError } from "@/lib/error-handler"

const supabase = createClient()

export async function getSedes(): Promise<Sede[]> {
  try {
    const { data, error } = await supabase
      .from("sede")
      .select("*")
      .order("es_principal", { ascending: false })
      .order("nombre", { ascending: true })

    if (error) {
      handleSupabaseError(error, "obtener sedes")
      return []
    }
    return data as Sede[]
  } catch (error) {
    handleSupabaseError(error, "obtener sedes")
    return []
  }
}

export async function getSede(id: string): Promise<Sede | null> {
  try {
    const { data, error } = await supabase
      .from("sede")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      handleSupabaseError(error, "obtener sede")
      return null
    }
    return data as Sede
  } catch (error) {
    handleSupabaseError(error, "obtener sede")
    return null
  }
}

export async function createSede(sede: Omit<Sede, 'id'>): Promise<Sede | null> {
  try {
    // If this is being set as principal, make sure no other sede is principal
    if (sede.es_principal) {
      await supabase
        .from("sede")
        .update({ es_principal: false })
        .eq("autoescuela_id", sede.autoescuela_id)
        .eq("es_principal", true)
    }

    const { data, error } = await supabase
      .from("sede")
      .insert(sede)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "crear sede")
      return null
    }
    return data as Sede
  } catch (error) {
    handleSupabaseError(error, "crear sede")
    return null
  }
}

export async function updateSede(id: string, updates: Partial<Omit<Sede, 'id' | 'autoescuela_id'>>): Promise<Sede | null> {
  try {
    // If this is being set as principal, make sure no other sede is principal
    if (updates.es_principal) {
      // First get the current sede to get its autoescuela_id
      const currentSede = await getSede(id)
      if (currentSede) {
        await supabase
          .from("sede")
          .update({ es_principal: false })
          .eq("autoescuela_id", currentSede.autoescuela_id)
          .eq("es_principal", true)
          .neq("id", id)
      }
    }

    const { data, error } = await supabase
      .from("sede")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "actualizar sede")
      return null
    }
    return data as Sede
  } catch (error) {
    handleSupabaseError(error, "actualizar sede")
    return null
  }
}

export async function deleteSede(id: string): Promise<boolean> {
  try {
    // Check if this is the principal sede
    const sede = await getSede(id)
    if (sede?.es_principal) {
      handleSupabaseError(new Error("No se puede eliminar la sede principal"), "eliminar sede")
      return false
    }

    const { error } = await supabase
      .from("sede")
      .delete()
      .eq("id", id)

    if (error) {
      handleSupabaseError(error, "eliminar sede")
      return false
    }
    return true
  } catch (error) {
    handleSupabaseError(error, "eliminar sede")
    return false
  }
}

// Get statistics for a sede
export async function getSedeStats(sedeId: string) {
  try {
    const [alumnosResult, profesoresResult, vehiculosResult] = await Promise.all([
      supabase.from("alumno").select("id", { count: "exact", head: true }).eq("sede_id", sedeId),
      supabase.from("profesor").select("id", { count: "exact", head: true }).eq("sede_id", sedeId),
      supabase.from("vehiculo").select("id", { count: "exact", head: true }).eq("sede_id", sedeId)
    ])

    return {
      alumnos: alumnosResult.count || 0,
      profesores: profesoresResult.count || 0,
      vehiculos: vehiculosResult.count || 0
    }
  } catch (error) {
    handleSupabaseError(error, "obtener estadísticas de sede")
    return {
      alumnos: 0,
      profesores: 0,
      vehiculos: 0
    }
  }
}