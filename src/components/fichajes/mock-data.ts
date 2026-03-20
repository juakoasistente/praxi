import type { Fichaje } from "./types"

// Helper to build ISO timestamps for the last 3 days
function ts(daysAgo: number, hour: number, minute: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const EMPLEADOS = [
  { nombre: "Antonio", apellidos: "Ruiz Delgado", rol: "profesor" as const },
  { nombre: "Carmen", apellidos: "Fernández Molina", rol: "profesor" as const },
  { nombre: "Francisco", apellidos: "Gómez Serrano", rol: "profesor" as const },
  { nombre: "Isabel", apellidos: "Morales Ortega", rol: "secretario" as const },
  { nombre: "Miguel", apellidos: "Santos Rivas", rol: "admin" as const },
]

export const MOCK_FICHAJES: Fichaje[] = [
  // Hoy
  { id: "f01", usuario_nombre: "Antonio", usuario_apellidos: "Ruiz Delgado", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(0, 8, 2), metodo: "app" },
  { id: "f02", usuario_nombre: "Carmen", usuario_apellidos: "Fernández Molina", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(0, 8, 10), metodo: "app" },
  { id: "f03", usuario_nombre: "Francisco", usuario_apellidos: "Gómez Serrano", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(0, 8, 30), metodo: "manual" },
  { id: "f04", usuario_nombre: "Isabel", usuario_apellidos: "Morales Ortega", usuario_rol: "secretario", tipo: "entrada", timestamp: ts(0, 9, 0), metodo: "app" },
  { id: "f05", usuario_nombre: "Antonio", usuario_apellidos: "Ruiz Delgado", usuario_rol: "profesor", tipo: "salida", timestamp: ts(0, 14, 5), metodo: "app" },
  { id: "f06", usuario_nombre: "Carmen", usuario_apellidos: "Fernández Molina", usuario_rol: "profesor", tipo: "salida", timestamp: ts(0, 14, 15), metodo: "manual" },

  // Ayer
  { id: "f07", usuario_nombre: "Antonio", usuario_apellidos: "Ruiz Delgado", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(1, 8, 0), metodo: "app" },
  { id: "f08", usuario_nombre: "Carmen", usuario_apellidos: "Fernández Molina", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(1, 8, 5), metodo: "app" },
  { id: "f09", usuario_nombre: "Francisco", usuario_apellidos: "Gómez Serrano", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(1, 9, 15), metodo: "manual" },
  { id: "f10", usuario_nombre: "Isabel", usuario_apellidos: "Morales Ortega", usuario_rol: "secretario", tipo: "entrada", timestamp: ts(1, 8, 45), metodo: "app" },
  { id: "f11", usuario_nombre: "Miguel", usuario_apellidos: "Santos Rivas", usuario_rol: "admin", tipo: "entrada", timestamp: ts(1, 9, 30), metodo: "app" },
  { id: "f12", usuario_nombre: "Antonio", usuario_apellidos: "Ruiz Delgado", usuario_rol: "profesor", tipo: "salida", timestamp: ts(1, 14, 0), metodo: "app" },
  { id: "f13", usuario_nombre: "Carmen", usuario_apellidos: "Fernández Molina", usuario_rol: "profesor", tipo: "salida", timestamp: ts(1, 15, 0), metodo: "app" },
  { id: "f14", usuario_nombre: "Francisco", usuario_apellidos: "Gómez Serrano", usuario_rol: "profesor", tipo: "salida", timestamp: ts(1, 14, 30), metodo: "manual" },
  { id: "f15", usuario_nombre: "Isabel", usuario_apellidos: "Morales Ortega", usuario_rol: "secretario", tipo: "salida", timestamp: ts(1, 14, 10), metodo: "app" },
  { id: "f16", usuario_nombre: "Miguel", usuario_apellidos: "Santos Rivas", usuario_rol: "admin", tipo: "salida", timestamp: ts(1, 18, 0), metodo: "manual" },

  // Hace 2 días
  { id: "f17", usuario_nombre: "Antonio", usuario_apellidos: "Ruiz Delgado", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(2, 8, 10), metodo: "app" },
  { id: "f18", usuario_nombre: "Carmen", usuario_apellidos: "Fernández Molina", usuario_rol: "profesor", tipo: "entrada", timestamp: ts(2, 8, 20), metodo: "manual" },
  { id: "f19", usuario_nombre: "Miguel", usuario_apellidos: "Santos Rivas", usuario_rol: "admin", tipo: "entrada", timestamp: ts(2, 10, 0), metodo: "app" },
  { id: "f20", usuario_nombre: "Antonio", usuario_apellidos: "Ruiz Delgado", usuario_rol: "profesor", tipo: "salida", timestamp: ts(2, 15, 0), metodo: "app" },
  { id: "f21", usuario_nombre: "Carmen", usuario_apellidos: "Fernández Molina", usuario_rol: "profesor", tipo: "salida", timestamp: ts(2, 14, 45), metodo: "manual" },
  { id: "f22", usuario_nombre: "Miguel", usuario_apellidos: "Santos Rivas", usuario_rol: "admin", tipo: "salida", timestamp: ts(2, 19, 30), metodo: "app" },
]
