import type { Alumno } from "./types"

const createMockAlumno = (base: {
  id: string
  nombre: string
  apellidos: string
  dni: string
  email: string
  telefono: string
  fecha_nacimiento: string
  direccion: string
  permiso: "AM" | "A1" | "A2" | "A" | "B" | "C" | "D"
  estado: "matriculado" | "en_curso" | "teorico_aprobado" | "practico_aprobado" | "completado" | "baja"
  fecha_matricula: string
  notas: string | null
  sede_id: string
}): Alumno => {
  // Split apellidos into apellido1 and apellido2
  const apellidosParts = base.apellidos.split(" ")
  const apellido1 = apellidosParts[0] || ""
  const apellido2 = apellidosParts.slice(1).join(" ") || null

  return {
    ...base,
    codigo: null,
    apellido1,
    apellido2,
    sexo: null,
    pais_nacimiento: "España",
    nacionalidad: "Española",
    estudios: null,
    telefono_fijo: null,
    telefono_movil: base.telefono,
    foto_url: null,
    como_conocio: null,
    observaciones: null,
    tutor_nombre: null,
    tutor_apellidos: null,
    tutor_dni: null,
    tutor_relacion: null,
    codigo_postal: null,
    poblacion: "Madrid",
    provincia: "Madrid",
    pais: "España",
    facturacion_diferente: false,
    facturacion_nif: null,
    facturacion_nombre: null,
    facturacion_direccion: null,
    titular_cuenta: null,
    iban: null,
    fecha_mandato_sepa: null,
  }
}

export const MOCK_ALUMNOS: Alumno[] = [
  // SEDE CENTRAL - 4 alumnos
  createMockAlumno({
    id: "1",
    nombre: "María",
    apellidos: "García López",
    dni: "12345678A",
    email: "maria.garcia@email.com",
    telefono: "612 345 678",
    fecha_nacimiento: "2004-03-15",
    direccion: "Calle Gran Vía 42, 3ºB, Madrid",
    permiso: "B",
    estado: "en_curso",
    fecha_matricula: "2025-09-10",
    notas: "Alumna con buen progreso. Necesita reforzar maniobras de aparcamiento.",
    sede_id: "1",
  }),
  createMockAlumno({
    id: "2",
    nombre: "Carlos",
    apellidos: "Rodríguez Martín",
    dni: "98765432B",
    email: "carlos.rodriguez@email.com",
    telefono: "623 456 789",
    fecha_nacimiento: "2003-08-22",
    direccion: "Avenida de la Constitución 15, 1ºA, Madrid",
    permiso: "B",
    estado: "teorico_aprobado",
    fecha_matricula: "2025-10-01",
    notas: "Ha aprobado el teórico a la primera. Muy responsable.",
    sede_id: "1",
  }),
  createMockAlumno({
    id: "3",
    nombre: "Ana",
    apellidos: "López Fernández",
    dni: "45678901C",
    email: "ana.lopez@email.com",
    telefono: "634 567 890",
    fecha_nacimiento: "2005-12-03",
    direccion: "Calle Mayor 8, 2ºC, Madrid",
    permiso: "B",
    estado: "matriculado",
    fecha_matricula: "2025-11-15",
    notas: null,
    sede_id: "1",
  }),
  createMockAlumno({
    id: "4",
    nombre: "David",
    apellidos: "Sánchez Ruiz",
    dni: "11223344D",
    email: "david.sanchez@email.com",
    telefono: "645 678 901",
    fecha_nacimiento: "2002-06-18",
    direccion: "Plaza del Sol 3, 4ºD, Madrid",
    permiso: "B",
    estado: "completado",
    fecha_matricula: "2025-05-20",
    notas: "Alumno ejemplar. Aprobó a la primera tanto teórico como práctico.",
    sede_id: "1",
  }),
  // SEDE NORTE - 3 alumnos
  createMockAlumno({
    id: "5",
    nombre: "Laura",
    apellidos: "Martín González",
    dni: "55667788E",
    email: "laura.martin@email.com",
    telefono: "656 789 012",
    fecha_nacimiento: "2004-09-10",
    direccion: "Calle del Norte 12, 1ºB, Madrid",
    permiso: "B",
    estado: "en_curso",
    fecha_matricula: "2025-08-05",
    notas: "Progresa bien en las clases prácticas.",
    sede_id: "2",
  }),
  createMockAlumno({
    id: "6",
    nombre: "Pedro",
    apellidos: "Jiménez Castro",
    dni: "99887766F",
    email: "pedro.jimenez@email.com",
    telefono: "667 890 123",
    fecha_nacimiento: "2003-01-25",
    direccion: "Avenida Norte 25, 3ºA, Madrid",
    permiso: "B",
    estado: "practico_aprobado",
    fecha_matricula: "2025-07-12",
    notas: "Ha superado el examen práctico. Excelente conductor.",
    sede_id: "2",
  }),
  createMockAlumno({
    id: "7",
    nombre: "Elena",
    apellidos: "Vázquez Moreno",
    dni: "33445566G",
    email: "elena.vazquez@email.com",
    telefono: "678 901 234",
    fecha_nacimiento: "2005-04-07",
    direccion: "Calle Estrella 7, 2ºD, Madrid",
    permiso: "B",
    estado: "matriculado",
    fecha_matricula: "2025-12-01",
    notas: "Recién matriculada. Muy entusiasta.",
    sede_id: "2",
  }),
  // SEDE SUR - 2 alumnos
  createMockAlumno({
    id: "8",
    nombre: "Javier",
    apellidos: "Torres Delgado",
    dni: "77889900H",
    email: "javier.torres@email.com",
    telefono: "689 012 345",
    fecha_nacimiento: "2003-11-14",
    direccion: "Calle Sur 18, 1ºC, Madrid",
    permiso: "B",
    estado: "en_curso",
    fecha_matricula: "2025-09-28",
    notas: "Necesita mejorar en rotondas y cambios de carril.",
    sede_id: "3",
  }),
  createMockAlumno({
    id: "9",
    nombre: "Carmen",
    apellidos: "Ruiz Herrera",
    dni: "22334455I",
    email: "carmen.ruiz@email.com",
    telefono: "690 123 456",
    fecha_nacimiento: "2004-02-29",
    direccion: "Avenida Sur 9, 4ºA, Madrid",
    permiso: "B",
    estado: "baja",
    fecha_matricula: "2025-06-15",
    notas: "Se dio de baja por motivos personales.",
    sede_id: "3",
  }),
]