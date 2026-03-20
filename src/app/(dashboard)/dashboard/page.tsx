import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Contar alumnos activos
  const { count: alumnosCount } = await supabase
    .from('alumno')
    .select('*', { count: 'exact', head: true })
    .neq('estado', 'baja')

  // Contar profesores
  const { count: profesoresCount } = await supabase
    .from('profesor')
    .select('*', { count: 'exact', head: true })

  // Clases de hoy
  const today = new Date().toISOString().split('T')[0]
  const { count: clasesHoy } = await supabase
    .from('clase')
    .select('*', { count: 'exact', head: true })
    .eq('fecha', today)

  // Facturas pendientes
  const { count: facturasPendientes } = await supabase
    .from('factura')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'pendiente')

  const stats = [
    {
      title: 'Alumnos activos',
      value: alumnosCount ?? 0,
      icon: '👤',
      description: 'matriculados y en curso',
    },
    {
      title: 'Profesores',
      value: profesoresCount ?? 0,
      icon: '👨‍🏫',
      description: 'en plantilla',
    },
    {
      title: 'Clases hoy',
      value: clasesHoy ?? 0,
      icon: '📅',
      description: today,
    },
    {
      title: 'Facturas pendientes',
      value: facturasPendientes ?? 0,
      icon: '💰',
      description: 'por cobrar',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu autoescuela
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
