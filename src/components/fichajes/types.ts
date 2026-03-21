export type RolUsuario = "admin" | "profesor" | "secretario"
export type TipoFichaje = "entrada" | "salida"
export type MetodoFichaje = "manual" | "app"

export interface Fichaje {
  id: string
  usuario_nombre: string
  usuario_apellidos: string
  usuario_rol: RolUsuario
  tipo: TipoFichaje
  timestamp: string // ISO string
  metodo: MetodoFichaje
  sede_id: string
}
