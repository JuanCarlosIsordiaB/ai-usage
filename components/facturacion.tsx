"use client"

import { useState } from "react"
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  Send,
  CheckCheck,
  ArrowLeft,
  Download,
  Trash2,
  X,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// ─── Types ────────────────────────────────────────────────────────────────────

type InvoiceStatus = "Pendiente" | "Pagado" | "Vencido" | "Cancelado"

interface InvoiceLine {
  id: string
  concepto: string
  monto: number
}

interface Invoice {
  id: string
  folio: string
  cliente: string
  concepto: string
  monto: number
  fechaVencimiento: string
  fechaEmision: string
  status: InvoiceStatus
  lines: InvoiceLine[]
  iva: boolean
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CLIENTES = [
  "TechCorp S.A. de C.V.",
  "González vs. Industrias del Norte",
  "StartupXYZ México",
  "Inmobiliaria Pedraza",
  "Grupo Comercial Hernández",
  "Importadora Del Valle",
]

const FACTURAS: Invoice[] = [
  {
    id: "1",
    folio: "FAC-2024-001",
    cliente: "TechCorp S.A. de C.V.",
    concepto: "Asesoría corporativa — abril 2024",
    monto: 58000,
    fechaVencimiento: "15 May 2024",
    fechaEmision: "01 Abr 2024",
    status: "Pendiente",
    iva: true,
    lines: [
      { id: "l1", concepto: "Consultoría societaria", monto: 30000 },
      { id: "l2", concepto: "Revisión de contratos (x4)", monto: 20000 },
      { id: "l3", concepto: "Gestiones notariales", monto: 8000 },
    ],
  },
  {
    id: "2",
    folio: "FAC-2024-002",
    cliente: "Inmobiliaria Pedraza",
    concepto: "Defensa litigio laboral",
    monto: 42500,
    fechaVencimiento: "28 Abr 2024",
    fechaEmision: "01 Mar 2024",
    status: "Vencido",
    iva: true,
    lines: [
      { id: "l1", concepto: "Representación en audiencias (x3)", monto: 27000 },
      { id: "l2", concepto: "Elaboración de escritos procesales", monto: 15500 },
    ],
  },
  {
    id: "3",
    folio: "FAC-2024-003",
    cliente: "StartupXYZ México",
    concepto: "Constitución de sociedad",
    monto: 18500,
    fechaVencimiento: "10 May 2024",
    fechaEmision: "10 Abr 2024",
    status: "Pagado",
    iva: false,
    lines: [
      { id: "l1", concepto: "Trámites notariales y SAT", monto: 12000 },
      { id: "l2", concepto: "Asesoría fiscal inicial", monto: 6500 },
    ],
  },
  {
    id: "4",
    folio: "FAC-2024-004",
    cliente: "Grupo Comercial Hernández",
    concepto: "Contrato distribución exclusiva",
    monto: 35000,
    fechaVencimiento: "20 May 2024",
    fechaEmision: "20 Abr 2024",
    status: "Pendiente",
    iva: true,
    lines: [
      { id: "l1", concepto: "Redacción contrato marco", monto: 22000 },
      { id: "l2", concepto: "Negociación cláusulas", monto: 13000 },
    ],
  },
  {
    id: "5",
    folio: "FAC-2024-005",
    cliente: "Importadora Del Valle",
    concepto: "Asesoría en comercio exterior",
    monto: 27300,
    fechaVencimiento: "05 Abr 2024",
    fechaEmision: "05 Mar 2024",
    status: "Pagado",
    iva: true,
    lines: [
      { id: "l1", concepto: "Análisis arancelario", monto: 15000 },
      { id: "l2", concepto: "Trámites ante Aduana", monto: 12300 },
    ],
  },
  {
    id: "6",
    folio: "FAC-2024-006",
    cliente: "González vs. Industrias del Norte",
    concepto: "Proceso de amparo directo",
    monto: 64000,
    fechaVencimiento: "01 Jun 2024",
    fechaEmision: "01 May 2024",
    status: "Pendiente",
    iva: true,
    lines: [
      { id: "l1", concepto: "Demanda de amparo", monto: 32000 },
      { id: "l2", concepto: "Seguimiento procesal (3 meses)", monto: 24000 },
      { id: "l3", concepto: "Gastos y costas", monto: 8000 },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n)

function statusBadge(status: InvoiceStatus) {
  const map: Record<InvoiceStatus, string> = {
    Pendiente: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Pagado:    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    Vencido:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Cancelado: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  )
}

// ─── Summary cards ────────────────────────────────────────────────────────────

function SummaryCards() {
  const cards = [
    {
      label: "Total por cobrar",
      value: fmt(157000),
      icon: DollarSign,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      sub: "3 facturas activas",
    },
    {
      label: "Vencido",
      value: fmt(42500),
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/40",
      sub: "1 factura pendiente de cobro",
    },
    {
      label: "Cobrado este mes",
      value: fmt(127300),
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      sub: "+18% vs. mes anterior",
    },
    {
      label: "Próximos vencimientos",
      value: "5 facturas",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      sub: "En los próximos 30 días",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <Card key={c.label} className="border border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{c.label}</p>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${c.bg}`}>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Nueva Factura modal ───────────────────────────────────────────────────────

interface NuevaFacturaModalProps {
  open: boolean
  onClose: () => void
}

function NuevaFacturaModal({ open, onClose }: NuevaFacturaModalProps) {
  const [cliente, setCliente] = useState("")
  const [ivaEnabled, setIvaEnabled] = useState(true)
  const [lines, setLines] = useState<InvoiceLine[]>([
    { id: "1", concepto: "", monto: 0 },
  ])

  const subtotal = lines.reduce((s, l) => s + (l.monto || 0), 0)
  const iva = ivaEnabled ? subtotal * 0.16 : 0
  const total = subtotal + iva

  const addLine = () =>
    setLines((prev) => [...prev, { id: Date.now().toString(), concepto: "", monto: 0 }])

  const removeLine = (id: string) =>
    setLines((prev) => prev.filter((l) => l.id !== id))

  const updateLine = (id: string, field: "concepto" | "monto", value: string) =>
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, [field]: field === "monto" ? Number(value) : value } : l
      )
    )

  const handleClose = () => {
    setCliente("")
    setIvaEnabled(true)
    setLines([{ id: "1", concepto: "", monto: 0 }])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Nueva Factura</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Cliente */}
          <div className="space-y-1.5">
            <Label>Cliente</Label>
            <Select onValueChange={setCliente} value={cliente}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente…" />
              </SelectTrigger>
              <SelectContent>
                {CLIENTES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Líneas de concepto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Conceptos</Label>
              <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" onClick={addLine}>
                <Plus className="w-3 h-3" />
                Agregar línea
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-[1fr_140px_32px] gap-0 bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                <span>Concepto</span>
                <span className="text-right">Monto (MXN)</span>
                <span />
              </div>
              {lines.map((line) => (
                <div key={line.id} className="grid grid-cols-[1fr_140px_32px] gap-2 items-center px-3 py-2 border-t border-border">
                  <Input
                    placeholder="Descripción del servicio…"
                    value={line.concepto}
                    onChange={(e) => updateLine(line.id, "concepto", e.target.value)}
                    className="h-8 text-sm border-0 shadow-none focus-visible:ring-0 p-0"
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={line.monto || ""}
                    onChange={(e) => updateLine(line.id, "monto", e.target.value)}
                    className="h-8 text-sm text-right border-0 shadow-none focus-visible:ring-0 p-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => lines.length > 1 && removeLine(line.id)}
                    disabled={lines.length === 1}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="rounded-lg bg-muted/40 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="iva-toggle"
                  checked={ivaEnabled}
                  onCheckedChange={setIvaEnabled}
                />
                <Label htmlFor="iva-toggle" className="cursor-pointer text-muted-foreground">
                  IVA 16%
                </Label>
              </div>
              <span className="text-muted-foreground">{fmt(iva)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base text-foreground">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button
              className="bg-[#111111] text-white hover:bg-[#333333]"
              onClick={handleClose}
            >
              Crear factura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Invoice detail ───────────────────────────────────────────────────────────

interface InvoiceDetailProps {
  invoice: Invoice
  onBack: () => void
}

function InvoiceDetail({ invoice, onBack }: InvoiceDetailProps) {
  const subtotal = invoice.lines.reduce((s, l) => s + l.monto, 0)
  const ivaAmt = invoice.iva ? subtotal * 0.16 : 0
  const total = subtotal + ivaAmt

  const handlePrint = () => window.print()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Volver a facturas
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handlePrint}
        >
          <Download className="w-4 h-4" />
          Descargar PDF
        </Button>
      </div>

      <Card className="border border-border print:shadow-none">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 bg-[#725a4214] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">DespachoEnLinea</h2>
                  <p className="text-xs text-muted-foreground">Despacho Jurídico</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Despacho Jurídico DespachoEnLinea S.C.</p>
              <p className="text-sm text-muted-foreground">RFC: DJL200101ABC</p>
              <p className="text-sm text-muted-foreground">Av. Insurgentes Sur 1234, CDMX</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{invoice.folio}</p>
              <div className="mt-1">{statusBadge(invoice.status)}</div>
              <p className="text-sm text-muted-foreground mt-2">Emisión: {invoice.fechaEmision}</p>
              <p className="text-sm text-muted-foreground">Vence: {invoice.fechaVencimiento}</p>
            </div>
          </div>

          <Separator />

          {/* Client */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Facturar a</p>
            <p className="font-semibold text-foreground">{invoice.cliente}</p>
          </div>

          {/* Items table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead className="text-right w-36">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="text-foreground">{line.concepto}</TableCell>
                  <TableCell className="text-right text-foreground">{fmt(line.monto)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {invoice.iva && (
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA (16%)</span>
                  <span>{fmt(ivaAmt)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base text-foreground">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center">
            Gracias por su confianza. Para cualquier aclaración comuníquese a facturacion@DespachoEnLinea.mx
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Facturacion() {
  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setView("detail")
  }

  if (view === "detail" && selectedInvoice) {
    return (
      <div className="flex-1 overflow-y-auto bg-background">
        <InvoiceDetail invoice={selectedInvoice} onBack={() => setView("list")} />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="p-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-semibold text-foreground leading-none">Facturación</h1>
          <Button
            className="gap-2 bg-[#111111] text-white hover:bg-[#333333]"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Nueva factura
          </Button>
        </div>

        {/* Summary cards */}
        <SummaryCards />

        {/* Invoice table */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Facturas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Folio</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Concepto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="hidden lg:table-cell">Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FACTURAS.map((f) => (
                  <TableRow key={f.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="pl-6 font-mono text-sm font-medium text-foreground">
                      {f.folio}
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-[160px] truncate">
                      {f.cliente}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-[200px] truncate">
                      {f.concepto}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {fmt(f.monto)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                      {f.fechaVencimiento}
                    </TableCell>
                    <TableCell>{statusBadge(f.status)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Ver detalle"
                          onClick={() => openDetail(f)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Enviar recordatorio"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        {f.status !== "Pagado" && f.status !== "Cancelado" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-emerald-600"
                            title="Marcar como pagado"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <NuevaFacturaModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}


