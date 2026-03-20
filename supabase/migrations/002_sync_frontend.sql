-- Praxi: Migración 002 — Sincronizar esquema con frontend
-- Alinea la BBDD con todas las pantallas construidas

-- ===========================================
-- NUEVOS ENUMS
-- ===========================================

-- Tipos de vehículo actualizados (el frontend usa estos)
ALTER TYPE vehicle_type ADD VALUE IF NOT EXISTS 'turismo';
ALTER TYPE vehicle_type ADD VALUE IF NOT EXISTS 'motocicleta';
ALTER TYPE vehicle_type ADD VALUE IF NOT EXISTS 'autobus';

-- Estado de vehículo
CREATE TYPE vehicle_status AS ENUM ('activo', 'en_taller', 'baja');

-- Categorías de coste de vehículo
CREATE TYPE cost_category AS ENUM ('mantenimiento', 'seguro', 'itv', 'combustible', 'reparacion', 'otro');

-- Tipos de incidencia de vehículo
CREATE TYPE incident_type AS ENUM ('averia', 'accidente', 'pinchazo', 'mecanico', 'otro');

-- Estado de factura ampliado (añadir parcial y anulada)
ALTER TYPE invoice_status ADD VALUE IF NOT EXISTS 'parcial';
ALTER TYPE invoice_status ADD VALUE IF NOT EXISTS 'anulada';

-- Método de pago
CREATE TYPE payment_method AS ENUM ('efectivo', 'tarjeta', 'transferencia', 'domiciliacion');

-- Concepto de línea de factura
CREATE TYPE invoice_line_concept AS ENUM ('matricula', 'bono_clases', 'clase_suelta', 'examen', 'material', 'otro');

-- ===========================================
-- ACTUALIZAR TABLA VEHÍCULO
-- ===========================================

ALTER TABLE vehiculo
  ADD COLUMN IF NOT EXISTS año INT,
  ADD COLUMN IF NOT EXISTS km_actuales INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fecha_adquisicion DATE,
  ADD COLUMN IF NOT EXISTS precio_adquisicion DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estado vehicle_status NOT NULL DEFAULT 'activo',
  ADD COLUMN IF NOT EXISTS notas TEXT;

-- ===========================================
-- NUEVA TABLA: COSTE DE VEHÍCULO
-- ===========================================

CREATE TABLE IF NOT EXISTS coste_vehiculo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehiculo_id UUID NOT NULL REFERENCES vehiculo(id) ON DELETE CASCADE,
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  concepto TEXT NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  fecha DATE NOT NULL,
  categoria cost_category NOT NULL DEFAULT 'otro',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coste_vehiculo ON coste_vehiculo(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_coste_vehiculo_autoescuela ON coste_vehiculo(autoescuela_id);

-- ===========================================
-- NUEVA TABLA: INCIDENCIA DE VEHÍCULO
-- ===========================================

CREATE TABLE IF NOT EXISTS incidencia_vehiculo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehiculo_id UUID NOT NULL REFERENCES vehiculo(id) ON DELETE CASCADE,
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  fecha DATE NOT NULL,
  tipo incident_type NOT NULL DEFAULT 'otro',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_incidencia_vehiculo ON incidencia_vehiculo(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_incidencia_vehiculo_autoescuela ON incidencia_vehiculo(autoescuela_id);

-- ===========================================
-- ACTUALIZAR TABLA EXPEDIENTE_EXAMEN
-- ===========================================

ALTER TABLE expediente_examen
  ADD COLUMN IF NOT EXISTS hora TIME,
  ADD COLUMN IF NOT EXISTS nombre_convocatoria TEXT,
  ADD COLUMN IF NOT EXISTS centro_examen TEXT,
  ADD COLUMN IF NOT EXISTS intento INT NOT NULL DEFAULT 1;

-- Renombrar 'convocatoria' (int) para evitar conflicto si ya existe
-- El frontend usa 'intento' como número y 'convocatoria' como texto descriptivo

-- ===========================================
-- ACTUALIZAR TABLA FACTURA (ampliar)
-- ===========================================

ALTER TABLE factura
  ADD COLUMN IF NOT EXISTS metodo_pago payment_method,
  ADD COLUMN IF NOT EXISTS fecha_pago DATE,
  ADD COLUMN IF NOT EXISTS notas TEXT;

-- ===========================================
-- NUEVA TABLA: LÍNEAS DE FACTURA
-- ===========================================

CREATE TABLE IF NOT EXISTS linea_factura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID NOT NULL REFERENCES factura(id) ON DELETE CASCADE,
  concepto invoice_line_concept NOT NULL DEFAULT 'otro',
  descripcion TEXT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_linea_factura ON linea_factura(factura_id);

-- ===========================================
-- ACTUALIZAR TABLA ALUMNO (campos opcionales extra)
-- ===========================================

-- Ya está completa, solo asegurar que existe el índice por DNI
CREATE INDEX IF NOT EXISTS idx_alumno_dni ON alumno(dni);
CREATE INDEX IF NOT EXISTS idx_alumno_estado ON alumno(estado);

-- ===========================================
-- ACTUALIZAR TABLA PROFESOR
-- ===========================================

ALTER TABLE profesor
  ADD COLUMN IF NOT EXISTS nombre TEXT,
  ADD COLUMN IF NOT EXISTS apellidos TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT,
  ADD COLUMN IF NOT EXISTS especialidad TEXT,
  ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- ===========================================
-- RLS PARA NUEVAS TABLAS
-- ===========================================

ALTER TABLE coste_vehiculo ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidencia_vehiculo ENABLE ROW LEVEL SECURITY;
ALTER TABLE linea_factura ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own autoescuela costes_vehiculo" ON coste_vehiculo
  FOR ALL USING (autoescuela_id = public.get_autoescuela_id());

CREATE POLICY "Users see own autoescuela incidencias_vehiculo" ON incidencia_vehiculo
  FOR ALL USING (autoescuela_id = public.get_autoescuela_id());

-- Líneas de factura: acceso si la factura pertenece a la autoescuela
CREATE POLICY "Users see own autoescuela lineas_factura" ON linea_factura
  FOR ALL USING (
    factura_id IN (
      SELECT id FROM factura WHERE autoescuela_id = public.get_autoescuela_id()
    )
  );

-- ===========================================
-- ÍNDICES ADICIONALES ÚTILES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_clase_vehiculo ON clase(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_expediente_autoescuela ON expediente_examen(autoescuela_id);
CREATE INDEX IF NOT EXISTS idx_expediente_tipo ON expediente_examen(tipo);
CREATE INDEX IF NOT EXISTS idx_factura_estado ON factura(estado);
CREATE INDEX IF NOT EXISTS idx_factura_autoescuela ON factura(autoescuela_id);
CREATE INDEX IF NOT EXISTS idx_fichaje_autoescuela ON fichaje(autoescuela_id);
CREATE INDEX IF NOT EXISTS idx_fichaje_timestamp ON fichaje(timestamp);
