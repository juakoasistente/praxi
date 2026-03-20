import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-primary-foreground">
            🚗
          </div>
          <CardTitle className="text-3xl font-bold">Praxi</CardTitle>
          <CardDescription className="text-lg">
            Gestión de Autoescuelas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Plataforma moderna para gestionar tu autoescuela: alumnos,
            profesores, clases prácticas y mucho más.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">Supabase</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
          </div>
          <Button className="w-full" size="lg">
            Empezar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
