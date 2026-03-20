-- Praxi: Schema inicial
-- Ejecutar en Supabase SQL Editor

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE user_role AS ENUM ('admin', 'profesor', 'secretario');
CREATE TYPE student_status AS ENUM ('matriculado', 'en_curso', 'teorico_aprobado', 'practico_aprobado', 'completado', 'baja');
CREATE TYPE license_type AS ENUM ('AM', 'A1', 'A2', 'A', 'B', 'B+E', 'C1', 'C', 'D1', 'D', 'C+E', 'D+E');
CREATE TYPE vehicle_type AS ENUM ('coche', 'moto', 'camion', 'furgoneta');
CREATE TYPE class_type AS ENUM ('practica', 'teorica');
CREATE TYPE class_status AS ENUM ('programada', 'completada', 'cancelada', 'no_show');
CREATE TYPE exam_type AS ENUM ('teorico', 'practico');
CREATE TYPE exam_result AS ENUM ('pendiente', 'aprobado', 'suspendido', 'no_presentado');
CREATE TYPE clock_type AS ENUM ('entrada', 'salida');
CREATE TYPE clock_method AS ENUM ('manual', 'app');
CREATE TYPE ticket_type AS ENUM ('clase_practica', 'bono_5', 'bono_10');
CREATE TYPE invoice_status AS ENUM ('pendiente', 'pagada', 'vencida');

-- ===========================================
-- TABLAS
-- ===========================================

-- Autoescuela (tenant)
CREATE TABLE autoescuela (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  cif TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usuario (perfil vinculado a auth.users)
CREATE TABLE usuario (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  rol user_role NOT NULL DEFAULT 'admin',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Alumno
CREATE TABLE alumno (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dni TEXT,
  email TEXT,
  telefono TEXT,
  fecha_nacimiento DATE,
  direccion TEXT,
  permiso license_type NOT NULL DEFAULT 'B',
  estado student_status NOT NULL DEFAULT 'matriculado',
  fecha_matricula DATE DEFAULT CURRENT_DATE,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profesor (extiende usuario)
CREATE TABLE profesor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  disponibilidad JSONB DEFAULT '{}',
  permisos_habilitados license_type[] DEFAULT '{B}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vehículo
CREATE TABLE vehiculo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  matricula TEXT NOT NULL,
  marca TEXT,
  modelo TEXT,
  tipo vehicle_type NOT NULL DEFAULT 'coche',
  coste_hora DECIMAL(10,2),
  coste_mantenimiento_mes DECIMAL(10,2),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clase
CREATE TABLE clase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  alumno_id UUID NOT NULL REFERENCES alumno(id) ON DELETE CASCADE,
  profesor_id UUID NOT NULL REFERENCES profesor(id) ON DELETE CASCADE,
  vehiculo_id UUID REFERENCES vehiculo(id) ON DELETE SET NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  tipo class_type NOT NULL DEFAULT 'practica',
  estado class_status NOT NULL DEFAULT 'programada',
  firmada_profesor BOOLEAN DEFAULT false,
  firmada_alumno BOOLEAN DEFAULT false,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Expediente de examen
CREATE TABLE expediente_examen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID NOT NULL REFERENCES alumno(id) ON DELETE CASCADE,
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  tipo exam_type NOT NULL,
  fecha_presentacion DATE,
  resultado exam_result NOT NULL DEFAULT 'pendiente',
  convocatoria INT NOT NULL DEFAULT 1,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fichaje
CREATE TABLE fichaje (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  tipo clock_type NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  metodo clock_method NOT NULL DEFAULT 'manual'
);

-- Ticket / Bono de clases
CREATE TABLE ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID NOT NULL REFERENCES alumno(id) ON DELETE CASCADE,
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  tipo ticket_type NOT NULL DEFAULT 'clase_practica',
  total INT NOT NULL DEFAULT 1,
  consumidas INT NOT NULL DEFAULT 0,
  precio DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Factura
CREATE TABLE factura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  alumno_id UUID NOT NULL REFERENCES alumno(id) ON DELETE CASCADE,
  numero TEXT NOT NULL,
  concepto TEXT NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) NOT NULL DEFAULT 21.00,
  total DECIMAL(10,2) NOT NULL,
  estado invoice_status NOT NULL DEFAULT 'pendiente',
  fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===========================================
-- ÍNDICES
-- ===========================================

CREATE INDEX idx_usuario_autoescuela ON usuario(autoescuela_id);
CREATE INDEX idx_alumno_autoescuela ON alumno(autoescuela_id);
CREATE INDEX idx_profesor_autoescuela ON profesor(autoescuela_id);
CREATE INDEX idx_vehiculo_autoescuela ON vehiculo(autoescuela_id);
CREATE INDEX idx_clase_autoescuela ON clase(autoescuela_id);
CREATE INDEX idx_clase_fecha ON clase(fecha);
CREATE INDEX idx_clase_profesor ON clase(profesor_id);
CREATE INDEX idx_clase_alumno ON clase(alumno_id);
CREATE INDEX idx_expediente_alumno ON expediente_examen(alumno_id);
CREATE INDEX idx_fichaje_usuario ON fichaje(usuario_id);
CREATE INDEX idx_ticket_alumno ON ticket(alumno_id);
CREATE INDEX idx_factura_alumno ON factura(alumno_id);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE autoescuela ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumno ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculo ENABLE ROW LEVEL SECURITY;
ALTER TABLE clase ENABLE ROW LEVEL SECURITY;
ALTER TABLE expediente_examen ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket ENABLE ROW LEVEL SECURITY;
ALTER TABLE factura ENABLE ROW LEVEL SECURITY;

-- Helper: obtener autoescuela_id del usuario actual
CREATE OR REPLACE FUNCTION auth.autoescuela_id()
RETURNS UUID AS $$
  SELECT autoescuela_id FROM public.usuario WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Policies: cada tabla solo ve datos de su autoescuela
CREATE POLICY "Users see own autoescuela" ON autoescuela
  FOR ALL USING (id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela data" ON usuario
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela alumnos" ON alumno
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela profesores" ON profesor
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela vehiculos" ON vehiculo
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela clases" ON clase
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela examenes" ON expediente_examen
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela fichajes" ON fichaje
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela tickets" ON ticket
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());

CREATE POLICY "Users see own autoescuela facturas" ON factura
  FOR ALL USING (autoescuela_id = auth.autoescuela_id());
