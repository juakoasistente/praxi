'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { RoleProvider } from '@/components/auth/role-provider'
import { getNavItems, type UserRole, type NavItem } from '@/lib/permissions'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { OfflineIndicator } from '@/components/pwa/offline-indicator'
import { LayoutDashboard, Users, GraduationCap, Calendar, Car, Receipt, Clock, ClipboardCheck, BarChart3, Settings, Inbox, FileSignature, FileBarChart, Zap, Building2, ChevronDown, ChevronRight } from 'lucide-react'
import { SedeSelector } from '@/components/sedes/sede-selector'

const LUCIDE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Car,
  Receipt,
  Clock,
  ClipboardCheck,
  BarChart3,
  Settings,
  Inbox,
  FileSignature,
  FileBarChart,
  Zap,
  Building2,
}

interface UserProfile {
  nombre: string
  apellidos: string
  rol: string
  autoescuela_id: string
}

function NavLinks({
  items,
  pathname,
  onClick,
}: {
  items: NavItem[]
  pathname: string
  onClick?: () => void
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('collapsed-groups')
    if (saved) {
      try {
        setCollapsedGroups(new Set(JSON.parse(saved)))
      } catch {
        // Ignore parsing errors
      }
    }
  }, [])

  // Save to localStorage whenever collapsedGroups changes
  useEffect(() => {
    localStorage.setItem('collapsed-groups', JSON.stringify([...collapsedGroups]))
  }, [collapsedGroups])

  // Group items by group
  const groupedItems = items.reduce((groups, item) => {
    const group = item.group
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, NavItem[]>)

  // Determine if a group should be expanded (contains active route)
  const getGroupExpanded = (group: string, groupItems: NavItem[]) => {
    // Principal group is always expanded
    if (group === 'Principal') return true

    // If any item in the group is active, expand the group
    const hasActive = groupItems.some(item =>
      item.href === '/dashboard'
        ? pathname === '/dashboard'
        : pathname.startsWith(item.href)
    )

    if (hasActive) return true

    // Otherwise, check collapsed state
    return !collapsedGroups.has(group)
  }

  const toggleGroup = (group: string) => {
    if (group === 'Principal') return // Principal always expanded

    const newCollapsed = new Set(collapsedGroups)
    if (newCollapsed.has(group)) {
      newCollapsed.delete(group)
    } else {
      newCollapsed.add(group)
    }
    setCollapsedGroups(newCollapsed)
  }

  return (
    <nav className="flex flex-col gap-1">
      {Object.entries(groupedItems).map(([group, groupItems]) => {
        const isExpanded = getGroupExpanded(group, groupItems)

        return (
          <div key={group}>
            <button
              onClick={() => toggleGroup(group)}
              className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground/80 transition-colors ${
                group === 'Principal' ? 'cursor-default' : 'cursor-pointer'
              }`}
              disabled={group === 'Principal'}
            >
              <span>{group}</span>
              {group !== 'Principal' && (
                isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )
              )}
            </button>

            <div className={`transition-all duration-200 overflow-hidden ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-1">
                {groupItems.map((item) => {
                  const isActive = item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClick}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                    >
                      {(() => {
                        const Icon = LUCIDE_ICONS[item.icon]
                        return Icon ? <Icon className="size-5 shrink-0" /> : null
                      })()}
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </nav>
  )
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: UserProfile | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const userRole = (user?.rol as UserRole) ?? 'admin'
  const navItems = getNavItems(userRole)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true)
  }

  const confirmLogout = () => {
    setLogoutDialogOpen(false)
    handleLogout()
  }

  const initials = user
    ? `${user.nombre[0]}${user.apellidos[0]}`.toUpperCase()
    : '??'

  const displayName = user
    ? `${user.nombre} ${user.apellidos}`
    : 'Usuario'

  const rolLabel: Record<string, string> = {
    admin: 'Administrador',
    profesor: 'Profesor',
    secretaria: 'Secretaría',
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
        {/* Logo + notifications */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#4f46e5"}} />
                    <stop offset="100%" style={{stopColor:"#3b38f7"}} />
                  </linearGradient>
                  <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#6366f1"}} />
                    <stop offset="100%" style={{stopColor:"#4f46e5"}} />
                  </linearGradient>
                </defs>
                <path d="M20 15 L20 85 L32 85 L32 55 L60 55 C74 55 82 47 82 35 C82 23 74 15 60 15 L20 15 Z" fill="url(#brand-gradient)" />
                <path d="M32 25 L58 25 C68 25 72 29 72 35 C72 41 68 45 58 45 L32 45 Z" fill="white" />
                <circle cx="15" cy="75" r="3" fill="url(#accent-gradient)" opacity="0.8" />
                <circle cx="35" cy="68" r="2" fill="url(#accent-gradient)" opacity="0.6" />
                <circle cx="55" cy="75" r="2.5" fill="url(#accent-gradient)" opacity="0.7" />
                <circle cx="75" cy="68" r="2" fill="url(#accent-gradient)" opacity="0.5" />
                <path d="M15 75 Q35 65 55 75 Q75 65 85 68" stroke="url(#accent-gradient)" strokeWidth="1.5" fill="none" opacity="0.3" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Praxi</span>
          </div>
          <NotificationBell />
        </div>

        {/* Sede Selector */}
        <div className="px-3 pb-2">
          <SedeSelector />
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <NavLinks items={navItems} pathname={pathname} />
        </div>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-sidebar-foreground/50">
                {rolLabel[user?.rol ?? ''] ?? user?.rol ?? 'Sin rol'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-start text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
              onClick={openLogoutDialog}
            >
              Cerrar sesión
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile header + sheet */}
      <div className="flex flex-1 flex-col">
        <OfflineIndicator />
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground p-0">
              <div className="flex h-16 items-center gap-2.5 px-6">
                <div className="flex h-8 w-8 items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="brand-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:"#4f46e5"}} />
                        <stop offset="100%" style={{stopColor:"#3b38f7"}} />
                      </linearGradient>
                      <linearGradient id="accent-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:"#6366f1"}} />
                        <stop offset="100%" style={{stopColor:"#4f46e5"}} />
                      </linearGradient>
                    </defs>
                    <path d="M20 15 L20 85 L32 85 L32 55 L60 55 C74 55 82 47 82 35 C82 23 74 15 60 15 L20 15 Z" fill="url(#brand-gradient-mobile)" />
                    <path d="M32 25 L58 25 C68 25 72 29 72 35 C72 41 68 45 58 45 L32 45 Z" fill="white" />
                    <circle cx="15" cy="75" r="3" fill="url(#accent-gradient-mobile)" opacity="0.8" />
                    <circle cx="35" cy="68" r="2" fill="url(#accent-gradient-mobile)" opacity="0.6" />
                    <circle cx="55" cy="75" r="2.5" fill="url(#accent-gradient-mobile)" opacity="0.7" />
                    <circle cx="75" cy="68" r="2" fill="url(#accent-gradient-mobile)" opacity="0.5" />
                    <path d="M15 75 Q35 65 55 75 Q75 65 85 68" stroke="url(#accent-gradient-mobile)" strokeWidth="1.5" fill="none" opacity="0.3" />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-tight">Praxi</span>
              </div>
              <div className="px-3 pb-2">
                <SedeSelector />
              </div>
              <div className="px-3">
                <NavLinks
                  items={navItems}
                  pathname={pathname}
                  onClick={() => setMobileOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
          <span className="flex-1 font-semibold">Praxi</span>
          <NotificationBell />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <RoleProvider role={userRole}>
            <div className="p-6 lg:p-8">{children}</div>
          </RoleProvider>
        </main>
        <InstallPrompt />
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cerrar sesión?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cerrar sesión?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmLogout}
            >
              Cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
