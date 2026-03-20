"use client"

import * as React from "react"
import Image from "next/image"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ProfesorFormDialog } from "@/components/profesores/profesor-form-dialog"
import { MOCK_PROFESORES } from "@/components/profesores/mock-data"
import type { Profesor } from "@/components/profesores/types"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { getProfesores, createProfesor, updateProfesor } from "@/lib/services/profesores"
import { RequireWrite } from "@/components/auth/require-write"
import { toast } from "sonner"

export default function ProfesoresPage() {
  const { data: supabaseProfesores, loading, error, refetch } = useSupabaseQuery(() => getProfesores())
  const [profesores, setProfesores] = React.useState<Profesor[]>(MOCK_PROFESORES)
  const [search, setSearch] = React.useState("")
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingProfesor, setEditingProfesor] = React.useState<Profesor | null>(null)
  const [toggleProfesor, setToggleProfesor] = React.useState<Profesor | null>(null)
  const [toggleDialogOpen, setToggleDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (supabaseProfesores) setProfesores(supabaseProfesores)
  }, [supabaseProfesores])

  const filtered = React.useMemo(() => {
    if (!search) return profesores
    return profesores.filter((p) =>
      `${p.nombre} ${p.apellidos}`.toLowerCase().includes(search.toLowerCase())
    )
  }, [profesores, search])

  async function handleSave(data: Omit<Profesor, "id">) {
    try {
      if (editingProfesor) {
        await updateProfesor(editingProfesor.id, data)
        toast.success("Profesor actualizado correctamente")
      } else {
        await createProfesor(data)
        toast.success("Profesor creado correctamente")
      }
      refetch()
    } catch {
      // Fallback to local state on error
      if (editingProfesor) {
        setProfesores((prev) =>
          prev.map((p) =>
            p.id === editingProfesor.id ? { ...p, ...data } : p
          )
        )
      } else {
        const newProfesor: Profesor = {
          ...data,
          id: String(Date.now()),
        }
        setProfesores((prev) => [...prev, newProfesor])
      }
      toast.error("Error al guardar. Se actualizó localmente.")
    }
    setEditingProfesor(null)
  }

  function handleEdit(profesor: Profesor) {
    setEditingProfesor(profesor)
    setFormOpen(true)
  }

  function handleToggleClick(profesor: Profesor) {
    setToggleProfesor(profesor)
    setToggleDialogOpen(true)
  }

  async function confirmToggle() {
    if (!toggleProfesor) return
    try {
      await updateProfesor(toggleProfesor.id, { activo: !toggleProfesor.activo })
      toast.success(
        toggleProfesor.activo ? "Profesor desactivado" : "Profesor activado"
      )
      refetch()
    } catch {
      // Fallback to local state on error
      setProfesores((prev) =>
        prev.map((p) =>
          p.id === toggleProfesor.id ? { ...p, activo: !p.activo } : p
        )
      )
      toast.error("Error al actualizar. Se actualizó localmente.")
    }
    setToggleProfesor(null)
    setToggleDialogOpen(false)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/profesores.png"
            alt="Profesores"
            width={36}
            height={36}
          />
          <div>
            <h1 className="text-2xl font-bold">Profesores</h1>
            <p className="text-sm text-muted-foreground">
              {profesores.length} profesor{profesores.length !== 1 ? "es" : ""} registrado{profesores.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <RequireWrite entity="profesores">
          <Button
            onClick={() => {
              setEditingProfesor(null)
              setFormOpen(true)
            }}
          >
            <Plus className="size-4" data-icon="inline-start" />
            Nuevo profesor
          </Button>
        </RequireWrite>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="rounded-lg border overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre completo</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((profesor) => (
                <TableRow key={profesor.id}>
                  <TableCell className="font-medium">
                    {profesor.nombre} {profesor.apellidos}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {profesor.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {profesor.telefono}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {profesor.permisos_habilitados.map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${
                        profesor.activo
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {profesor.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <RequireWrite entity="profesores">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(profesor)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleClick(profesor)}
                          className={
                            profesor.activo
                              ? "text-destructive hover:text-destructive"
                              : "text-green-700 hover:text-green-700"
                          }
                        >
                          {profesor.activo ? "Desactivar" : "Activar"}
                        </Button>
                      </div>
                    </RequireWrite>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No se encontraron profesores</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search
              ? "Prueba a cambiar el término de búsqueda."
              : "Aún no hay profesores registrados. Haz clic en \"Nuevo profesor\" para empezar."}
          </p>
          {search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearch("")}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}

      {/* Form Dialog */}
      <ProfesorFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingProfesor(null)
        }}
        profesor={editingProfesor}
        onSave={handleSave}
      />

      {/* Toggle Confirmation Dialog */}
      {toggleProfesor && (
        <Dialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {toggleProfesor.activo
                  ? "Desactivar profesor"
                  : "Activar profesor"}
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres{" "}
                {toggleProfesor.activo ? "desactivar" : "activar"} a{" "}
                <strong>
                  {toggleProfesor.nombre} {toggleProfesor.apellidos}
                </strong>
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancelar
              </DialogClose>
              <Button
                variant={toggleProfesor.activo ? "destructive" : "default"}
                onClick={confirmToggle}
              >
                {toggleProfesor.activo ? "Desactivar" : "Activar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
