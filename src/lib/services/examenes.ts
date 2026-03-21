import { createClient } from "@/lib/supabase/client"
import type { Examen } from "@/components/examenes/types"

const supabase = createClient()

export async function getExamenes(): Promise<Examen[]> {
  const { data, error } = await supabase
    .from("expediente_examen")
    .select(`
      id,
      alumno_id,
      alumno:alumno_id ( nombre, apellidos ),
      tipo,
      fecha_presentacion,
      hora,
      nombre_convocatoria,
      intento,
      resultado,
      centro_examen,
      notas,
      sede_id
    `)
    .order("fecha_presentacion", { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row: Record<string, unknown>) => {
    const alumno = row.alumno as { nombre: string; apellidos: string } | null
    return {
      id: row.id as string,
      alumno_id: row.alumno_id as string,
      alumno_nombre: alumno
        ? `${alumno.nombre} ${alumno.apellidos}`
        : "",
      tipo: row.tipo as Examen["tipo"],
      fecha: row.fecha_presentacion as string,
      hora: row.hora as string | null,
      convocatoria: row.nombre_convocatoria as string | null,
      intento: row.intento as number,
      resultado: row.resultado as Examen["resultado"],
      centro_examen: row.centro_examen as string | null,
      notas: row.notas as string | null,
      sede_id: row.sede_id as string,
    }
  })
}

export async function createExamen(
  examen: Omit<Examen, "id" | "alumno_nombre">
): Promise<void> {
  const { error } = await supabase.from("expediente_examen").insert({
    alumno_id: examen.alumno_id,
    tipo: examen.tipo,
    fecha_presentacion: examen.fecha,
    hora: examen.hora,
    nombre_convocatoria: examen.convocatoria,
    intento: examen.intento,
    resultado: examen.resultado,
    centro_examen: examen.centro_examen,
    notas: examen.notas,
    sede_id: examen.sede_id,
  })

  if (error) throw new Error(error.message)
}

export async function updateExamen(
  id: string,
  updates: Partial<Examen>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {}
  if (updates.tipo !== undefined) dbUpdates.tipo = updates.tipo
  if (updates.fecha !== undefined) dbUpdates.fecha_presentacion = updates.fecha
  if (updates.hora !== undefined) dbUpdates.hora = updates.hora
  if (updates.convocatoria !== undefined)
    dbUpdates.nombre_convocatoria = updates.convocatoria
  if (updates.intento !== undefined) dbUpdates.intento = updates.intento
  if (updates.resultado !== undefined) dbUpdates.resultado = updates.resultado
  if (updates.centro_examen !== undefined)
    dbUpdates.centro_examen = updates.centro_examen
  if (updates.notas !== undefined) dbUpdates.notas = updates.notas
  if (updates.sede_id !== undefined) dbUpdates.sede_id = updates.sede_id

  const { error } = await supabase
    .from("expediente_examen")
    .update(dbUpdates)
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export async function deleteExamen(id: string): Promise<void> {
  const { error } = await supabase
    .from("expediente_examen")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}
