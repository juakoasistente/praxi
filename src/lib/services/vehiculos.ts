import { createClient } from "@/lib/supabase/client"
import type {
  Vehiculo,
  CosteVehiculo,
  IncidenciaVehiculo,
} from "@/components/vehiculos/types"

const supabase = createClient()

// --- Vehículos ---

export async function getVehiculos(): Promise<Vehiculo[]> {
  const { data, error } = await supabase
    .from("vehiculo")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data as Vehiculo[]
}

export async function getVehiculo(id: string): Promise<Vehiculo | null> {
  const { data, error } = await supabase
    .from("vehiculo")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data as Vehiculo
}

export async function createVehiculo(
  vehiculo: Omit<Vehiculo, "id">
): Promise<Vehiculo> {
  const { data, error } = await supabase
    .from("vehiculo")
    .insert(vehiculo)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Vehiculo
}

export async function updateVehiculo(
  id: string,
  updates: Partial<Vehiculo>
): Promise<Vehiculo> {
  const { data, error } = await supabase
    .from("vehiculo")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Vehiculo
}

export async function deleteVehiculo(id: string): Promise<void> {
  const { error } = await supabase.from("vehiculo").delete().eq("id", id)

  if (error) throw new Error(error.message)
}

// --- Costes de vehículo ---

export async function getCostesVehiculo(
  vehiculoId: string
): Promise<CosteVehiculo[]> {
  const { data, error } = await supabase
    .from("coste_vehiculo")
    .select("*")
    .eq("vehiculo_id", vehiculoId)
    .order("fecha", { ascending: false })

  if (error) throw new Error(error.message)
  return data as CosteVehiculo[]
}

export async function getAllCostes(): Promise<CosteVehiculo[]> {
  const { data, error } = await supabase
    .from("coste_vehiculo")
    .select("*")
    .order("fecha", { ascending: false })

  if (error) throw new Error(error.message)
  return data as CosteVehiculo[]
}

export async function createCosteVehiculo(
  coste: Omit<CosteVehiculo, "id">
): Promise<CosteVehiculo> {
  const { data, error } = await supabase
    .from("coste_vehiculo")
    .insert(coste)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as CosteVehiculo
}

export async function deleteCosteVehiculo(id: string): Promise<void> {
  const { error } = await supabase.from("coste_vehiculo").delete().eq("id", id)

  if (error) throw new Error(error.message)
}

// --- Incidencias de vehículo ---

export async function getIncidenciasVehiculo(
  vehiculoId: string
): Promise<IncidenciaVehiculo[]> {
  const { data, error } = await supabase
    .from("incidencia_vehiculo")
    .select("*")
    .eq("vehiculo_id", vehiculoId)
    .order("fecha", { ascending: false })

  if (error) throw new Error(error.message)
  return data as IncidenciaVehiculo[]
}

export async function getAllIncidencias(): Promise<IncidenciaVehiculo[]> {
  const { data, error } = await supabase
    .from("incidencia_vehiculo")
    .select("*")
    .order("fecha", { ascending: false })

  if (error) throw new Error(error.message)
  return data as IncidenciaVehiculo[]
}

export async function createIncidenciaVehiculo(
  incidencia: Omit<IncidenciaVehiculo, "id">
): Promise<IncidenciaVehiculo> {
  const { data, error } = await supabase
    .from("incidencia_vehiculo")
    .insert(incidencia)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as IncidenciaVehiculo
}

export async function deleteIncidenciaVehiculo(id: string): Promise<void> {
  const { error } = await supabase
    .from("incidencia_vehiculo")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}
