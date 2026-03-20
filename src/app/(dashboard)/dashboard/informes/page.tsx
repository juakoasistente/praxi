"use client"

import { FileBarChart, Users, Car, GraduationCap, DollarSign, Truck } from "lucide-react"
import { ReportCard } from "@/components/informes/report-card"
import { InformeAlumnos } from "@/components/informes/informe-alumnos"
import { InformeClases } from "@/components/informes/informe-clases"
import { InformeFinanciero } from "@/components/informes/informe-financiero"
import { InformeExamenes } from "@/components/informes/informe-examenes"
import { InformeVehiculos } from "@/components/informes/informe-vehiculos"

export default function InformesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <FileBarChart className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Informes</h1>
          <p className="text-sm text-muted-foreground">
            Genera y exporta informes detallados
          </p>
        </div>
      </div>

      {/* Report cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          icon={<Users className="size-5" />}
          title="Informe de alumnos"
          description="Matriculados, en curso, completados y bajas por período"
        >
          <InformeAlumnos />
        </ReportCard>

        <ReportCard
          icon={<Car className="size-5" />}
          title="Informe de clases"
          description="Total de clases, horas y estadísticas por profesor"
        >
          <InformeClases />
        </ReportCard>

        <ReportCard
          icon={<DollarSign className="size-5" />}
          title="Informe financiero"
          description="Facturación, cobros, pendientes y beneficio estimado"
        >
          <InformeFinanciero />
        </ReportCard>

        <ReportCard
          icon={<GraduationCap className="size-5" />}
          title="Informe de exámenes"
          description="Presentaciones, tasa de aprobados teórico y práctico"
        >
          <InformeExamenes />
        </ReportCard>

        <ReportCard
          icon={<Truck className="size-5" />}
          title="Informe de vehículos"
          description="Flota, costes totales, coste por km y desglose de gastos"
        >
          <InformeVehiculos />
        </ReportCard>
      </div>
    </div>
  )
}
