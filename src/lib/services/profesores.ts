import { createClient } from "@/lib/supabase/client"
import type { Profesor } from "@/components/profesores/types"
import { handleSupabaseError } from "@/lib/error-handler"

const supabase = createClient()

export async function getProfesores(): Promise<Profesor[]> {
  try {
    const { data, error } = await supabase
      .from("profesor")
      .select("*")
      .order("nombre", { ascending: true })

    if (error) {
      handleSupabaseError(error, "obtener profesores")
      return []
    }
    return data as Profesor[]
  } catch (error) {
    handleSupabaseError(error, "obtener profesores")
    return []
  }
}

export async function getProfesor(id: string): Promise<Profesor | null> {
  try {
    const { data, error } = await supabase
      .from("profesor")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      handleSupabaseError(error, "obtener profesor")
      return null
    }
    return data as Profesor
  } catch (error) {
    handleSupabaseError(error, "obtener profesor")
    return null
  }
}

export async function createProfesor(
  profesor: Omit<Profesor, "id">
): Promise<Profesor | null> {
  try {
    const { data, error } = await supabase
      .from("profesor")
      .insert(profesor)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "crear profesor")
      return null
    }
    return data as Profesor
  } catch (error) {
    handleSupabaseError(error, "crear profesor")
    return null
  }
}

export async function updateProfesor(
  id: string,
  updates: Partial<Profesor>
): Promise<Profesor | null> {
  try {
    const { data, error } = await supabase
      .from("profesor")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "actualizar profesor")
      return null
    }
    return data as Profesor
  } catch (error) {
    handleSupabaseError(error, "actualizar profesor")
    return null
  }
}

export async function deleteProfesor(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("profesor").delete().eq("id", id)

    if (error) {
      handleSupabaseError(error, "eliminar profesor")
      return false
    }
    return true
  } catch (error) {
    handleSupabaseError(error, "eliminar profesor")
    return false
  }
}
