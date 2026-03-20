export interface ExportColumn<T> {
  key: keyof T
  label: string
  format?: (value: unknown) => string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

function escapeCSVField(value: string): string {
  if (value.includes(";") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void {
  // UTF-8 BOM for Excel compatibility
  const BOM = "\uFEFF"

  const header = columns.map((col) => escapeCSVField(col.label)).join(";")

  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key]
        let formatted: string
        if (col.format) {
          formatted = col.format(value)
        } else if (value == null) {
          formatted = ""
        } else {
          formatted = String(value)
        }
        return escapeCSVField(formatted)
      })
      .join(";")
  )

  const csv = BOM + [header, ...rows].join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Re-export helpers for use in column definitions
export { formatDate as exportFormatDate, formatCurrency as exportFormatCurrency }
