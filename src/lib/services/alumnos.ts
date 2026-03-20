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
