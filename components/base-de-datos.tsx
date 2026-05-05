"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Search,
  Upload,
  Eye,
  Download,
  Trash2,
  FileText,
  Database,
  CloudUpload,
  Gavel,
  File,
  Filter,
  Plus,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// ─── Types ─────────────────────────────────────────────────────────────────────

type DocType = "Demanda" | "Sentencia" | "Contrato" | "Otro"

interface LegalDoc {
  id: string
  name: string
  type: DocType
  client: string
  expediente: string
  uploadedAt: string
  uploadedBy: string
  size: string
}

// ─── Mock data ──────────────────────────────────────────────────────────────────

const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "BD-001",
    name: "Demanda Civil — García vs. López Constructora S.A.",
    type: "Demanda",
    client: "Roberto García",
    expediente: "EXP-2024-001",
    uploadedAt: "02 May 2026",
    uploadedBy: "Ana García",
    size: "1.2 MB",
  },
  {
    id: "BD-002",
    name: "Sentencia SCJN — Amparo Directo 456/2025",
    type: "Sentencia",
    client: "TechCorp S.A.",
    expediente: "EXP-2024-003",
    uploadedAt: "01 May 2026",
    uploadedBy: "Carlos López",
    size: "3.4 MB",
  },
  {
    id: "BD-003",
    name: "Contrato de Arrendamiento — Inmueble Centro Histórico",
    type: "Contrato",
    client: "María Torres",
    expediente: "EXP-2024-007",
    uploadedAt: "28 Abr 2026",
    uploadedBy: "Ana García",
    size: "892 KB",
  },
  {
    id: "BD-004",
    name: "Demanda Mercantil — Impugnación de Pagaré",
    type: "Demanda",
    client: "Constructora Norte S.A.",
    expediente: "EXP-2024-011",
    uploadedAt: "25 Abr 2026",
    uploadedBy: "Pedro Ramírez",
    size: "2.1 MB",
  },
  {
    id: "BD-005",
    name: "Sentencia CJF — Recurso de Revisión 89/2025",
    type: "Sentencia",
    client: "Farmacéutica del Bajío",
    expediente: "EXP-2023-089",
    uploadedAt: "20 Abr 2026",
    uploadedBy: "María Torres",
    size: "5.7 MB",
  },
  {
    id: "BD-006",
    name: "Contrato de Compraventa — Vehículo Comercial",
    type: "Contrato",
    client: "Roberto García",
    expediente: "EXP-2024-015",
    uploadedAt: "15 Abr 2026",
    uploadedBy: "Carlos López",
    size: "450 KB",
  },
  {
    id: "BD-007",
    name: "Acta Constitutiva — Importadora Jalisco S.A. de C.V.",
    type: "Otro",
    client: "Importadora Jalisco",
    expediente: "EXP-2024-019",
    uploadedAt: "10 Abr 2026",
    uploadedBy: "Ana García",
    size: "1.8 MB",
  },
  {
    id: "BD-008",
    name: "Poder Notarial — Representación Legal General",
    type: "Otro",
    client: "Lucía Herrera",
    expediente: "EXP-2024-022",
    uploadedAt: "05 Abr 2026",
    uploadedBy: "Pedro Ramírez",
    size: "320 KB",
  },
]

const AVATAR_COLORS: Record<string, string> = {
  "Ana García": "#10b981",
  "Carlos López": "#7c3aed",
  "María Torres": "#f97316",
  "Pedro Ramírez": "#0ea5e9",
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
}

function TypeChip({ type }: { type: DocType }) {
  const config: Record<DocType, { cls: string; icon: React.ReactNode }> = {
    Demanda: {
      cls: "bg-red-50 text-red-700 border-red-200",
      icon: <Gavel className="w-3 h-3" />,
    },
    Sentencia: {
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <FileText className="w-3 h-3" />,
    },
    Contrato: {
      cls: "bg-green-50 text-green-700 border-green-200",
      icon: <FileText className="w-3 h-3" />,
    },
    Otro: {
      cls: "bg-gray-50 text-gray-500 border-gray-200",
      icon: <File className="w-3 h-3" />,
    },
  }
  const { cls, icon } = config[type]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
    >
      {icon}
      {type}
    </span>
  )
}

function UserAvatar({ name }: { name: string }) {
  const color = AVATAR_COLORS[name] ?? "#6b7280"
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
      style={{ backgroundColor: color }}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}

