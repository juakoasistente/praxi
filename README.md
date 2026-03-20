# 🚗 Praxi — Gestión de Autoescuelas

Plataforma moderna para gestionar tu autoescuela: alumnos, profesores, clases prácticas, facturación y mucho más.

## Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router + TypeScript)
- **Base de datos:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
- **UI:** [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Recursos UI:** [21st.dev](https://21st.dev/) para componentes adicionales

## Requisitos

- Node.js 18+
- npm 9+
- Cuenta de Supabase (free tier)

## Correr en Local

```bash
# 1. Clonar el repo
git clone https://github.com/juakoasistente/praxi.git
cd praxi

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública) de Supabase |

## Estructura del Proyecto

```
src/
├── app/                    # Páginas y layouts (App Router)
│   ├── (auth)/             # Páginas públicas (login)
│   ├── (dashboard)/        # Páginas protegidas (gestión)
│   └── page.tsx            # Landing
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   └── [feature]/          # Componentes por feature
├── lib/                    # Utilidades, cliente Supabase, types
└── hooks/                  # Custom hooks
```

Ver [docs/conventions.md](docs/conventions.md) para convenciones detalladas.

## Documentación

- [Convenciones del proyecto](docs/conventions.md)
- [Decisiones de diseño](docs/design-decisions.md)
- [Backlog de features](docs/features-backlog.md)

## Contribuir

1. Crea una rama: `feat/mi-feature` o `fix/mi-fix`
2. Commits con [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`
3. Abre un PR con descripción clara
4. Código en inglés, UI en español

## Licencia

Privado — todos los derechos reservados.
