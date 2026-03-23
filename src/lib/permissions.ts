export type UserRole = "admin" | "profesor" | "secretario"

export interface NavItem {
  href: string
  label: string
  icon: string
  group: string
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", group: "Principal" },
  { href: "/dashboard/alumnos", label: "Alumnos", icon: "Users", group: "Gestión" },
  { href: "/dashboard/profesores", label: "Personal", icon: "GraduationCap", group: "Gestión" },
  { href: "/dashboard/clases", label: "Clases", icon: "Calendar", group: "Gestión" },
  { href: "/dashboard/vehiculos", label: "Vehículos", icon: "Car", group: "Gestión" },
  { href: "/dashboard/examenes", label: "Exámenes", icon: "ClipboardCheck", group: "Gestión" },
  { href: "/dashboard/facturacion", label: "Facturación", icon: "Receipt", group: "Finanzas" },
  { href: "/dashboard/contratos", label: "Contratos", icon: "FileSignature", group: "Finanzas" },
  { href: "/dashboard/fichajes", label: "Fichajes", icon: "Clock", group: "Administración" },
  { href: "/dashboard/sedes", label: "Sedes", icon: "Building2", group: "Administración" },
  { href: "/dashboard/inbox", label: "Inbox", icon: "Inbox", group: "Comunicación" },
  { href: "/dashboard/automatizaciones", label: "Automatizaciones", icon: "Zap", group: "Comunicación" },
  { href: "/dashboard/estadisticas", label: "Estadísticas", icon: "BarChart3", group: "Análisis" },
  { href: "/dashboard/informes", label: "Informes", icon: "FileBarChart", group: "Análisis" },
  { href: "/dashboard/dgt", label: "Trámites DGT", icon: "Building2", group: "Administración" },
  { href: "/dashboard/novedades", label: "Novedades", icon: "Megaphone", group: "Administración" },
  { href: "/dashboard/mi-plan", label: "Mi plan", icon: "CreditCard", group: "Administración" },
  { href: "/dashboard/configuracion", label: "Configuración", icon: "Settings", group: "Administración" },
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
    "/dashboard/sedes",
    "/dashboard/inbox",
    "/dashboard/contratos",
    "/dashboard/estadisticas",
    "/dashboard/informes",
    "/dashboard/automatizaciones",
    "/dashboard/dgt",
    "/dashboard/novedades",
    "/dashboard/mi-plan",
    "/dashboard/configuracion",
  ],
  profesor: [
    "/dashboard",
    "/dashboard/clases",
    "/dashboard/alumnos",
    "/dashboard/fichajes",
    "/dashboard/examenes",
    "/dashboard/mi-plan",
  ],
  secretario: [
    "/dashboard",
    "/dashboard/alumnos",
    "/dashboard/clases",
    "/dashboard/examenes",
    "/dashboard/facturacion",
    "/dashboard/fichajes",
    "/dashboard/contratos",
    "/dashboard/inbox",
    "/dashboard/dgt",
    "/dashboard/mi-plan",
  ],
}

const ROLE_WRITE: Record<UserRole, string[]> = {
  admin: ["alumnos", "profesores", "clases", "vehiculos", "facturacion", "examenes", "fichajes", "sedes", "configuracion", "inbox", "contratos", "automatizaciones", "dgt"],
  profesor: ["clases", "fichajes"],
  secretario: ["alumnos", "clases", "examenes", "facturacion", "fichajes", "inbox", "contratos", "dgt"],
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

export function getCustomPermissions(userId: string): string[] {
  // In production, this would fetch from database
  // For demo, we use localStorage
  if (typeof window === 'undefined') return []

  const savedPermissions = localStorage.getItem(`user_permissions_${userId}`)
  return savedPermissions ? JSON.parse(savedPermissions) : []
}

export function canWriteWithCustom(role: UserRole, entity: string, userId?: string): boolean {
  // Admin always has all permissions
  if (role === "admin") return true

  // Check base role permissions first
  const basePermissions = ROLE_WRITE[role] || []
  if (basePermissions.includes(entity)) return true

  // Check custom permissions if userId provided
  if (userId) {
    const customPermissions = getCustomPermissions(userId)
    return customPermissions.includes(entity)
  }

  return false
}
