import { createClient } from "@/lib/supabase/client"
import type { Alumno } from "@/components/alumnos/types"
import { handleSupabaseError } from "@/lib/error-handler"

const supabase = createClient()

export async function getAlumnos(): Promise<Alumno[]> {
  try {
    const { data, error } = await supabase
      .from("alumno")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      handleSupabaseError(error, "obtener alumnos")
      return []
    }
    return data as Alumno[]
  } catch (error) {
    handleSupabaseError(error, "obtener alumnos")
    return []
  }
}

export async function getAlumno(id: string): Promise<Alumno | null> {
  try {
    const { data, error } = await supabase
      .from("alumno")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      handleSupabaseError(error, "obtener alumno")
      return null
    }
    return data as Alumno
  } catch (error) {
    handleSupabaseError(error, "obtener alumno")
    return null
  }
}

export async function createAlumno(
  alumno: Omit<Alumno, "id">
): Promise<Alumno | null> {
  try {
    const { data, error } = await supabase
      .from("alumno")
      .insert(alumno)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "crear alumno")
      return null
    }
    return data as Alumno
  } catch (error) {
    handleSupabaseError(error, "crear alumno")
    return null
  }
}

export async function updateAlumno(
  id: string,
  updates: Partial<Alumno>
): Promise<Alumno | null> {
  try {
    const { data, error } = await supabase
      .from("alumno")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "actualizar alumno")
      return null
    }
    return data as Alumno
  } catch (error) {
    handleSupabaseError(error, "actualizar alumno")
    return null
  }
}

export async function deleteAlumno(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("alumno").delete().eq("id", id)

    if (error) {
      handleSupabaseError(error, "eliminar alumno")
      return false
    }
    return true
  } catch (error) {
    handleSupabaseError(error, "eliminar alumno")
    return false
  }
}

export async function createAlumnoAccount(email: string, password: string) {
  // Note: This is a simplified version for demo purposes
  // In production, this should use a Supabase Edge Function with service_role key
  // For now, we use the regular signup which creates an unverified user
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined // Disable email confirmation for demo
      }
    })

    if (error) {
      handleSupabaseError(error, "crear cuenta de alumno")
      return {
        user: null,
        success: false,
        message: "Error al crear la cuenta"
      }
    }

    return {
      user: data.user,
      success: true,
      message: "Cuenta creada correctamente"
    }
  } catch (error: any) {
    handleSupabaseError(error, "crear cuenta de alumno")
    return {
      user: null,
      success: false,
      message: "Error al crear la cuenta"
    }
  }
}
