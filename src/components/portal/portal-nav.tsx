'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, ClipboardList, CreditCard } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/portal', label: 'Inicio', icon: Home },
  { href: '/portal/clases', label: 'Clases', icon: BookOpen },
  { href: '/portal/examenes', label: 'Exámenes', icon: ClipboardList },
  { href: '/portal/pagos', label: 'Pagos', icon: CreditCard },
]

export function PortalNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/portal'
              ? pathname === '/portal'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
