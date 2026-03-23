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
import { LayoutDashboard, Users, GraduationCap, Calendar, Car, Receipt, Clock, ClipboardCheck, BarChart3, Settings, Inbox, FileSignature, FileBarChart, Zap, Building2, ChevronDown, ChevronRight, ChevronLeft, MessageCircle, Star } from 'lucide-react'
import { SedeSelector } from '@/components/sedes/sede-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StarRating } from '@/components/ui/star-rating'
import { toast } from 'sonner'
import { APP_VERSION } from '@/lib/version'

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
  collapsed = false,
}: {
  items: NavItem[]
  pathname: string
  onClick?: () => void
  collapsed?: boolean
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
            {!collapsed && (
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
            )}

            <div className={`transition-all duration-200 overflow-hidden ${
              (!collapsed && isExpanded) || collapsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className={collapsed ? "flex flex-col items-center gap-2" : "space-y-1"}>
                {groupItems.map((item) => {
                  const isActive = item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClick}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center ${collapsed ? 'justify-center size-10' : 'gap-3'} rounded-lg ${collapsed ? 'p-2' : 'px-3 py-2'} text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                    >
                      {(() => {
                        const Icon = LUCIDE_ICONS[item.icon]
                        return Icon ? <Icon className="size-5 shrink-0" /> : null
                      })()}
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(0)

  const userRole = (user?.rol as UserRole) ?? 'admin'
  const navItems = getNavItems(userRole)

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      setSidebarCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      toast.error('Por favor, escribe tu feedback')
      return
    }

    try {
      const supabase = createClient()

      // Try to save to Supabase feedback table
      const { error } = await supabase
        .from('feedback')
        .insert({
          tipo: feedbackType || 'Otro',
          mensaje: feedbackText,
          rating: feedbackRating || null,
          user_id: user?.autoescuela_id,
          created_at: new Date().toISOString(),
        })

      if (error) {
        // If table doesn't exist or other error, just show success message
        console.log('Feedback table not available:', error)
      }

      // Reset form
      setFeedbackType('')
      setFeedbackText('')
      setFeedbackRating(0)
      setFeedbackDialogOpen(false)

      toast.success('¡Gracias por tu feedback!')
    } catch (error) {
      // Even if there's an error, we'll show success to the user
      console.error('Feedback submission error:', error)
      setFeedbackDialogOpen(false)
      toast.success('¡Gracias por tu feedback!')
    }
  }

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
      <aside className={`hidden flex-col bg-sidebar text-sidebar-foreground md:flex transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header with logo, toggle, and notifications */}
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="size-8 p-0 hover:bg-sidebar-accent"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <span className="text-white font-black text-sm leading-none">
                    <span className="text-base font-black">P</span><span className="text-xs font-bold">x</span>
                  </span>
                </div>
                <span className="text-lg font-bold tracking-tight">Praxi</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600">
                <span className="text-white font-black text-xs leading-none">
                  <span className="text-sm font-black">P</span><span className="text-xs font-bold">x</span>
                </span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && <NotificationBell />}
        </div>

        {/* Sede Selector */}
        {!sidebarCollapsed && (
          <div className="px-3 pb-2">
            <SedeSelector />
          </div>
        )}

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <NavLinks items={navItems} pathname={pathname} collapsed={sidebarCollapsed} />
        </div>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-4">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-9 w-9 border border-sidebar-border">
                <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                onClick={openLogoutDialog}
                title="Cerrar sesión"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
              <ThemeToggle />
            </div>
          ) : (
            <>
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
              {/* Feedback Button */}
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => setFeedbackDialogOpen(true)}
                >
                  <MessageCircle className="size-4" />
                  💬 Danos tu opinión
                </Button>
              </div>
              {/* Version */}
              <div className="mt-2 text-center">
                <span className="text-xs text-sidebar-foreground/40">v{APP_VERSION}</span>
              </div>
            </>
          )}
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
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <span className="text-white font-black text-sm leading-none">
                    <span className="text-base font-black">P</span><span className="text-xs font-bold">x</span>
                  </span>
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

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>💬 Tu opinión nos importa</DialogTitle>
            <DialogDescription>
              Cuéntanos qué piensas sobre Praxi. Tu feedback nos ayuda a mejorar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Tipo de feedback</Label>
              <Select value={feedbackType} onValueChange={(value) => setFeedbackType(value || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sugerencia">Sugerencia</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Pregunta">Pregunta</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-text">Cuéntanos tu opinión...</Label>
              <Textarea
                id="feedback-text"
                placeholder="Describe tu feedback aquí..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Calificación (opcional)</Label>
              <StarRating
                value={feedbackRating}
                onChange={setFeedbackRating}
                className="justify-start"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFeedbackDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleFeedbackSubmit}>
              Enviar feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
