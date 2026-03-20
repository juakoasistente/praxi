import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PortalNav } from '@/components/portal/portal-nav'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">P</span>
          </div>
          <span className="text-sm font-semibold">Praxi — Mi Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Salir
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-2xl p-4">{children}</div>
      </main>

      {/* Bottom nav */}
      <PortalNav />
    </div>
  )
}
