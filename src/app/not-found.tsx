import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <FileQuestion className="size-20 text-muted-foreground mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Página no encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, no pudimos encontrar la página que buscas.
          Es posible que haya sido movida o no exista.
        </p>
        <Link href="/dashboard">
          <Button>
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}