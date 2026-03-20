"use client"

import { useUserRole } from "@/hooks/use-user-role"
import { canWrite } from "@/lib/permissions"

export function RequireWrite({
  entity,
  children,
}: {
  entity: string
  children: React.ReactNode
}) {
  const role = useUserRole()
  if (!canWrite(role, entity)) return null
  return <>{children}</>
}
