import { createClient } from "@/lib/supabase/client"
import type { Factura, LineaFactura } from "@/components/facturacion/types"

const supabase = createClient()

export async function getFacturas(): Promise<Factura[]> {
  const { data, error } = await supabase
    .from("factura")
    .select(`
      id,
      numero,
      alumno_id,
      alumno:alumno_id ( nombre, apellidos ),
      fecha_emision,
      fecha_vencimiento,
      total,
      estado,
      metodo_pago,
      fecha_pago,
      notas,
      lineas:linea_factura (
        id,
        concepto,
        descripcion,
        cantidad,
        precio_unitario,
        subtotal
      )
    `)
    .order("fecha_emision", { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row: Record<string, unknown>) => {
    const alumno = row.alumno as { nombre: string; apellidos: string } | null
    return {
      id: row.id as string,
      numero: row.numero as string,
      alumno_id: row.alumno_id as string,
      alumno_nombre: alumno
        ? `${alumno.nombre} ${alumno.apellidos}`
        : "",
      fecha_emision: row.fecha_emision as string,
      fecha_vencimiento: row.fecha_vencimiento as string,
      lineas: (row.lineas as LineaFactura[]) ?? [],
      total: Number(row.total),
      estado: row.estado as Factura["estado"],
      metodo_pago: row.metodo_pago as Factura["metodo_pago"],
      fecha_pago: row.fecha_pago as string | null,
      notas: row.notas as string | null,
    }
  })
}

export async function createFactura(
  factura: Omit<Factura, "id" | "alumno_nombre">
): Promise<void> {
  // Insert factura first
  const { data, error } = await supabase
    .from("factura")
    .insert({
      numero: factura.numero,
      alumno_id: factura.alumno_id,
      concepto: factura.lineas.map((l) => l.descripcion).join(", "),
      importe: factura.total,
      iva: 21,
      total: factura.total,
      fecha_emision: factura.fecha_emision,
      fecha_vencimiento: factura.fecha_vencimiento,
      estado: factura.estado,
      metodo_pago: factura.metodo_pago,
      fecha_pago: factura.fecha_pago,
      notas: factura.notas,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  // Insert lineas
  if (factura.lineas.length > 0) {
    const lineas = factura.lineas.map((l) => ({
      factura_id: data.id,
      concepto: l.concepto,
      descripcion: l.descripcion,
      cantidad: l.cantidad,
      precio_unitario: l.precio_unitario,
      subtotal: l.subtotal,
    }))
    const { error: lineasError } = await supabase
      .from("linea_factura")
      .insert(lineas)
    if (lineasError) throw new Error(lineasError.message)
  }
}

export async function updateFactura(
  id: string,
  updates: Partial<Factura>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {}
  if (updates.numero !== undefined) dbUpdates.numero = updates.numero
  if (updates.fecha_emision !== undefined)
    dbUpdates.fecha_emision = updates.fecha_emision
  if (updates.fecha_vencimiento !== undefined)
    dbUpdates.fecha_vencimiento = updates.fecha_vencimiento
  if (updates.total !== undefined) {
    dbUpdates.total = updates.total
    dbUpdates.importe = updates.total
  }
  if (updates.estado !== undefined) dbUpdates.estado = updates.estado
  if (updates.metodo_pago !== undefined)
    dbUpdates.metodo_pago = updates.metodo_pago
  if (updates.fecha_pago !== undefined) dbUpdates.fecha_pago = updates.fecha_pago
  if (updates.notas !== undefined) dbUpdates.notas = updates.notas

  const { error } = await supabase
    .from("factura")
    .update(dbUpdates)
    .eq("id", id)

  if (error) throw new Error(error.message)

  // Update lineas if provided
  if (updates.lineas) {
    // Delete existing and re-insert
    await supabase.from("linea_factura").delete().eq("factura_id", id)
    if (updates.lineas.length > 0) {
      const lineas = updates.lineas.map((l) => ({
        factura_id: id,
        concepto: l.concepto,
        descripcion: l.descripcion,
        cantidad: l.cantidad,
        precio_unitario: l.precio_unitario,
        subtotal: l.subtotal,
      }))
      const { error: lineasError } = await supabase
        .from("linea_factura")
        .insert(lineas)
      if (lineasError) throw new Error(lineasError.message)
    }
  }
}

export async function deleteFactura(id: string): Promise<void> {
  const { error } = await supabase.from("factura").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
