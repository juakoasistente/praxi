import type { Vehiculo, CosteVehiculo, IncidenciaVehiculo } from "./types"

export const MOCK_VEHICULOS: Vehiculo[] = [
  // SEDE CENTRAL - 2 vehículos
  {
    id: "1",
    marca: "Seat",
    modelo: "Ibiza",
    matricula: "1234 BCD",
    tipo: "turismo",
    año: 2022,
    km_actuales: 45230,
    fecha_adquisicion: "2022-03-15",
    precio_adquisicion: 18500,
    estado: "activo",
    notas: "Vehículo principal para clases de permiso B. Doble mando instalado.",
    sede_id: "1",
  },
  {
    id: "2",
    marca: "Renault",
    modelo: "Clio",
    matricula: "5678 FGH",
    tipo: "turismo",
    año: 2021,
    km_actuales: 62100,
    fecha_adquisicion: "2021-06-20",
    precio_adquisicion: 16800,
    estado: "activo",
    notas: "Segundo turismo. Revisión de embrague pendiente.",
    sede_id: "1",
  },
  // SEDE CHAMBERÍ - 2 vehículos
  {
    id: "3",
    marca: "Yamaha",
    modelo: "MT-07",
    matricula: "9012 JKL",
    tipo: "motocicleta",
    año: 2023,
    km_actuales: 12400,
    fecha_adquisicion: "2023-02-10",
    precio_adquisicion: 7900,
    estado: "activo",
    notas: "Para clases de permiso A2. Buen estado general.",
    sede_id: "2",
  },
  {
    id: "5",
    marca: "MAN",
    modelo: "TGL 12.250",
    matricula: "7890 QRS",
    tipo: "camion",
    año: 2019,
    km_actuales: 98500,
    fecha_adquisicion: "2019-09-12",
    precio_adquisicion: 45000,
    estado: "activo",
    notas: "Para clases de permiso C. ITV pasada en enero 2026.",
    sede_id: "2",
  },
  // SEDE GETAFE - 1 vehículo
  {
    id: "6",
    marca: "Peugeot",
    modelo: "208",
    matricula: "2345 TUV",
    tipo: "turismo",
    año: 2018,
    km_actuales: 112000,
    fecha_adquisicion: "2018-01-20",
    precio_adquisicion: 14200,
    estado: "baja",
    notas: "Dado de baja por alto kilometraje. Vendido en diciembre 2025.",
    sede_id: "3",
  },
  // EN TALLER - sin sede
  {
    id: "4",
    marca: "Honda",
    modelo: "PCX 125",
    matricula: "3456 MNP",
    tipo: "motocicleta",
    año: 2023,
    km_actuales: 8300,
    fecha_adquisicion: "2023-05-01",
    precio_adquisicion: 3800,
    estado: "en_taller",
    notas: "En taller por avería en el sistema eléctrico.",
    sede_id: null,
  },
]

