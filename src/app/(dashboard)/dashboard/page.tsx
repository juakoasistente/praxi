import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { count: alumnosCount } = await supabase
    .from('alumno')
    .select('*', { count: 'exact', head: true })
    .neq('estado', 'baja')

  const { count: profesoresCount } = await supabase
    .from('profesor')
    .select('*', { count: 'exact', head: true })

  const today = new Date().toISOString().split('T')[0]
  const { count: clasesHoy } = await supabase
    .from('clase')
    .select('*', { count: 'exact', head: true })
    .eq('fecha', today)

  const { count: facturasPendientes } = await supabase
    .from('factura')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'pendiente')

  const stats = [
    {
      title: 'Alumnos activos',
      value: alumnosCount ?? 0,
      icon: '/icons/alumnos.png',
      description: 'Matriculados y en curso',
      href: '/dashboard/alumnos',
      color: 'bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/30',
    },
    {
      title: 'Profesores',
      value: profesoresCount ?? 0,
      icon: '/icons/profesores.png',
      description: 'En plantilla',
      href: '/dashboard/profesores',
      color: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/30',
    },
    {
      title: 'Clases hoy',
      value: clasesHoy ?? 0,
      icon: '/icons/clases.png',
      description: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
      href: '/dashboard/clases',
      color: 'bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/30',
    },
    {
      title: 'Facturas pendientes',
      value: facturasPendientes ?? 0,
      icon: '/icons/facturacion.png',
      description: 'Por cobrar',
      href: '/dashboard/facturacion',
      color: 'bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/30',
    },
  ]

  const quickLinks = [
    {
      title: 'Nuevo alumno',
      description: 'Matricular un alumno',
      icon: '/icons/alumnos.png',
      href: '/dashboard/alumnos',
    },
    {
      title: 'Programar clase',
      description: 'Asignar clase práctica',
      icon: '/icons/clases.png',
      href: '/dashboard/clases',
    },
    {
      title: 'Subir a examen',
      description: 'Gestionar presentaciones',
      icon: '/icons/examenes.png',
      href: '/dashboard/examenes',
    },
    {
      title: 'Fichaje',
      description: 'Registrar entrada/salida',
      icon: '/icons/fichajes.png',
      href: '/dashboard/fichajes',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen general de tu autoescuela
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className={`border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${stat.color}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="rounded-lg bg-white/80 dark:bg-white/10 p-2 shadow-sm">
                  <Image
                    src={stat.icon}
                    alt={stat.title}
                    width={24}
                    height={24}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Acciones rápidas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg bg-primary/5 p-2.5">
                    <Image
                      src={link.icon}
                      alt={link.title}
                      width={28}
                      height={28}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{link.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts & lists */}
      <DashboardCharts />
    </div>
  )
}
