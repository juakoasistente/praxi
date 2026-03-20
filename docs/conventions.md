# Convenciones del Proyecto — Praxi

## Estructura de Carpetas

```
src/
├── app/                    # App Router (páginas y layouts)
│   ├── (auth)/             # Grupo: páginas públicas (login, register)
│   ├── (dashboard)/        # Grupo: páginas protegidas
│   │   ├── alumnos/
│   │   ├── profesores/
│   │   ├── clases/
│   │   ├── facturacion/
│   │   └── layout.tsx      # Layout con sidebar
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing / redirect
├── components/
│   ├── ui/                 # shadcn/ui (no tocar manualmente)
│   └── [feature]/          # Componentes por feature (alumnos/, clases/, etc.)
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Cliente browser
│   │   ├── server.ts       # Cliente server-side
│   │   └── middleware.ts    # Auth middleware
│   ├── utils.ts            # Utilidades generales (cn, formatDate, etc.)
│   └── types.ts            # Types compartidos
├── hooks/                  # Custom hooks
└── styles/                 # Estilos globales adicionales si hacen falta
```

## Naming Conventions

### Archivos y carpetas
- **Carpetas:** kebab-case (`mis-alumnos/`, `clases-practicas/`)
- **Componentes:** PascalCase archivo (`AlumnoCard.tsx`, `ClaseForm.tsx`)
- **Utilidades/hooks:** camelCase (`useAlumnos.ts`, `formatDate.ts`)
- **Tipos:** PascalCase con sufijo si aplica (`Alumno`, `ClaseConProfesor`)

### Código
- **Componentes:** function declarations con export default para páginas, named export para componentes reutilizables
- **Variables/funciones:** camelCase
- **Constantes:** UPPER_SNAKE_CASE para valores fijos (`MAX_CLASES_DIA`)
- **Tipos de BD:** snake_case (match con Supabase) → camelCase en frontend

## Server vs Client Components

### Server Components (por defecto en App Router)
Usar para:
- Páginas que solo renderizan datos
- Fetching de datos de Supabase
- Layouts estáticos

### Client Components (`'use client'`)
Usar para:
- Formularios con interactividad
- Componentes con estado (useState, useEffect)
- Event handlers (onClick, onChange)
- Componentes shadcn que requieren interactividad

**Regla:** Empezar siempre como Server Component. Añadir `'use client'` solo cuando hace falta.

## Patrón de Datos (Supabase)

### Server Actions (preferido para mutaciones)
```ts
// src/app/(dashboard)/alumnos/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function crearAlumno(formData: FormData) {
  const supabase = await createClient()
  // ...
}
```

### Server Components (para lectura)
```ts
// src/app/(dashboard)/alumnos/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function AlumnosPage() {
  const supabase = await createClient()
  const { data: alumnos } = await supabase.from('alumnos').select('*')
  return <AlumnosList alumnos={alumnos} />
}
```

## Manejo de Errores

- Usar `error.tsx` en cada ruta para errores de página
- Usar `loading.tsx` con Skeleton components de shadcn
- Toast notifications (sonner) para feedback de acciones del usuario
- Nunca silenciar errores — log + mostrar feedback al usuario

## Git

- **Ramas:** `feat/nombre`, `fix/nombre`, `docs/nombre`
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **PRs:** descripción clara de qué cambia y por qué
- **main** siempre deployable

## Idioma

- **Código:** inglés (variables, funciones, componentes)
- **UI/Contenido:** español (textos que ve el usuario)
- **Documentación:** español
- **Commits:** inglés
