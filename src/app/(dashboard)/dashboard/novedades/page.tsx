"use client"

import * as React from "react"
import { Megaphone, Calendar, Package, Rocket, Star, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

interface ChangelogEntry {
  version: string
  date: string
  title: string
  changes: string[]
}

export default function NovedadesPage() {
  const [changelog, setChangelog] = React.useState<ChangelogEntry[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchChangelog() {
      try {
        const response = await fetch("/changelog.json")
        const data = await response.json()
        setChangelog(data)
      } catch (error) {
        console.error("Error fetching changelog:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChangelog()
  }, [])

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-8">
      {/* Decorative Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="size-20 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Megaphone className="size-10 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-400/20 to-pink-600/20 blur-md -z-10"></div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Novedades</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Historial de cambios y mejoras de la plataforma
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {changelog.map((entry, index) => (
          <div key={entry.version} className="relative">
            {/* Timeline line */}
            {index !== changelog.length - 1 && (
              <div className="absolute left-4 top-16 h-full w-px bg-border" />
            )}

            {/* Timeline dot */}
            <div className="absolute left-2 top-6 size-4 rounded-full border-2 border-primary bg-gradient-to-br from-orange-500 to-pink-600" />

            {/* Content */}
            <div className="pl-10">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="font-mono bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                        <Rocket className="size-3 mr-1" />
                        v{entry.version}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-800 dark:from-green-900/30 dark:to-blue-900/30 dark:text-green-400 border-0">
                        <Calendar className="size-3 mr-1" />
                        {formatDate(entry.date)}
                      </Badge>
                      <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="size-5 text-purple-600" />
                    {entry.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {entry.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-start gap-2">
                        <div className="mt-2 size-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {change}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {changelog.length === 0 && !loading && (
        <div className="text-center py-12">
          <Megaphone className="size-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay novedades</h3>
          <p className="text-sm text-muted-foreground">
            Las actualizaciones aparecerán aquí cuando estén disponibles.
          </p>
        </div>
      )}
    </div>
  )
}