export type UserRole = "admin" | "profesor" | "secretario"

export interface NavItem {
  href: string
  label: string
  icon: string
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "/icons/dashboard.png" },
  { href: "/dashboard/alumnos", label: "Alumnos", icon: "/icons/alumnos.png" },
  { href: "/dashboard/profesores", label: "Profesores", icon: "/icons/profesores.png" },
  { href: "/dashboard/clases", label: "Clases", icon: "/icons/clases.png" },
  { href: "/dashboard/vehiculos", label: "Vehículos", icon: "/icons/vehiculos.png" },
  { href: "/dashboard/facturacion", label: "Facturación", icon: "/icons/facturacion.png" },
  { href: "/dashboard/fichajes", label: "Fichajes", icon: "/icons/fichajes.png" },
  { href: "/dashboard/examenes", label: "Exámenes", icon: "/icons/examenes.png" },
  { href: "/dashboard/estadisticas", label: "Estadísticas", icon: "BarChart3" },
]

const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: [
    "/dashboard",
    "/dashboard/alumnos",
    "/dashboard/profesores",
    "/dashboard/clases",
    "/dashboard/vehiculos",
    "/dashboard/facturacion",
    "/dashboard/examenes",
    "/dashboard/fichajes",
    "/dashboard/estadisticas",
  ],
  profesor: [
    "/dashboard",
    "/dashboard/clases",
    "/dashboard/alumnos",
    "/dashboard/fichajes",
    "/dashboard/examenes",
  ],
  secretario: [
    "/dashboard",
    "/dashboard/alumnos",
    "/dashboard/clases",
    "/dashboard/examenes",
    "/dashboard/facturacion",
    "/dashboard/fichajes",
  ],
}

const ROLE_WRITE: Record<UserRole, string[]> = {
  admin: ["alumnos", "profesores", "clases", "vehiculos", "facturacion", "examenes", "fichajes"],
  profesor: ["clases", "fichajes"],
  secretario: ["alumnos", "clases", "examenes", "facturacion", "fichajes"],
}

export function canAccess(role: UserRole, path: string): boolean {
  const routes = ROLE_ROUTES[role]
  if (!routes) return false
  return routes.some((route) =>
    path === route || path.startsWith(route + "/")
  )
}

export function canWrite(role: UserRole, entity: string): boolean {
  const entities = ROLE_WRITE[role]
  if (!entities) return false
  return entities.includes(entity)
}

export function getNavItems(role: UserRole): NavItem[] {
  const routes = ROLE_ROUTES[role]
  if (!routes) return []
  return ALL_NAV_ITEMS.filter((item) => routes.includes(item.href))
}
