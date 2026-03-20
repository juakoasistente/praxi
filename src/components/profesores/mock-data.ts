import type { Profesor } from "./types"

export const MOCK_PROFESORES: Profesor[] = [
  {
    id: "1",
    nombre: "Antonio",
    apellidos: "Ruiz Delgado",
    email: "antonio.ruiz@autoescuela.com",
    telefono: "611 222 333",
    permisos_habilitados: ["B", "C", "D"],
    activo: true,
  },
  {
    id: "2",
    nombre: "Carmen",
    apellidos: "Fernández Molina",
    email: "carmen.fernandez@autoescuela.com",
    telefono: "622 333 444",
    permisos_habilitados: ["AM", "A1", "A2", "A", "B"],
    activo: true,
  },
  {
    id: "3",
    nombre: "Francisco",
    apellidos: "Gómez Serrano",
    email: "francisco.gomez@autoescuela.com",
    telefono: "633 444 555",
    permisos_habilitados: ["B"],
    activo: true,
  },
  {
    id: "4",
    nombre: "Isabel",
    apellidos: "Morales Ortega",
    email: "isabel.morales@autoescuela.com",
    telefono: "644 555 666",
    permisos_habilitados: ["B", "C"],
    activo: false,
  },
  {
    id: "5",
    nombre: "Miguel",
    apellidos: "Santos Rivas",
    email: "miguel.santos@autoescuela.com",
    telefono: "655 666 777",
    permisos_habilitados: ["AM", "A1", "A2", "B"],
    activo: true,
  },
]
