import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import type { Factura } from "./types"
import {
  ESTADO_FACTURA_LABELS,
  METODO_PAGO_LABELS,
  CONCEPTO_LABELS,
} from "./types"

const PRIMARY = "#1e40af"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  brandName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
  },
  brandInfo: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 4,
    lineHeight: 1.5,
  },
  invoiceTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
    textAlign: "right",
  },
  invoiceMeta: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 2,
    lineHeight: 1.6,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  dividerAccent: {
    height: 2,
    backgroundColor: PRIMARY,
    marginBottom: 20,
  },
  // Client section
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  clientInfo: {
    fontSize: 10,
    lineHeight: 1.6,
  },
  // Table
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  colConcepto: { width: "30%" },
  colDescripcion: { width: "28%" },
  colCantidad: { width: "10%", textAlign: "right" },
  colPrecio: { width: "16%", textAlign: "right" },
  colSubtotal: { width: "16%", textAlign: "right" },
  cellText: {
    fontSize: 9,
  },
  cellTextBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  // Totals
  totalsContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 220,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  totalDivider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 4,
  },
  totalFinalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
  },
  totalFinalValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
  },
  // Status badge
  statusBadge: {
    marginTop: 16,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
  },
  statusText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#9ca3af",
  },
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

interface FacturaPdfProps {
  factura: Factura
}

export function FacturaPdf({ factura }: FacturaPdfProps) {
  const subtotal = factura.lineas.reduce((sum, l) => sum + l.subtotal, 0)
  const iva = subtotal * 0.21
  const total = subtotal + iva

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Autoescuela Praxi</Text>
            <Text style={styles.brandInfo}>
              C/ Gran Vía 42, 28013 Madrid{"\n"}
              CIF: B12345678{"\n"}
              Tel: 912 345 678{"\n"}
              info@autoescuelapraxi.es
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURA</Text>
            <Text style={styles.invoiceMeta}>
              Nº {factura.numero}{"\n"}
              Emisión: {formatDate(factura.fecha_emision)}{"\n"}
              Vencimiento: {formatDate(factura.fecha_vencimiento)}
            </Text>
          </View>
        </View>

        <View style={styles.dividerAccent} />

        {/* Client info */}
        <View>
          <Text style={styles.sectionTitle}>Datos del cliente</Text>
          <Text style={styles.clientInfo}>
            {factura.alumno_nombre}
          </Text>
        </View>

        {/* Payment method */}
        {factura.metodo_pago && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 9, color: "#6b7280" }}>
              Método de pago: {METODO_PAGO_LABELS[factura.metodo_pago]}
            </Text>
          </View>
        )}

        {/* Line items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colConcepto]}>
              Concepto
            </Text>
            <Text style={[styles.tableHeaderText, styles.colDescripcion]}>
              Descripción
            </Text>
            <Text style={[styles.tableHeaderText, styles.colCantidad]}>
              Cant.
            </Text>
            <Text style={[styles.tableHeaderText, styles.colPrecio]}>
              Precio ud.
            </Text>
            <Text style={[styles.tableHeaderText, styles.colSubtotal]}>
              Subtotal
            </Text>
          </View>
          {factura.lineas.map((linea, idx) => (
            <View
              key={linea.id}
              style={[
                styles.tableRow,
                idx % 2 === 1 ? styles.tableRowAlt : {},
              ]}
            >
              <Text style={[styles.cellTextBold, styles.colConcepto]}>
                {CONCEPTO_LABELS[linea.concepto]}
              </Text>
              <Text style={[styles.cellText, styles.colDescripcion]}>
                {linea.descripcion}
              </Text>
              <Text style={[styles.cellText, styles.colCantidad]}>
                {linea.cantidad}
              </Text>
              <Text style={[styles.cellText, styles.colPrecio]}>
                {formatCurrency(linea.precio_unitario)}
              </Text>
              <Text style={[styles.cellTextBold, styles.colSubtotal]}>
                {formatCurrency(linea.subtotal)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (21%)</Text>
              <Text style={styles.totalValue}>{formatCurrency(iva)}</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalFinalLabel}>Total</Text>
              <Text style={styles.totalFinalValue}>
                {formatCurrency(total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            Estado: {ESTADO_FACTURA_LABELS[factura.estado]}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Factura generada por Praxi — Software de gestión de autoescuelas
          </Text>
        </View>
      </Page>
    </Document>
  )
}
