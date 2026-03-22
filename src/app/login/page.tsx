'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brand-gradient-login" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#ffffff"}} />
                <stop offset="100%" style={{stopColor:"#f1f5f9"}} />
              </linearGradient>
              <linearGradient id="accent-gradient-login" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#ffffff"}} />
                <stop offset="100%" style={{stopColor:"#e2e8f0"}} />
              </linearGradient>
            </defs>
            <path d="M20 15 L20 85 L32 85 L32 55 L60 55 C74 55 82 47 82 35 C82 23 74 15 60 15 L20 15 Z" fill="url(#brand-gradient-login)" />
            <path d="M32 25 L58 25 C68 25 72 29 72 35 C72 41 68 45 58 45 L32 45 Z" fill="currentColor" />
            <circle cx="15" cy="75" r="3" fill="url(#accent-gradient-login)" opacity="0.8" />
            <circle cx="35" cy="68" r="2" fill="url(#accent-gradient-login)" opacity="0.6" />
            <circle cx="55" cy="75" r="2.5" fill="url(#accent-gradient-login)" opacity="0.7" />
            <circle cx="75" cy="68" r="2" fill="url(#accent-gradient-login)" opacity="0.5" />
            <path d="M15 75 Q35 65 55 75 Q75 65 85 68" stroke="url(#accent-gradient-login)" strokeWidth="1.5" fill="none" opacity="0.3" />
          </svg>
          <h1 className="text-3xl font-bold tracking-tight">Praxi</h1>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold leading-tight">
            Gestiona tu autoescuela de forma sencilla
          </h2>
          <p className="text-lg opacity-80">
            Alumnos, profesores, clases, exámenes y facturación. Todo en un solo lugar.
          </p>
        </div>
        <p className="text-sm opacity-60">© 2026 Praxi</p>
      </div>

      {/* Right panel - login form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-card">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <div className="flex items-center gap-2 mb-1">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="brand-gradient-mobile-login" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#4f46e5"}} />
                    <stop offset="100%" style={{stopColor:"#3b38f7"}} />
                  </linearGradient>
                  <linearGradient id="accent-gradient-mobile-login" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#6366f1"}} />
                    <stop offset="100%" style={{stopColor:"#4f46e5"}} />
                  </linearGradient>
                </defs>
                <path d="M20 15 L20 85 L32 85 L32 55 L60 55 C74 55 82 47 82 35 C82 23 74 15 60 15 L20 15 Z" fill="url(#brand-gradient-mobile-login)" />
                <path d="M32 25 L58 25 C68 25 72 29 72 35 C72 41 68 45 58 45 L32 45 Z" fill="white" />
                <circle cx="15" cy="75" r="3" fill="url(#accent-gradient-mobile-login)" opacity="0.8" />
                <circle cx="35" cy="68" r="2" fill="url(#accent-gradient-mobile-login)" opacity="0.6" />
                <circle cx="55" cy="75" r="2.5" fill="url(#accent-gradient-mobile-login)" opacity="0.7" />
                <circle cx="75" cy="68" r="2" fill="url(#accent-gradient-mobile-login)" opacity="0.5" />
                <path d="M15 75 Q35 65 55 75 Q75 65 85 68" stroke="url(#accent-gradient-mobile-login)" strokeWidth="1.5" fill="none" opacity="0.3" />
              </svg>
              <h1 className="text-2xl font-bold text-primary">Praxi</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestión de autoescuelas
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Iniciar sesión
            </h2>
            <p className="text-sm text-muted-foreground">
              Introduce tus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
