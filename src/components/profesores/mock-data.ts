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
    sedes: ["1", "2"], // Central y Chamberí
    tipo_clase: "ambos",
    horario: [
      { dia: "lunes", hora_inicio: "09:00", hora_fin: "14:00" },
      { dia: "martes", hora_inicio: "09:00", hora_fin: "14:00" },
      { dia: "miercoles", hora_inicio: "16:00", hora_fin: "20:00" },
    ],
  },
  {
    id: "2",
    nombre: "Carmen",
    apellidos: "Fernández Molina",
    email: "carmen.fernandez@autoescuela.com",
    telefono: "622 333 444",
    permisos_habilitados: ["AM", "A1", "A2", "A", "B"],
    activo: true,
    sedes: ["2", "3"], // Chamberí y Getafe
    tipo_clase: "practico",
    horario: [
      { dia: "lunes", hora_inicio: "10:00", hora_fin: "15:00" },
      { dia: "miercoles", hora_inicio: "10:00", hora_fin: "15:00" },
      { dia: "viernes", hora_inicio: "10:00", hora_fin: "15:00" },
    ],
  },
  {
    id: "3",
    nombre: "Francisco",
    apellidos: "Gómez Serrano",
    email: "francisco.gomez@autoescuela.com",
    telefono: "633 444 555",
    permisos_habilitados: ["B"],
    activo: true,
    sedes: ["1"], // Solo Central
    tipo_clase: "teorico",
    horario: [
      { dia: "martes", hora_inicio: "16:00", hora_fin: "20:00" },
      { dia: "jueves", hora_inicio: "16:00", hora_fin: "20:00" },
      { dia: "sabado", hora_inicio: "09:00", hora_fin: "13:00" },
    ],
  },
  {
    id: "4",
    nombre: "Isabel",
    apellidos: "Morales Ortega",
    email: "isabel.morales@autoescuela.com",
    telefono: "644 555 666",
    permisos_habilitados: ["B", "C"],
    activo: false,
    sedes: ["3"], // Era de Getafe antes de estar inactiva
    tipo_clase: "ambos",
    horario: [], // Empty as she's inactive
  },
  {
    id: "5",
    nombre: "Miguel",
    apellidos: "Santos Rivas",
    email: "miguel.santos@autoescuela.com",
    telefono: "655 666 777",
    permisos_habilitados: ["AM", "A1", "A2", "B"],
    activo: true,
    sedes: ["1", "2", "3"], // Todas las sedes
    tipo_clase: "practico",
    horario: [
      { dia: "lunes", hora_inicio: "15:00", hora_fin: "19:00" },
      { dia: "martes", hora_inicio: "15:00", hora_fin: "19:00" },
      { dia: "jueves", hora_inicio: "09:00", hora_fin: "13:00" },
      { dia: "viernes", hora_inicio: "09:00", hora_fin: "13:00" },
    ],
  },
]
