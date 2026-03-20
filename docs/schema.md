# Schema de Base de Datos — Praxi (Borrador)

> ⚠️ Borrador inicial. Se irá ampliando con cada feature.

## Diagrama de Relaciones

```
autoescuela 1──N usuario (admin, profesor, secretario)
autoescuela 1──N alumno
autoescuela 1──N vehiculo
profesor    1──N clase
alumno      1──N clase
vehiculo    1──N clase
alumno      1──N expediente_examen
alumno      1──N factura
alumno      1──N ticket (bono de clases)
usuario     1──N fichaje
```

## Tablas

### `autoescuela`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| nombre | text | |
| direccion | text | |
| telefono | text | |
| email | text | |
| cif | text | |
| created_at | timestamptz | |

### `usuario` (auth + perfil)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | FK → auth.users |
| autoescuela_id | uuid FK | |
| nombre | text | |
| apellidos | text | |
| email | text | |
| telefono | text | |
| rol | enum | 'admin', 'profesor', 'secretario' |
| activo | boolean | default true |
| created_at | timestamptz | |

### `alumno`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| autoescuela_id | uuid FK | |
| nombre | text | |
| apellidos | text | |
| dni | text | |
| email | text | nullable |
| telefono | text | |
| fecha_nacimiento | date | |
| direccion | text | nullable |
| permiso | enum | 'AM', 'A1', 'A2', 'A', 'B', 'C', 'D', etc. |
| estado | enum | 'matriculado', 'en_curso', 'teorico_aprobado', 'practico_aprobado', 'completado', 'baja' |
| fecha_matricula | date | |
| notas | text | nullable |
| created_at | timestamptz | |

### `profesor`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| usuario_id | uuid FK | → usuario |
| autoescuela_id | uuid FK | |
| disponibilidad | jsonb | Horario semanal |
| permisos_habilitados | text[] | Permisos que puede enseñar |
| created_at | timestamptz | |

### `vehiculo`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| autoescuela_id | uuid FK | |
| matricula | text | |
| marca | text | |
| modelo | text | |
| tipo | enum | 'coche', 'moto', 'camion' |
| coste_hora | decimal | Para calcular rentabilidad |
| coste_mantenimiento_mes | decimal | nullable |
| activo | boolean | default true |
| created_at | timestamptz | |

### `clase`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| autoescuela_id | uuid FK | |
| alumno_id | uuid FK | |
| profesor_id | uuid FK | |
| vehiculo_id | uuid FK | nullable |
| fecha | date | |
| hora_inicio | time | |
| hora_fin | time | |
| tipo | enum | 'practica', 'teorica' |
| estado | enum | 'programada', 'completada', 'cancelada', 'no_show' |
| firmada_profesor | boolean | default false |
| firmada_alumno | boolean | default false |
| notas | text | nullable |
| created_at | timestamptz | |

### `expediente_examen`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| alumno_id | uuid FK | |
| tipo | enum | 'teorico', 'practico' |
| fecha_presentacion | date | Fecha en que se presenta |
| resultado | enum | 'pendiente', 'aprobado', 'suspendido', 'no_presentado' |
| convocatoria | int | Número de intento |
| notas | text | nullable |
| created_at | timestamptz | |

### `fichaje`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| usuario_id | uuid FK | |
| autoescuela_id | uuid FK | |
| tipo | enum | 'entrada', 'salida' |
| timestamp | timestamptz | |
| metodo | enum | 'manual', 'app' |

### `ticket` (bonos de clases)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| alumno_id | uuid FK | |
| autoescuela_id | uuid FK | |
| tipo | enum | 'clase_practica', 'bono_5', 'bono_10' |
| total | int | Clases del bono |
| consumidas | int | default 0 |
| precio | decimal | |
| created_at | timestamptz | |

### `factura`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| autoescuela_id | uuid FK | |
| alumno_id | uuid FK | |
| numero | text | Número de factura |
| concepto | text | |
| importe | decimal | |
| iva | decimal | |
| total | decimal | |
| estado | enum | 'pendiente', 'pagada', 'vencida' |
| fecha_emision | date | |
| fecha_vencimiento | date | nullable |
| created_at | timestamptz | |

## Row Level Security (RLS)

Todas las tablas filtran por `autoescuela_id`:
- Los usuarios solo ven datos de su autoescuela
- Los profesores solo ven sus propias clases y fichajes
- Los admins ven todo dentro de su autoescuela

## Notas
- Multi-tenant por `autoescuela_id` desde el día 1
- UUIDs como PK en todas las tablas
- `created_at` automático con `now()`
- Los enums se implementan como tipos de PostgreSQL
