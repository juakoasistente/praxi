'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

interface UserProfile {
  nombre: string
  apellidos: string
  rol: string
  autoescuela_id: string
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/alumnos', label: 'Alumnos', icon: '👤' },
  { href: '/dashboard/profesores', label: 'Profesores', icon: '👨‍🏫' },
  { href: '/dashboard/clases', label: 'Clases', icon: '📅' },
  { href: '/dashboard/vehiculos', label: 'Vehículos', icon: '🚗' },
  { href: '/dashboard/facturacion', label: 'Facturación', icon: '💰' },
  { href: '/dashboard/fichajes', label: 'Fichajes', icon: '⏱️' },
  { href: '/dashboard/examenes', label: 'Exámenes', icon: '📝' },
]

function NavLinks({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
            pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = user
    ? `${user.nombre[0]}${user.apellidos[0]}`.toUpperCase()
    : '??'

  return (
    <div className="flex h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-3">
          <span className="text-2xl">🚗</span>
          <span className="text-xl font-bold">Praxi</span>
        </div>
        <NavLinks pathname={pathname} />
        <div className="mt-auto">
          <Separator className="my-4" />
          <div className="flex items-center gap-3 px-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">
                {user?.nombre} {user?.apellidos}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.rol}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Mobile header + sheet */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-accent hover:text-accent-foreground">
                ☰
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <div className="mb-6 flex items-center gap-2 px-3">
                <span className="text-2xl">🚗</span>
                <span className="text-xl font-bold">Praxi</span>
              </div>
              <NavLinks
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <span className="font-semibold">Praxi</span>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
