-- Praxi: Migración 003 — Modelo multi-sede
-- 
-- Lógica de negocio:
-- - Autoescuela tiene N sedes
-- - Profesores pueden estar en varias sedes (N:M)
-- - Alumnos pertenecen a UNA sede (1:N)
-- - Vehículos tienen sede actual pero pueden cambiar (1:N con historial)
-- - Clases, exámenes, facturas etc. se asocian a una sede

-- ===========================================
-- TABLA SEDE
-- ===========================================

CREATE TABLE sede (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autoescuela_id UUID NOT NULL REFERENCES autoescuela(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  es_principal BOOLEAN DEFAULT false,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sede_autoescuela ON sede(autoescuela_id);

-- ===========================================
-- TABLA PROFESOR_SEDE (N:M)
-- ===========================================

CREATE TABLE profesor_sede (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesor_id UUID NOT NULL REFERENCES profesor(id) ON DELETE CASCADE,
  sede_id UUID NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  es_sede_principal BOOLEAN DEFAULT false, -- sede "base" del profesor
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profesor_id, sede_id)
);

CREATE INDEX idx_profesor_sede_profesor ON profesor_sede(profesor_id);
CREATE INDEX idx_profesor_sede_sede ON profesor_sede(sede_id);

-- ===========================================
-- AÑADIR sede_id A TABLAS EXISTENTES
-- ===========================================

-- Alumno: pertenece a UNA sede
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS sede_id UUID REFERENCES sede(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_alumno_sede ON alumno(sede_id);

-- Vehículo: sede actual (puede cambiar)
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS sede_id UUID REFERENCES sede(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_vehiculo_sede ON vehiculo(sede_id);

-- Clase: se da en una sede
ALTER TABLE clase ADD COLUMN IF NOT EXISTS sede_id UUID REFERENCES sede(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_clase_sede ON clase(sede_id);

-- Expediente examen: presentado desde una sede
ALTER TABLE expediente_examen ADD COLUMN IF NOT EXISTS sede_id UUID REFERENCES sede(id) ON DELETE SET NULL;

-- Factura: emitida desde una sede
ALTER TABLE factura ADD COLUMN IF NOT EXISTS sede_id UUID REFERENCES sede(id) ON DELETE SET NULL;

-- Fichaje: en qué sede ficha
ALTER TABLE fichaje ADD COLUMN IF NOT EXISTS sede_id UUID REFERENCES sede(id) ON DELETE SET NULL;

-- ===========================================
-- HISTORIAL DE CAMBIO DE SEDE (vehículos)
-- ===========================================

CREATE TABLE vehiculo_sede_historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehiculo_id UUID NOT NULL REFERENCES vehiculo(id) ON DELETE CASCADE,
  sede_origen_id UUID REFERENCES sede(id) ON DELETE SET NULL,
  sede_destino_id UUID NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  motivo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vehiculo_sede_hist ON vehiculo_sede_historial(vehiculo_id);

-- ===========================================
-- RLS PARA NUEVAS TABLAS
-- ===========================================

ALTER TABLE sede ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_sede ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculo_sede_historial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own autoescuela sedes" ON sede
  FOR ALL USING (autoescuela_id = public.get_autoescuela_id());

CREATE POLICY "Users see own autoescuela profesor_sede" ON profesor_sede
  FOR ALL USING (
    profesor_id IN (
      SELECT id FROM profesor WHERE autoescuela_id = public.get_autoescuela_id()
    )
  );

CREATE POLICY "Users see own autoescuela vehiculo_historial" ON vehiculo_sede_historial
  FOR ALL USING (
    vehiculo_id IN (
      SELECT id FROM vehiculo WHERE autoescuela_id = public.get_autoescuela_id()
    )
  );
