"use client"

import * as React from "react"
import { Building2, Plus, Edit, Trash2, MapPin, Phone, Mail, Star, Users, Car, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSedes, createSede, updateSede, deleteSede, getSedeStats } from "@/lib/services/sedes"
import type { Sede } from "@/components/sedes/types"
import { toast } from "sonner"

interface SedeFormData {
  nombre: string
  direccion: string
  telefono: string
  email: string
  es_principal: boolean
}

interface SedeStats {
  alumnos: number
  profesores: number
  vehiculos: number
}

export default function SedesPage() {
  const [sedes, setSedes] = React.useState<Sede[]>([])
  const [sedeStats, setSedeStats] = React.useState<Record<string, SedeStats>>({})
  const [loading, setLoading] = React.useState(true)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedSede, setSelectedSede] = React.useState<Sede | null>(null)
  const [formData, setFormData] = React.useState<SedeFormData>({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    es_principal: false,
  })
  const [submitting, setSubmitting] = React.useState(false)

  const loadSedes = React.useCallback(async () => {
    setLoading(true)
    const data = await getSedes()
    setSedes(data)

    // Load stats for each sede
    const stats: Record<string, SedeStats> = {}
    await Promise.all(
      data.map(async (sede) => {
        stats[sede.id] = await getSedeStats(sede.id)
      })
    )
    setSedeStats(stats)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    loadSedes()
  }, [loadSedes])

  const resetForm = () => {
    setFormData({
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      es_principal: false,
    })
  }

  const handleCreate = async () => {
    if (!formData.nombre.trim()) {
      toast.error("El nombre de la sede es obligatorio")
      return
    }

    setSubmitting(true)
    const result = await createSede({
      ...formData,
      autoescuela_id: "1", // This should come from user context
      activa: true,
    })

    if (result) {
      toast.success("Sede creada exitosamente")
      setCreateDialogOpen(false)
      resetForm()
      loadSedes()
    }
    setSubmitting(false)
  }

  const handleEdit = (sede: Sede) => {
    setSelectedSede(sede)
    setFormData({
      nombre: sede.nombre,
      direccion: sede.direccion || "",
      telefono: sede.telefono || "",
      email: sede.email || "",
      es_principal: sede.es_principal,
    })
    setEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedSede) return
    if (!formData.nombre.trim()) {
      toast.error("El nombre de la sede es obligatorio")
      return
    }

    setSubmitting(true)
    const result = await updateSede(selectedSede.id, formData)

    if (result) {
      toast.success("Sede actualizada exitosamente")
      setEditDialogOpen(false)
      setSelectedSede(null)
      resetForm()
      loadSedes()
    }
    setSubmitting(false)
  }

  const handleDeleteConfirm = (sede: Sede) => {
    setSelectedSede(sede)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedSede) return

    setSubmitting(true)
    const success = await deleteSede(selectedSede.id)

    if (success) {
      toast.success("Sede eliminada exitosamente")
      setDeleteDialogOpen(false)
      setSelectedSede(null)
      loadSedes()
    }
    setSubmitting(false)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Decorative Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="size-20 rounded-full bg-gradient-to-br from-green-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Building2 className="size-10 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-green-400/20 to-blue-600/20 blur-md -z-10"></div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Sedes</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gestiona las sedes de tu autoescuela
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {sedes.length} sede{sedes.length !== 1 ? 's' : ''} registrada{sedes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Nueva sede
        </Button>
      </div>

      {/* Sedes Grid */}
      {sedes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay sedes registradas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crea tu primera sede para comenzar a gestionar tu autoescuela.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus className="size-4" />
                Crear primera sede
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sedes.map((sede) => {
            const stats = sedeStats[sede.id] || { alumnos: 0, profesores: 0, vehiculos: 0 }
            return (
              <Card key={sede.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-5 text-blue-600" />
                      <CardTitle className="text-lg truncate">{sede.nombre}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {sede.es_principal && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs gap-1">
                          <Star className="size-3 fill-white" />
                          Principal
                        </Badge>
                      )}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(sede)}
                          className="size-8 p-0"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConfirm(sede)}
                          className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={sede.es_principal}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {sede.direccion && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{sede.direccion}</span>
                      </div>
                    )}
                    {sede.telefono && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{sede.telefono}</span>
                      </div>
                    )}
                    {sede.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{sede.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <GraduationCap className="size-3 text-blue-600" />
                        <span className="text-xs text-muted-foreground">Alumnos</span>
                      </div>
                      <p className="text-sm font-semibold">{stats.alumnos}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="size-3 text-green-600" />
                        <span className="text-xs text-muted-foreground">Profesores</span>
                      </div>
                      <p className="text-sm font-semibold">{stats.profesores}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Car className="size-3 text-purple-600" />
                        <span className="text-xs text-muted-foreground">Vehículos</span>
                      </div>
                      <p className="text-sm font-semibold">{stats.vehiculos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva sede</DialogTitle>
            <DialogDescription>
              Crea una nueva sede para tu autoescuela.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({...prev, nombre: e.target.value}))}
                placeholder="Ej: Sede Central"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({...prev, direccion: e.target.value}))}
                placeholder="Ej: Gran Vía 42, Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({...prev, telefono: e.target.value}))}
                placeholder="Ej: 91 234 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                placeholder="Ej: sede@autoescuela.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="es_principal"
                checked={formData.es_principal}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, es_principal: checked}))}
              />
              <Label htmlFor="es_principal">Es sede principal</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? "Creando..." : "Crear sede"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar sede</DialogTitle>
            <DialogDescription>
              Modifica los datos de la sede.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre *</Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({...prev, nombre: e.target.value}))}
                placeholder="Ej: Sede Central"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-direccion">Dirección</Label>
              <Input
                id="edit-direccion"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({...prev, direccion: e.target.value}))}
                placeholder="Ej: Gran Vía 42, Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({...prev, telefono: e.target.value}))}
                placeholder="Ej: 91 234 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                placeholder="Ej: sede@autoescuela.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-es_principal"
                checked={formData.es_principal}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, es_principal: checked}))}
              />
              <Label htmlFor="edit-es_principal">Es sede principal</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setSelectedSede(null)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar sede?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La sede &quot;{selectedSede?.nombre}&quot; será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          {selectedSede?.es_principal && (
            <Alert>
              <AlertTitle>No se puede eliminar</AlertTitle>
              <AlertDescription>
                No puedes eliminar la sede principal. Primero designa otra sede como principal.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSelectedSede(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting || selectedSede?.es_principal}
            >
              {submitting ? "Eliminando..." : "Eliminar sede"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}