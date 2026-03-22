"use client"

import * as React from "react"
import { CreditCard, Check, X, Calendar, Euro } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PlanFeature {
  name: string
  included: boolean
  description?: string
}

const PLAN_FEATURES: PlanFeature[] = [
  { name: "Gestión de alumnos", included: true, description: "Sin límite de alumnos" },
  { name: "Gestión de profesores", included: true, description: "Hasta 10 profesores" },
  { name: "Planificación de clases", included: true, description: "Calendario completo" },
  { name: "Gestión de vehículos", included: true, description: "Hasta 5 vehículos" },
  { name: "Facturación automática", included: true, description: "PDF y envío automático" },
  { name: "Portal del alumno", included: true, description: "App móvil incluida" },
  { name: "Fichajes legales", included: true, description: "Cumplimiento normativo" },
  { name: "Estadísticas básicas", included: true, description: "Reportes esenciales" },
  { name: "Soporte técnico", included: true, description: "Email y chat" },
  { name: "Multi-sede", included: true, description: "Hasta 3 sedes" },
  { name: "API completa", included: false, description: "Solo en plan Enterprise" },
  { name: "Integraciones avanzadas", included: false, description: "Solo en plan Enterprise" },
  { name: "Soporte telefónico", included: false, description: "Solo en plan Enterprise" },
  { name: "Personalización marca", included: false, description: "Solo en plan Enterprise" },
]

export default function MiPlanPage() {
  function handleChangePlan() {
    toast.info("Contacta con soporte para cambiar de plan")
  }

  function handleBillingHistory() {
    toast.info("Historial de facturación", {
      description: "No tienes facturas previas en este momento"
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
          <CreditCard className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mi plan</h1>
          <p className="text-sm text-muted-foreground">
            Información sobre tu suscripción actual
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Plan Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plan actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Plan</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                    Profesional
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio</span>
                  <div className="flex items-center gap-1">
                    <Euro className="size-4" />
                    <span className="font-semibold">49€/mes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Renovación</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="size-4" />
                    <span>22/04/2026</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                    Activo
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleChangePlan}
                >
                  Cambiar plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleBillingHistory}
                >
                  Historial de facturación
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Funcionalidades incluidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {PLAN_FEATURES.map((feature) => (
                  <div key={feature.name} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className="flex-shrink-0 mt-0.5">
                      {feature.included ? (
                        <div className="flex items-center justify-center size-5 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="size-3 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center size-5 rounded-full bg-red-100 dark:bg-red-900/30">
                          <X className="size-3 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium">{feature.name}</h4>
                      {feature.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="size-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">¿Necesitas más funcionalidades?</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contacta con nuestro equipo de ventas para conocer el plan Enterprise con funcionalidades avanzadas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}