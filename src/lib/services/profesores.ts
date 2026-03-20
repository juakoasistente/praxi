import { createClient } from "@/lib/supabase/client"
import type { Profesor } from "@/components/profesores/types"

const supabase = createClient()

export async function getProfesores(): Promise<Profesor[]> {
  const { data, error } = await supabase
    .from("profesor")
    .select("*")
    .order("nombre", { ascending: true })

  if (error) throw new Error(error.message)
  return data as Profesor[]
}

export async function getProfesor(id: string): Promise<Profesor | null> {
  const { data, error } = await supabase
    .from("profesor")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data as Profesor
}

export async function createProfesor(
  profesor: Omit<Profesor, "id">
): Promise<Profesor> {
  const { data, error } = await supabase
    .from("profesor")
    .insert(profesor)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Profesor
}

export async function updateProfesor(
  id: string,
  updates: Partial<Profesor>
): Promise<Profesor> {
  const { data, error } = await supabase
    .from("profesor")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Profesor
}

export async function deleteProfesor(id: string): Promise<void> {
  const { error } = await supabase.from("profesor").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
