"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Alumno } from "./types"

interface ConfirmarBajaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumno: Alumno | null
  onConfirm: () => void
}

export function ConfirmarBajaDialog({
  open,
  onOpenChange,
  alumno,
  onConfirm,
}: ConfirmarBajaDialogProps) {
  if (!alumno) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar baja</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres dar de baja a{" "}
            <strong>
              {alumno.nombre} {alumno.apellidos}
            </strong>
            ? Esta acción cambiará su estado a &quot;Baja&quot;.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Dar de baja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
