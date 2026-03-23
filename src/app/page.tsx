"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
  Star,
  MessageCircle,
  Camera,
  Mail,
  ArrowRight,
  LayoutDashboard,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isInView])

  return <span ref={ref}>{count}</span>
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 text-white">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
                  <span className="text-white font-black text-sm leading-none">
                    <span className="text-sm font-black">P</span><span className="text-xs font-bold">x</span>
                  </span>
                </div>
                <span className="text-xl font-bold tracking-tight">Praxi</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Funcionalidades
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Precios
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contacto
                </button>
              </div>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white border-white/20 hover:bg-white/10">
                  Iniciar sesión
                </Button>
              </Link>
              <Button
                onClick={() => scrollToSection('cta-final')}
                className="bg-white text-slate-900 hover:bg-white/90"
              >
                Empezar gratis
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 bg-slate-950/95 backdrop-blur-xl border-b border-white/10">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white"
              >
                Precios
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white"
              >
                Contacto
              </button>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Link href="/login" className="w-full">
                  <Button variant="ghost" className="w-full text-white border-white/20">
                    Iniciar sesión
                  </Button>
                </Link>
                <Button
                  onClick={() => scrollToSection('cta-final')}
                  className="w-full bg-white text-slate-900"
                >
                  Empezar gratis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"
          />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Badge className="bg-white/10 text-white border-white/20 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/20 transition-all cursor-default">
                ✨ Nuevo: Fichaje legal incluido
              </Badge>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              La gestión de tu autoescuela,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                simplificada
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl sm:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Todo lo que necesitas en una sola plataforma: alumnos, profesores,
              clases, facturación y fichaje legal. Sin complicaciones.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('cta-final')}
                className="text-lg px-8 py-6 bg-white text-slate-900 hover:bg-white/90 transition-all hover:scale-105"
              >
                Empezar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => scrollToSection('features')}
                className="text-lg px-8 py-6 text-white border-white/20 hover:bg-white/10"
              >
                Ver demo
              </Button>
            </motion.div>

            {/* Mock Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mx-auto max-w-5xl"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl blur-2xl transform rotate-1" />
                <div className="relative bg-slate-900/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                      <div className="text-white/60 text-sm mb-2">Alumnos activos</div>
                      <div className="text-white text-2xl font-bold">247</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                      <div className="text-white/60 text-sm mb-2">Clases hoy</div>
                      <div className="text-white text-2xl font-bold">18</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                      <div className="text-white/60 text-sm mb-2">Ingresos mes</div>
                      <div className="text-white text-2xl font-bold">€12,450</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-slate-600 mb-4">Más de</p>
            <div className="text-4xl font-bold text-slate-900 mb-2">
              <AnimatedCounter end={150} />+
            </div>
            <p className="text-slate-600">autoescuelas confían en Praxi</p>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Gestión completa para autoescuelas modernas. Cada función diseñada
              para ahorrarte tiempo y dinero.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {/* Large card - Gestión integral */}
            <motion.div
              variants={staggerItem}
              className="md:col-span-2 lg:row-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <LayoutDashboard className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">Gestión integral</h3>
                  <p className="text-slate-600 mb-6 flex-grow">
                    Una plataforma completa que unifica todas las operaciones de tu autoescuela.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-slate-700">Dashboard en tiempo real</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-slate-700">Reportes automatizados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-slate-700">Acceso desde cualquier dispositivo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fichaje legal */}
            <motion.div variants={staggerItem}>
              <Card className="h-full bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Fichaje legal</h3>
                  <p className="text-slate-600">Cumple RDL 8/2019. Evita multas desde 626€.</p>
                  <div className="mt-4 flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-green-500 border-t-green-200 rounded-full"
                    />
                    <span className="text-sm text-slate-500">Automatizado</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Multi-sede */}
            <motion.div variants={staggerItem}>
              <Card className="h-full bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Multi-sede</h3>
                  <p className="text-slate-600">Gestiona todas tus sedes desde una sola app.</p>
                  <div className="mt-4 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        initial={{ height: 8 }}
                        animate={{ height: [8, 16, 8] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                        className="w-2 bg-purple-300 rounded-full"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Facturación */}
            <motion.div variants={staggerItem}>
              <Card className="h-full bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                    <Receipt className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Facturación</h3>
                  <p className="text-slate-600">Facturas, bonos y pagos automatizados.</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Portal alumno */}
            <motion.div variants={staggerItem}>
              <Card className="h-full bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Portal alumno</h3>
                  <p className="text-slate-600">Acceso directo para estudiantes.</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Inbox unificado */}
            <motion.div variants={staggerItem} className="md:col-span-2">
              <Card className="h-full bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Inbox className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Inbox unificado</h3>
                  <p className="text-slate-600 mb-4">WhatsApp, Instagram y email en un solo lugar.</p>
                  <div className="flex gap-4">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                    <Camera className="h-6 w-6 text-pink-500" />
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Horarios inteligentes */}
            <motion.div variants={staggerItem} className="md:col-span-2">
              <Card className="h-full bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Horarios inteligentes</h3>
                  <p className="text-slate-600 mb-4">Agenda automática con disponibilidad en tiempo real.</p>
                  <div className="grid grid-cols-7 gap-1 mt-4">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                      <div key={day} className="text-center text-xs text-slate-500 pb-1">{day}</div>
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className={`h-6 rounded ${
                        i < 5 ? 'bg-orange-200' : 'bg-slate-100'
                      }`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Empezar es muy fácil
            </h2>
            <p className="text-xl text-slate-600">
              Tu autoescuela funcionando en menos de una hora
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-12 relative"
          >
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-slate-200" />

            {[
              {
                number: "01",
                title: "Regístrate",
                description: "5 minutos, sin instalaciones ni configuraciones complejas."
              },
              {
                number: "02",
                title: "Configura",
                description: "Añade sedes, profesores y vehículos. Te ayudamos en el proceso."
              },
              {
                number: "03",
                title: "Gestiona",
                description: "Todo desde un solo lugar. Tu autoescuela funcionando al 100%."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-6 relative z-10 bg-white border-4 border-white shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              ¿Por qué cambiar a Praxi?
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Praxi */}
            <motion.div variants={staggerItem}>
              <Card className="relative h-full border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white">
                  Recomendado
                </Badge>
                <CardContent className="pt-8 pb-6">
                  <h3 className="text-2xl font-bold text-center mb-6 text-slate-900">Praxi</h3>
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
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Excel */}
            <motion.div variants={staggerItem}>
              <Card className="h-full bg-white border-slate-200">
                <CardContent className="pt-8 pb-6">
                  <h3 className="text-2xl font-bold text-center mb-6 text-slate-900">Excel</h3>
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
                        <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Software tradicional */}
            <motion.div variants={staggerItem}>
              <Card className="h-full bg-white border-slate-200">
                <CardContent className="pt-8 pb-6">
                  <h3 className="text-2xl font-bold text-center mb-6 text-slate-900">Software tradicional</h3>
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
                        <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Choose the plan that is right for you
            </p>

            {/* Monthly/Annual Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                Annually
              </span>
              {isAnnual && (
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                  Save 20%
                </Badge>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Starter Plan */}
            <motion.div variants={staggerItem}>
              <Card className="h-full border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">Starter</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-slate-900">
                        {isAnnual ? '24' : '29'}€
                      </span>
                      <span className="text-lg text-slate-500 ml-1">
                        /{isAnnual ? 'año' : 'mes'}
                      </span>
                    </div>
                    <p className="text-slate-600">Perfect for small driving schools</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">1 sede</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Hasta 50 alumnos activos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">3 profesores</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Gestión de clases y exámenes</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Facturación básica</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-500">Fichaje legal</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-500">Inbox unificado</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-500">Automatizaciones</span>
                    </li>
                  </ul>

                  <Button className="w-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50">
                    Empezar gratis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Plan - Popular */}
            <motion.div variants={staggerItem}>
              <Card className="h-full border-2 border-blue-500 rounded-xl hover:shadow-lg transition-shadow relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white">
                  Popular
                </Badge>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">Profesional</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-slate-900">
                        {isAnnual ? '39' : '49'}€
                      </span>
                      <span className="text-lg text-slate-500 ml-1">
                        /{isAnnual ? 'año' : 'mes'}
                      </span>
                    </div>
                    <p className="text-slate-600">For growing driving schools</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Sedes ilimitadas</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Alumnos ilimitados</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Profesores ilimitados</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Todo del plan Starter</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Fichaje legal (RDL 8/2019)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Inbox unificado (WhatsApp, IG, Email)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Portal de alumno</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Firma digital de contratos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Estadísticas avanzadas</span>
                    </li>
                  </ul>

                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Empezar gratis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={staggerItem}>
              <Card className="h-full border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">Enterprise</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-slate-900">Personalizado</span>
                    </div>
                    <p className="text-slate-600">For large organizations</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Todo del plan Profesional</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Integración AUES/DGT</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">API personalizada</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Soporte prioritario 24/7</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Formación equipo</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Migración de datos</span>
                    </li>
                  </ul>

                  <Button className="w-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50">
                    Contactar ventas
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta-final" className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              ¿Listo para modernizar tu autoescuela?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Únete a más de 150 autoescuelas que ya confían en Praxi.
              Sin compromiso. Cancela cuando quieras.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-white text-blue-600 hover:bg-blue-50 mb-6 shadow-xl"
              >
                Empezar gratis hoy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <p className="text-blue-200 text-sm">
              14 días gratis • Sin tarjeta de crédito • Configuración en 5 minutos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <span className="text-white font-black text-sm leading-none">
                    <span className="text-base font-black">P</span><span className="text-xs font-bold">x</span>
                  </span>
                </div>
                <span className="text-2xl font-bold text-white">Praxi</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Software de gestión integral para autoescuelas. Moderniza tu negocio.
              </p>
            </div>

            {/* Producto */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Producto</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white transition-colors text-sm"
                  >
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="hover:text-white transition-colors text-sm"
                  >
                    Precios
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Novedades
                  </a>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Empresa</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Trabaja con nosotros
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Aviso legal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Términos
                  </a>
                </li>
              </ul>
            </div>

            {/* Soporte */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Soporte</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Estado del servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    API
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2026 Praxi. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}