// ─── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-8 text-center">
      <div className="mb-6 text-primary/20">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="14" y="8" width="50" height="66" rx="5" fill="currentColor" />
          <rect x="22" y="26" width="26" height="3" rx="1.5" fill="white" />
          <rect x="22" y="36" width="20" height="3" rx="1.5" fill="white" />
          <rect x="22" y="46" width="22" height="3" rx="1.5" fill="white" />
          <circle cx="68" cy="70" r="20" fill="#ffcc00" />
          <path
            d="M68 60v20M58 70h20"
            stroke="#001f3f"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No hay documentos aún
      </h3>
      <p className="text-sm text-muted-foreground mb-7 max-w-xs leading-relaxed">
        Sube el primer documento legal a tu base de datos para empezar a
        organizar tu despacho.
      </p>
      <Button
        onClick={onUpload}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Upload className="w-4 h-4" />
        Subir primer documento
      </Button>
    </div>
  )
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Search className="w-10 h-10 text-muted-foreground/25 mb-4" />
      <h3 className="text-base font-semibold text-foreground mb-1">
        Sin resultados
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Ajusta los filtros o revisa la búsqueda
      </p>
      <Button variant="outline" size="sm" onClick={onClear}>
        Limpiar filtros
      </Button>
    </div>
  )
}

// ─── Upload Modal ───────────────────────────────────────────────────────────────

function UploadModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadType, setUploadType] = useState("")
  const [uploadClient, setUploadClient] = useState("")
  const [uploadExpediente, setUploadExpediente] = useState("")
  const [uploadNotes, setUploadNotes] = useState("")

  function pickFile() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.doc,.docx"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) setFileName(file.name)
    }
    input.click()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CloudUpload className="w-5 h-5 text-primary" />
            Subir documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files[0]
              if (file) setFileName(file.name)
            }}
            onClick={pickFile}
            className={`cursor-pointer select-none border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? "border-accent bg-accent/5 scale-[1.01]"
                : "border-border hover:border-primary/40 hover:bg-primary/[0.02]"
            }`}
          >
            {fileName ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-primary" />
                <p className="text-sm font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">
                  Haz clic para cambiar el archivo
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-1">
                  <Upload className="w-6 h-6 text-primary/50" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Arrastra tu documento aquí
                </p>
                <p className="text-xs text-muted-foreground">
                  o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  PDF, DOC, DOCX — máx. 50 MB
                </p>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tipo de documento</Label>
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Demanda">Demanda</SelectItem>
                  <SelectItem value="Sentencia">Sentencia</SelectItem>
                  <SelectItem value="Contrato">Contrato</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Cliente</Label>
              <Select value={uploadClient} onValueChange={setUploadClient}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(LEGAL_DOCS.map((d) => d.client))).map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Número de expediente</Label>
            <Input
              placeholder="EXP-2024-XXX"
              value={uploadExpediente}
              onChange={(e) => setUploadExpediente(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Notas (opcional)</Label>
            <Textarea
              placeholder="Agrega cualquier nota o contexto sobre este documento..."
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              className="resize-none min-h-[72px] text-sm"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="w-4 h-4" />
              Subir documento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Preview Panel ──────────────────────────────────────────────────────────────

function PreviewPanel({
  doc,
  onClose,
}: {
  doc: LegalDoc | null
  onClose: () => void
}) {
  return (
    <Sheet open={!!doc} onOpenChange={() => onClose()}>
      <SheetContent
        side="right"
        className="w-[480px] sm:w-[520px] p-0 flex flex-col"
      >
        {doc && (
          <>
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
              <SheetTitle className="text-sm font-semibold text-foreground leading-snug line-clamp-2 text-left">
                {doc.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <TypeChip type={doc.type} />
                <span className="text-xs text-muted-foreground">{doc.size}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="gap-1.5 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 flex-1 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </Button>
              </div>
            </SheetHeader>

            {/* PDF mock viewer */}
            <div className="flex-1 bg-muted/40 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-lg shadow-sm border border-border/60 px-10 py-8 min-h-[560px] relative">
                  <div className="text-center border-b border-gray-100 pb-5 mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1.5">
                      {doc.expediente}
                    </p>
                    <h2 className="text-sm font-bold text-foreground leading-snug">
                      {doc.name}
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-2 rounded bg-gray-100"
                        style={{
                          width: `${55 + ((i * 7 + 13) % 40)}%`,
                          opacity: i > 16 ? 0.5 : 1,
                        }}
                      />
                    ))}
                  </div>
                  <p className="absolute bottom-3 right-4 text-[10px] text-gray-300 font-mono">
                    1 / 3
                  </p>
                </div>
              </div>

              {/* Viewer controls */}
              <div className="border-t border-border bg-background px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground px-1">
                    Pág. 1 de 3
                  </span>
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground w-10 text-center">
                    100%
                  </span>
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="px-6 py-4 border-t border-border bg-background shrink-0">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Información del documento
              </p>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Cliente</dt>
                  <dd className="font-medium text-foreground">{doc.client}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Expediente</dt>
                  <dd className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground/80">
                    {doc.expediente}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Subido por</dt>
                  <dd className="flex items-center gap-1.5">
                    <UserAvatar name={doc.uploadedBy} />
                    <span className="font-medium text-foreground">
                      {doc.uploadedBy}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Fecha de carga</dt>
                  <dd className="font-medium text-foreground">
                    {doc.uploadedAt}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function BaseDeDatos() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("Todos")
  const [clientFilter, setClientFilter] = useState("Todos")
  const [previewDoc, setPreviewDoc] = useState<LegalDoc | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const clients = [
    "Todos",
    ...Array.from(new Set(LEGAL_DOCS.map((d) => d.client))),
  ]

  const filtered = LEGAL_DOCS.filter((doc) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.client.toLowerCase().includes(q) ||
      doc.expediente.toLowerCase().includes(q)
    const matchType = typeFilter === "Todos" || doc.type === typeFilter
    const matchClient =
      clientFilter === "Todos" || doc.client === clientFilter
    return matchSearch && matchType && matchClient
  })

  const stats = {
    total: LEGAL_DOCS.length,
    demandas: LEGAL_DOCS.filter((d) => d.type === "Demanda").length,
    sentencias: LEGAL_DOCS.filter((d) => d.type === "Sentencia").length,
    contratos: LEGAL_DOCS.filter((d) => d.type === "Contrato").length,
  }

  function clearFilters() {
    setSearch("")
    setTypeFilter("Todos")
    setClientFilter("Todos")
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Page header */}
      <div className="px-8 pt-8 pb-5 border-b border-border bg-background shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Database className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Base de Datos
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-12">
              Repositorio central de documentos legales del despacho
            </p>
          </div>
          <Button
            onClick={() => setUploadOpen(true)}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Subir documento
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: "Total documentos",
                value: stats.total,
                color: "text-foreground",
                bg: "bg-card",
              },
              {
                label: "Demandas",
                value: stats.demandas,
                color: "text-red-600",
                bg: "bg-red-50",
              },
              {
                label: "Sentencias",
                value: stats.sentencias,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Contratos",
                value: stats.contratos,
                color: "text-green-600",
                bg: "bg-green-50",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bg} border border-border rounded-xl px-5 py-4`}
              >
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cliente o expediente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[152px] h-10 gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los tipos</SelectItem>
                <SelectItem value="Demanda">Demanda</SelectItem>
                <SelectItem value="Sentencia">Sentencia</SelectItem>
                <SelectItem value="Contrato">Contrato</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[184px] h-10">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "Todos" ? "Todos los clientes" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[152px] h-10">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {LEGAL_DOCS.length === 0 ? (
            <EmptyState onUpload={() => setUploadOpen(true)} />
          ) : filtered.length === 0 ? (
            <NoResults onClear={clearFilters} />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Documento
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Cliente
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Expediente
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Fecha de carga
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Subido por
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      {/* Document name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 max-w-[260px]">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-primary/50" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate leading-snug">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type chip */}
                      <td className="px-4 py-3.5">
                        <TypeChip type={doc.type} />
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3.5 text-foreground/80 whitespace-nowrap">
                        {doc.client}
                      </td>

                      {/* Expediente */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground/70">
                          {doc.expediente}
                        </span>
                      </td>

                      {/* Upload date */}
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {doc.uploadedAt}
                      </td>

                      {/* Uploaded by */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={doc.uploadedBy} />
                          <span className="text-foreground/80 whitespace-nowrap">
                            {doc.uploadedBy}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                            onClick={() => setPreviewDoc(doc)}
                            title="Ver"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
                            title="Descargar"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-red-50 hover:text-destructive"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination footer */}
              <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {filtered.length} de {LEGAL_DOCS.length} documentos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    disabled
                  >
                    Anterior
                  </Button>
                  <span className="text-xs text-muted-foreground px-1">
                    Pág. 1 de 1
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    disabled
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <PreviewPanel doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  )
}