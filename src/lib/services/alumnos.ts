import { createClient } from "@/lib/supabase/client"
import type { Alumno } from "@/components/alumnos/types"

const supabase = createClient()

export async function getAlumnos(): Promise<Alumno[]> {
  const { data, error } = await supabase
    .from("alumno")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data as Alumno[]
}

export async function getAlumno(id: string): Promise<Alumno | null> {
  const { data, error } = await supabase
    .from("alumno")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data as Alumno
}

export async function createAlumno(
  alumno: Omit<Alumno, "id">
): Promise<Alumno> {
  const { data, error } = await supabase
    .from("alumno")
    .insert(alumno)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Alumno
}

export async function updateAlumno(
  id: string,
  updates: Partial<Alumno>
): Promise<Alumno> {
  const { data, error } = await supabase
    .from("alumno")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Alumno
}

export async function deleteAlumno(id: string): Promise<void> {
  const { error } = await supabase.from("alumno").delete().eq("id", id)

  if (error) throw new Error(error.message)
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

    if (error) throw new Error(error.message)

    return {
      user: data.user,
      success: true,
      message: "Cuenta creada correctamente"
    }
  } catch (error: any) {
    throw new Error(`Error creating account: ${error.message}`)
  }
}
