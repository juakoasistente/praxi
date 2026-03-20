"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronRight } from "lucide-react"

interface ReportCardProps {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

export function ReportCard({ icon, title, description, children }: ReportCardProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Card
        className="cursor-pointer transition-colors hover:bg-accent/50"
        onClick={() => setOpen(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {children}
        </DialogContent>
      </Dialog>
    </>
  )
}
