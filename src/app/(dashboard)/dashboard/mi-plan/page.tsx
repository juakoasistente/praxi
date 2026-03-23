"use client"

import * as React from "react"
import { CreditCard, Check, X, Calendar, Euro, Shield, Users, Car, FileText, Globe, Settings, BarChart3, Headphones, Building2, Zap, Code, Phone, Palette } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PlanFeature {
  name: string
  included: boolean
  description?: string
  icon: React.ComponentType<{ className?: string }>
}

const PLAN_FEATURES: PlanFeature[] = [
  { name: "Gestión de alumnos", included: true, description: "Sin límite de alumnos", icon: Users },
  { name: "Gestión de profesores", included: true, description: "Hasta 10 profesores", icon: Users },
  { name: "Planificación de clases", included: true, description: "Calendario completo", icon: Calendar },
  { name: "Gestión de vehículos", included: true, description: "Hasta 5 vehículos", icon: Car },
  { name: "Facturación automática", included: true, description: "PDF y envío automático", icon: FileText },
  { name: "Portal del alumno", included: true, description: "App móvil incluida", icon: Globe },
  { name: "Fichajes legales", included: true, description: "Cumplimiento normativo", icon: Shield },
  { name: "Estadísticas básicas", included: true, description: "Reportes esenciales", icon: BarChart3 },
  { name: "Soporte técnico", included: true, description: "Email y chat", icon: Headphones },
  { name: "Multi-sede", included: true, description: "Hasta 3 sedes", icon: Building2 },
  { name: "API completa", included: false, description: "Solo en plan Enterprise", icon: Code },
  { name: "Integraciones avanzadas", included: false, description: "Solo en plan Enterprise", icon: Zap },
  { name: "Soporte telefónico", included: false, description: "Solo en plan Enterprise", icon: Phone },
  { name: "Personalización marca", included: false, description: "Solo en plan Enterprise", icon: Palette },
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
    <div className="space-y-8">
      {/* Decorative Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="size-20 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Shield className="size-10 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-md -z-10"></div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mi Plan</h1>
          <p className="text-lg text-muted-foreground mt-2">
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
          <Card className="border-t-4 border-t-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-t-lg" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="size-5 text-blue-600" />
                Funcionalidades incluidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {PLAN_FEATURES.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.name} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-4 ${feature.included ? 'text-blue-600' : 'text-muted-foreground'}`} />
                        <div className="flex-shrink-0">
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
                  )
                })}
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