export const MOCK_COSTES: CosteVehiculo[] = [
  // Seat Ibiza
  { id: "c1", vehiculo_id: "1", concepto: "Revisión 40.000 km", importe: 320, fecha: "2025-11-10", categoria: "mantenimiento" },
  { id: "c2", vehiculo_id: "1", concepto: "Seguro anual 2026", importe: 890, fecha: "2026-01-05", categoria: "seguro" },
  { id: "c3", vehiculo_id: "1", concepto: "ITV periódica", importe: 45, fecha: "2025-09-15", categoria: "itv" },
  { id: "c4", vehiculo_id: "1", concepto: "Combustible marzo", importe: 185, fecha: "2026-03-01", categoria: "combustible" },
  // Renault Clio
  { id: "c5", vehiculo_id: "2", concepto: "Cambio de pastillas de freno", importe: 210, fecha: "2025-10-20", categoria: "reparacion" },
  { id: "c6", vehiculo_id: "2", concepto: "Seguro anual 2026", importe: 820, fecha: "2026-01-10", categoria: "seguro" },
  { id: "c7", vehiculo_id: "2", concepto: "Combustible febrero", importe: 195, fecha: "2026-02-15", categoria: "combustible" },
  { id: "c8", vehiculo_id: "2", concepto: "Revisión 60.000 km", importe: 380, fecha: "2025-12-05", categoria: "mantenimiento" },
  // Yamaha MT-07
  { id: "c9", vehiculo_id: "3", concepto: "Cambio de neumáticos", importe: 280, fecha: "2025-08-22", categoria: "mantenimiento" },
  { id: "c10", vehiculo_id: "3", concepto: "Seguro anual 2026", importe: 420, fecha: "2026-01-15", categoria: "seguro" },
  { id: "c11", vehiculo_id: "3", concepto: "Combustible enero", importe: 65, fecha: "2026-01-20", categoria: "combustible" },
  // Honda PCX
  { id: "c12", vehiculo_id: "4", concepto: "Reparación sistema eléctrico", importe: 450, fecha: "2026-03-10", categoria: "reparacion" },
  { id: "c13", vehiculo_id: "4", concepto: "Seguro anual 2026", importe: 210, fecha: "2026-01-08", categoria: "seguro" },
  // MAN TGL
  { id: "c14", vehiculo_id: "5", concepto: "ITV periódica", importe: 85, fecha: "2026-01-25", categoria: "itv" },
  { id: "c15", vehiculo_id: "5", concepto: "Seguro anual 2026", importe: 2100, fecha: "2026-01-02", categoria: "seguro" },
  { id: "c16", vehiculo_id: "5", concepto: "Combustible febrero", importe: 520, fecha: "2026-02-20", categoria: "combustible" },
  { id: "c17", vehiculo_id: "5", concepto: "Cambio de aceite y filtros", importe: 680, fecha: "2025-11-30", categoria: "mantenimiento" },
  // Peugeot 208
  { id: "c18", vehiculo_id: "6", concepto: "Última revisión antes de baja", importe: 150, fecha: "2025-12-01", categoria: "mantenimiento" },
]

export const MOCK_INCIDENCIAS: IncidenciaVehiculo[] = [
  // Seat Ibiza
  { id: "i1", vehiculo_id: "1", descripcion: "Pinchazo rueda delantera derecha en clase", fecha: "2025-10-05", tipo: "pinchazo" },
  { id: "i2", vehiculo_id: "1", descripcion: "Fallo en luz de freno trasera", fecha: "2026-01-18", tipo: "averia" },
  // Renault Clio
  { id: "i3", vehiculo_id: "2", descripcion: "Embrague patina al arrancar en pendiente", fecha: "2025-12-10", tipo: "mecanico" },
  { id: "i4", vehiculo_id: "2", descripcion: "Golpe en parachoques trasero en maniobra", fecha: "2026-02-22", tipo: "accidente" },
  { id: "i5", vehiculo_id: "2", descripcion: "Sustitución de limpiaparabrisas desgastados", fecha: "2025-09-15", tipo: "otro" },
  // Yamaha MT-07
  { id: "i6", vehiculo_id: "3", descripcion: "Caída en circuito cerrado, arañazos laterales", fecha: "2025-11-20", tipo: "accidente" },
  { id: "i7", vehiculo_id: "3", descripcion: "Cadena floja detectada en revisión", fecha: "2026-03-05", tipo: "mecanico" },
  // Honda PCX
  { id: "i8", vehiculo_id: "4", descripcion: "Sistema eléctrico falla intermitentemente", fecha: "2026-03-08", tipo: "averia" },
  // MAN TGL
  { id: "i9", vehiculo_id: "5", descripcion: "Fuga de aceite detectada en revisión", fecha: "2025-11-25", tipo: "mecanico" },
  { id: "i10", vehiculo_id: "5", descripcion: "Pinchazo en rueda trasera izquierda", fecha: "2026-02-10", tipo: "pinchazo" },
]
