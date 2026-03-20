'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { RoleProvider } from '@/components/auth/role-provider'
import { getNavItems, type UserRole, type NavItem } from '@/lib/permissions'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { OfflineIndicator } from '@/components/pwa/offline-indicator'
import { BarChart3 } from 'lucide-react'

const LUCIDE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
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
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = item.href === '/dashboard'
          ? pathname === '/dashboard'
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            }`}
          >
            {item.icon.startsWith('/') ? (
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className="shrink-0"
              />
            ) : (
              (() => {
                const Icon = LUCIDE_ICONS[item.icon]
                return Icon ? <Icon className="size-5 shrink-0" /> : null
              })()
            )}
            {item.label}
          </Link>
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

  const userRole = (user?.rol as UserRole) ?? 'admin'
  const navItems = getNavItems(userRole)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">P</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Praxi</span>
          </div>
          <NotificationBell />
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Menú
          </p>
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
              className="flex-1 justify-start text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={handleLogout}
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <span className="text-sm font-bold text-sidebar-primary-foreground">P</span>
                </div>
                <span className="text-lg font-bold tracking-tight">Praxi</span>
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
    </div>
  )
}
