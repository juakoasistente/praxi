"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  GraduationCap,
  Calendar,
  Car,
  Receipt,
  Clock,
  Inbox,
  Building2,
  Check,
  X,
  ChevronDown,
  Menu,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-primary">
                Praxi
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Funcionalidades
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Precios
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Contacto
                </button>
              </div>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Iniciar sesión</Button>
              </Link>
              <Button onClick={() => scrollToSection('cta-final')}>
                Solicitar demo
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-b border-border">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary"
              >
                Precios
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary"
              >
                Contacto
              </button>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">Iniciar sesión</Button>
                </Link>
                <Button
                  onClick={() => scrollToSection('cta-final')}
                  className="w-full"
                >
                  Solicitar demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Gestiona tu autoescuela
            <br />
            <span className="text-primary">sin complicaciones</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Alumnos, profesores, clases, exámenes, facturación y fichaje legal.
            Todo en un solo lugar, desde cualquier dispositivo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection('cta-final')}
              className="text-lg px-8 py-4"
            >
              Solicitar demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('features')}
              className="text-lg px-8 py-4"
            >
              Ver funcionalidades
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              ¿Todavía gestionas tu autoescuela con Excel?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Papeles por todas partes</h3>
                <p className="text-muted-foreground">
                  Contratos, fichas, documentos DGT desperdigados.
                  Sin orden ni control de versiones.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Multas por fichaje</h3>
                <p className="text-muted-foreground">
                  La normativa exige registro digital de jornada.
                  Las multas empiezan en 626€.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sin visibilidad</h3>
                <p className="text-muted-foreground">
                  No sabes qué pasa en tu autoescuela en tiempo real.
                  Decisiones a ciegas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas en una sola plataforma
            </h2>
            <p className="text-xl text-muted-foreground">
              Gestión completa para autoescuelas modernas
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Alumnos",
                description: "Matrícula, seguimiento, historial completo"
              },
              {
                icon: GraduationCap,
                title: "Profesores",
                description: "Horarios flexibles multi-sede"
              },
              {
                icon: Calendar,
                title: "Clases",
                description: "Agenda con disponibilidad automática"
              },
              {
                icon: Car,
                title: "Vehículos",
                description: "Flota, costes, amortización, comparador"
              },
              {
                icon: Receipt,
                title: "Facturación",
                description: "Facturas, bonos, pagos parciales, PDF"
              },
              {
                icon: Clock,
                title: "Fichaje legal",
                description: "Cumple RDL 8/2019, exportable para inspección"
              },
              {
                icon: Inbox,
                title: "Inbox",
                description: "WhatsApp, Instagram y email en un solo lugar"
              },
              {
                icon: Building2,
                title: "Multi-sede",
                description: "Gestiona todas tus sedes desde una app"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              ¿Por qué Praxi?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Praxi */}
            <Card className="relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Recomendado
              </Badge>
              <CardContent className="pt-8">
                <h3 className="text-xl font-bold text-center mb-6">Praxi</h3>
                <ul className="space-y-3">
                  {[
                    "Cloud nativo",
                    "Multi-sede incluido",
                    "Fichaje legal incluido",
                    "Portal alumno incluido",
                    "Inbox unificado",
                    "Precio transparente"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Excel */}
            <Card>
              <CardContent className="pt-8">
                <h3 className="text-xl font-bold text-center mb-6">Excel</h3>
                <ul className="space-y-3">
                  {[
                    "Solo local",
                    "Una sede máximo",
                    "Sin fichaje legal",
                    "Sin portal alumno",
                    "Sin comunicación",
                    "Gratis (pero sin control)"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <X className="h-5 w-5 text-destructive mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Software tradicional */}
            <Card>
              <CardContent className="pt-8">
                <h3 className="text-xl font-bold text-center mb-6">Software tradicional</h3>
                <ul className="space-y-3">
                  {[
                    "Instalación desktop",
                    "Multi-sede: coste extra",
                    "Fichaje: coste extra",
                    "Portal: coste extra",
                    "Inbox: no incluido",
                    "Módulos separados"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <X className="h-5 w-5 text-destructive mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Precios sencillos, sin sorpresas
            </h2>
            <p className="text-xl text-muted-foreground">
              Todos los planes incluyen: fichaje legal, portal alumno, soporte técnico
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Starter</h3>
                  <p className="text-muted-foreground mb-4">Para una sede</p>
                  <div className="text-3xl font-bold">
                    Próximamente
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "Hasta 100 alumnos",
                    "1 sede",
                    "Fichaje legal incluido",
                    "Portal alumno",
                    "Soporte email"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant="outline" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            {/* Profesional */}
            <Card className="relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Más popular
              </Badge>
              <CardContent className="pt-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Profesional</h3>
                  <p className="text-muted-foreground mb-4">Multi-sede</p>
                  <div className="text-3xl font-bold">
                    Consultar
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "Alumnos ilimitados",
                    "Sedes ilimitadas",
                    "Inbox unificado",
                    "Fichaje legal incluido",
                    "Portal alumno",
                    "Soporte prioritario"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" onClick={() => scrollToSection('cta-final')}>
                  Solicitar demo
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <p className="text-muted-foreground mb-4">A medida</p>
                  <div className="text-3xl font-bold">
                    Contactar
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "Todo lo de Profesional",
                    "Integraciones personalizadas",
                    "API access",
                    "Soporte dedicado",
                    "Formación incluida",
                    "SLA garantizado"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant="outline" onClick={() => scrollToSection('contact')}>
                  Contactar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta-final" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            ¿Listo para modernizar tu autoescuela?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Prueba Praxi gratis durante 14 días. Sin compromiso.
          </p>
          <Button size="lg" className="text-lg px-10 py-4 mb-6">
            Solicitar demo gratuita
          </Button>
          <p className="text-muted-foreground">
            ¿Preguntas? Llámanos al <strong>XXX XXX XXX</strong>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
                Praxi
              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                Software de gestión de autoescuelas. Moderno, completo y fácil de usar.
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Smartphone className="h-4 w-4 mr-2" />
                Disponible como PWA en todos los dispositivos
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => scrollToSection('features')}>Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection('pricing')}>Precios</button></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Aviso legal</a></li>
                <li><a href="#" className="hover:text-foreground">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-foreground">Política de cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>© 2026 Praxi — Software de gestión de autoescuelas</p>
          </div>
        </div>
      </footer>
    </div>
  )
}