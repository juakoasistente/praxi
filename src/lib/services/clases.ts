import { createClient } from "@/lib/supabase/client"
import type { Clase } from "@/components/clases/mock-data"

const supabase = createClient()

export async function getClases(): Promise<Clase[]> {
  const { data, error } = await supabase
    .from("clase")
    .select(`
      id,
      profesor_id,
      alumno_id,
      alumno:alumno_id ( nombre, apellidos ),
      vehiculo_id,
      fecha,
      hora_inicio,
      hora_fin,
      estado,
      notas,
      sede_id
    `)
    .order("fecha", { ascending: false })

  if (error) throw new Error(error.message)

  // Map joined alumno data to flat fields
  return (data ?? []).map((row: Record<string, unknown>) => {
    const alumno = row.alumno as { nombre: string; apellidos: string } | null
    return {
      id: row.id as string,
      profesor_id: row.profesor_id as string,
      alumno_id: row.alumno_id as string,
      alumno_nombre: alumno?.nombre ?? "",
      alumno_apellidos: alumno?.apellidos ?? "",
      vehiculo_id: row.vehiculo_id as string,
      fecha: row.fecha as string,
      hora_inicio: row.hora_inicio as string,
      hora_fin: row.hora_fin as string,
      estado: row.estado as Clase["estado"],
      notas: row.notas as string | null,
      sede_id: row.sede_id as string,
    }
  })
}

export async function createClase(
  clase: Omit<Clase, "id" | "alumno_nombre" | "alumno_apellidos">
): Promise<Clase> {
  const { data, error } = await supabase
    .from("clase")
    .insert({
      profesor_id: clase.profesor_id,
      alumno_id: clase.alumno_id,
      vehiculo_id: clase.vehiculo_id,
      fecha: clase.fecha,
      hora_inicio: clase.hora_inicio,
      hora_fin: clase.hora_fin,
      estado: clase.estado,
      notas: clase.notas,
      sede_id: clase.sede_id,
    })
    .select(`
      id,
      profesor_id,
      alumno_id,
      alumno:alumno_id ( nombre, apellidos ),
      vehiculo_id,
      fecha,
      hora_inicio,
      hora_fin,
      estado,
      notas,
      sede_id
    `)
    .single()

  if (error) throw new Error(error.message)

  const alumno = (data as Record<string, unknown>).alumno as {
    nombre: string
    apellidos: string
  } | null
  return {
    ...(data as Record<string, unknown>),
    alumno_nombre: alumno?.nombre ?? "",
    alumno_apellidos: alumno?.apellidos ?? "",
  } as unknown as Clase
}

export async function updateClase(
  id: string,
  updates: Partial<Clase>
): Promise<void> {
  // Strip frontend-only fields
  const { alumno_nombre, alumno_apellidos, ...dbUpdates } = updates as Record<
    string,
    unknown
  >
  void alumno_nombre
  void alumno_apellidos

  const { error } = await supabase
    .from("clase")
    .update(dbUpdates)
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export async function deleteClase(id: string): Promise<void> {
  const { error } = await supabase.from("clase").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
