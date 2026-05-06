'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Search,
  ChevronLeft,
  ChevronRight,
  History,
  Save,
  Check,
  X,
  FileText,
  Plus,
  Clock,
  Users,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

type DocStatus = "Borrador" | "En revisión" | "Final"

interface DocumentFile {
  id: string
  title: string
  lastModified: string
  authors: string[]
  status: DocStatus
}

interface TrackedChange {
  id: string
  user: string
  userColor: string
  type: "addition" | "deletion" | "replacement"
  description: string
  timestamp: string
}

interface Version {
  id: string
  label: string
  timestamp: string
  author: string
  changes: number
  isCurrent?: boolean
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const COLLABORATORS: Record<string, { name: string; color: string }> = {
  MG: { name: "María González", color: "#725a42" },
  CR: { name: "Carlos Ruiz",    color: "#10b981" },
  AM: { name: "Ana Martínez",   color: "#f97316" },
  LH: { name: "Luis Hernández", color: "#0ea5e9" },
}

const DOCUMENTS: DocumentFile[] = [
  {
    id: "d1",
    title: "Contrato de Arrendamiento — Inmueble Centro Histórico",
    lastModified: "Hoy 15:42",
    authors: ["MG", "CR", "AM"],
    status: "En revisión",
  },
  {
    id: "d2",
    title: "Demanda Civil — García vs. López Constructora S.A.",
    lastModified: "Hoy 11:20",
    authors: ["AM"],
    status: "Borrador",
  },
  {
    id: "d3",
    title: "Sentencia SCJN — Amparo Directo 456/2025",
    lastModified: "Ayer 16:05",
    authors: ["MG", "CR"],
    status: "Final",
  },
  {
    id: "d4",
    title: "Poder Notarial — Representación Legal General",
    lastModified: "02 May 2026",
    authors: ["CR"],
    status: "Final",
  },
  {
    id: "d5",
    title: "Convenio de Transacción — TechCorp vs. StartupXYZ",
    lastModified: "01 May 2026",
    authors: ["MG", "AM", "LH"],
    status: "Borrador",
  },
  {
    id: "d6",
    title: "Acta Constitutiva — Importadora Jalisco S.A. de C.V.",
    lastModified: "28 Abr 2026",
    authors: ["MG"],
    status: "En revisión",
  },
]

const INITIAL_CHANGES: TrackedChange[] = [
  {
    id: "tc1",
    user: "Carlos Ruiz",
    userColor: "#10b981",
    type: "addition",
    description: `Agregó: “mediante representante legal debidamente acreditado”`,
    timestamp: "Hace 15 min",
  },
  {
    id: "tc2",
    user: "Ana Martínez",
    userColor: "#f97316",
    type: "deletion",
    description: `Eliminó: "por el período de un año calendario"`,
    timestamp: "Hace 22 min",
  },
  {
    id: "tc3",
    user: "Carlos Ruiz",
    userColor: "#10b981",
    type: "replacement",
    description: `Cambió "renta mensual" por "contraprestación mensual"`,
    timestamp: "Hace 45 min",
  },
]

const VERSIONS: Version[] = [
  {
    id: "v3",
    label: "Versión actual",
    timestamp: "Hoy 15:42",
    author: "María González",
    changes: 3,
    isCurrent: true,
  },
  {
    id: "v2",
    label: "Versión 2",
    timestamp: "Hoy 11:20",
    author: "Carlos Ruiz",
    changes: 7,
  },
  {
    id: "v1",
    label: "Versión inicial",
    timestamp: "Ayer 16:05",
    author: "María González",
    changes: 0,
  },
]

// Initial document HTML with tracked-change markup
const INITIAL_DOC_HTML = `
<h1 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;text-align:center;letter-spacing:-0.01em">CONTRATO DE ARRENDAMIENTO</h1>
<p style="text-align:center;color:#9ca3af;margin-bottom:2rem;font-size:0.8rem;letter-spacing:0.05em">Ciudad de México &nbsp;·&nbsp; EXP-2024-007</p>

<p style="margin-bottom:1rem;line-height:1.9">Conste por el presente instrumento el contrato de arrendamiento que celebran, de una parte, la señora <strong>María Torres</strong>, <span style="background:rgba(16,185,129,0.12);border-bottom:2px solid #10b981;padding:0 2px 1px;border-radius:2px" title="Cambio de Carlos Ruiz">mediante representante legal debidamente acreditado</span><sup style="color:#10b981;font-size:8px;font-weight:700;margin-left:1px">CR</sup>, en adelante "LA ARRENDADORA"; y de la otra parte, la empresa <strong>Importadora Jalisco S.A. de C.V.</strong>, en adelante "LA ARRENDATARIA".</p>

<p style="margin-bottom:1.5rem;line-height:1.9">Ambas partes, con capacidad legal para contratar, convienen en celebrar el presente contrato al tenor de las siguientes cláusulas:</p>

<h2 style="font-size:0.95rem;font-weight:700;margin:1.5rem 0 0.6rem;text-transform:uppercase;letter-spacing:0.04em">PRIMERA. — OBJETO DEL CONTRATO</h2>
<p style="margin-bottom:1rem;line-height:1.9">La ARRENDADORA da en arrendamiento a la ARRENDATARIA el inmueble ubicado en Calle Madero #45, Col. Centro Histórico, Ciudad de México, C.P. 06000, con una superficie de 320 m² de construcción destinado exclusivamente para uso comercial.</p>

<h2 style="font-size:0.95rem;font-weight:700;margin:1.5rem 0 0.6rem;text-transform:uppercase;letter-spacing:0.04em">SEGUNDA. — PLAZO</h2>
<p style="margin-bottom:1rem;line-height:1.9">El presente contrato tendrá una vigencia de <del style="background:rgba(249,115,22,0.12);color:#f97316;text-decoration:line-through;padding:0 2px;border-radius:2px" title="Eliminado por Ana Martínez">un año calendario</del><sup style="color:#f97316;font-size:8px;font-weight:700;margin-left:1px">AM</sup> doce meses contados a partir del día primero de junio de dos mil veintiséis, con posibilidad de prórroga.</p>

<h2 style="font-size:0.95rem;font-weight:700;margin:1.5rem 0 0.6rem;text-transform:uppercase;letter-spacing:0.04em">TERCERA. — RENTA</h2>
<p style="margin-bottom:1rem;line-height:1.9">La <del style="background:rgba(16,185,129,0.12);color:#10b981;text-decoration:line-through;padding:0 2px;border-radius:2px" title="Cambiado por Carlos Ruiz">renta mensual</del><sup style="color:#10b981;font-size:8px;font-weight:700;margin-left:1px">CR</sup> <span style="background:rgba(16,185,129,0.12);border-bottom:2px solid #10b981;padding:0 2px 1px;border-radius:2px" title="Cambiado por Carlos Ruiz">contraprestación mensual</span><sup style="color:#10b981;font-size:8px;font-weight:700;margin-left:1px">CR</sup> pactada es de $28,000.00 (Veintiocho mil pesos 00/100 M.N.), pagaderos dentro de los primeros cinco días hábiles de cada mes.</p>

<h2 style="font-size:0.95rem;font-weight:700;margin:1.5rem 0 0.6rem;text-transform:uppercase;letter-spacing:0.04em">CUARTA. — DEPÓSITO EN GARANTÍA</h2>
<p style="margin-bottom:1rem;line-height:1.9">La ARRENDATARIA entregará en este acto la cantidad de $56,000.00 (Cincuenta y seis mil pesos 00/100 M.N.) como depósito en garantía equivalente a dos meses de renta, misma que le será devuelta a la terminación del contrato, previo inventario.</p>

<h2 style="font-size:0.95rem;font-weight:700;margin:1.5rem 0 0.6rem;text-transform:uppercase;letter-spacing:0.04em">QUINTA. — USO DEL INMUEBLE</h2>
<p style="margin-bottom:1rem;line-height:1.9">La ARRENDATARIA se obliga a destinar el inmueble exclusivamente para uso comercial y oficinas, quedando expresamente prohibido el uso habitacional, almacenamiento de materiales peligrosos o cualquier actividad ilícita.</p>

<p style="margin-top:3rem;margin-bottom:1rem;line-height:1.9">Leído que fue el presente contrato por las partes y enteradas de su contenido, lo firman de conformidad en la Ciudad de México, el día <strong>01 de junio de 2026</strong>.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;margin-top:3rem">
  <div style="text-align:center">
    <div style="border-top:1px solid #d1d5db;padding-top:0.5rem;margin-top:2rem">
      <p style="font-weight:600;font-size:0.85rem">LA ARRENDADORA</p>
      <p style="color:#6b7280;font-size:0.8rem">María Torres</p>
    </div>
  </div>
  <div style="text-align:center">
    <div style="border-top:1px solid #d1d5db;padding-top:0.5rem;margin-top:2rem">
      <p style="font-weight:600;font-size:0.85rem">LA ARRENDATARIA</p>
      <p style="color:#6b7280;font-size:0.8rem">Importadora Jalisco S.A. de C.V.</p>
    </div>
  </div>
</div>
`

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusChip({ status }: { status: DocStatus }) {
  const cfg: Record<DocStatus, string> = {
    "Borrador":    "bg-gray-100 text-gray-600 border-gray-200",
    "En revisión": "bg-amber-50 text-amber-700 border-amber-200",
    "Final":       "bg-green-50 text-green-700 border-green-200",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg[status]}`}>
      {status}
    </span>
  )
}

function StackedAvatars({ initials }: { initials: string[] }) {
  return (
    <div className="flex -space-x-2">
      {initials.slice(0, 3).map((init, i) => {
        const c = COLLABORATORS[init]
        return (
          <div
            key={init}
            className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: c?.color ?? "#6b7280", zIndex: 10 - i }}
            title={c?.name ?? init}
          >
            {init}
          </div>
        )
      })}
      {initials.length > 3 && (
        <div
          className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground"
          style={{ zIndex: 7 }}
        >
          +{initials.length - 3}
        </div>
      )}
    </div>
  )
}

function ToolBtn({
  onClick, title, children, active,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted text-foreground/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

// ─── Document List ────────────────────────────────────────────────────────────

function DocumentList({
  onOpen,
}: {
  onOpen: (doc: DocumentFile) => void
}) {
  const [search, setSearch] = useState("")
  const filtered = DOCUMENTS.filter(
    (d) => !search || d.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      <div className="px-6 border-b border-border bg-background shrink-0 h-16 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#725a4214] flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-[22px] font-semibold text-foreground leading-none">Editor de documentos</h1>
          </div>
          <Button className="gap-2 bg-[#111111] text-white hover:bg-[#333333] shrink-0">
            <Plus className="w-4 h-4" />
            Nuevo documento
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpen(doc)}
              className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:bg-muted/30 cursor-pointer transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate text-sm">{doc.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-muted-foreground/50" />
                  <span className="text-xs text-muted-foreground">Modificado {doc.lastModified}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <StackedAvatars initials={doc.authors} />
                <StatusChip status={doc.status} />
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Document Editor ──────────────────────────────────────────────────────────

function DocumentEditor({
  doc,
  onBack,
}: {
  doc: DocumentFile
  onBack: () => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [trackChangesOpen, setTrackChangesOpen] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<TrackedChange[]>(INITIAL_CHANGES)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = INITIAL_DOC_HTML
    }
  // only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function execCmd(cmd: string, value?: string) {
    document.execCommand(cmd, false, value ?? undefined)
    editorRef.current?.focus()
  }

  function acceptChange(id: string) {
    setPendingChanges((prev) => prev.filter((c) => c.id !== id))
  }
  function rejectChange(id: string) {
    setPendingChanges((prev) => prev.filter((c) => c.id !== id))
  }

  const pendingCount = pendingChanges.length

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">

      {/* ── Top bar ── */}
      <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-3 shrink-0 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Documentos</span>
        </Button>
        <span className="text-border shrink-0">|</span>
        <input
          className="font-semibold text-foreground bg-transparent border-none outline-none text-sm flex-1 min-w-0 truncate"
          defaultValue={doc.title}
        />

        <div className="flex items-center gap-2 shrink-0">
          {/* Live collaborator avatars with pulsing indicator */}
          <div className="hidden lg:flex items-center gap-2">
            {doc.authors.map((init) => {
              const c = COLLABORATORS[init]
              return (
                <div key={init} className="relative" title={`${c?.name ?? init} — en línea`}>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: c?.color ?? "#6b7280" }}
                  >
                    {init}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                    style={{ backgroundColor: c?.color ?? "#6b7280" }}
                  />
                </div>
              )
            })}
          </div>

          <StatusChip status={doc.status} />

          {pendingCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className={`gap-1.5 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 ${
                trackChangesOpen ? "bg-amber-50" : ""
              }`}
              onClick={() => setTrackChangesOpen(!trackChangesOpen)}
            >
              <Users className="w-3.5 h-3.5" />
              {pendingCount} cambio{pendingCount !== 1 ? "s" : ""}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Historial</span>
          </Button>

          <Button
            size="sm"
            className="gap-1.5 text-xs bg-[#111111] text-white hover:bg-[#333333]"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar
          </Button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="border-b border-border bg-card px-4 py-1.5 flex items-center gap-0.5 shrink-0 flex-wrap">
        <select
          className="h-7 text-xs border border-border rounded px-2 mr-1.5 bg-background text-foreground focus:outline-none"
          defaultValue="12"
          onChange={(e) => execCmd("fontSize", e.target.value)}
        >
          {[
            { label: "10px", val: "1" },
            { label: "12px", val: "2" },
            { label: "14px", val: "3" },
            { label: "16px", val: "4" },
            { label: "18px", val: "5" },
            { label: "20px", val: "6" },
            { label: "24px", val: "7" },
          ].map((s) => (
            <option key={s.val} value={s.val}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolBtn onClick={() => execCmd("bold")} title="Negrita (Ctrl+B)">
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("italic")} title="Cursiva (Ctrl+I)">
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("underline")} title="Subrayado (Ctrl+U)">
          <Underline className="w-3.5 h-3.5" />
        </ToolBtn>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolBtn onClick={() => execCmd("formatBlock", "h1")} title="Encabezado 1">
          <span className="text-[10px] font-black">H1</span>
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("formatBlock", "h2")} title="Encabezado 2">
          <span className="text-[10px] font-black">H2</span>
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("formatBlock", "h3")} title="Encabezado 3">
          <span className="text-[10px] font-black">H3</span>
        </ToolBtn>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolBtn onClick={() => execCmd("insertUnorderedList")} title="Lista con viñetas">
          <List className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("insertOrderedList")} title="Lista numerada">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolBtn>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolBtn onClick={() => execCmd("justifyLeft")} title="Alinear izquierda">
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("justifyCenter")} title="Centrar">
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("justifyRight")} title="Alinear derecha">
          <AlignRight className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("justifyFull")} title="Justificar">
          <AlignJustify className="w-3.5 h-3.5" />
        </ToolBtn>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-hidden flex">

        {/* Document canvas */}
        <div className="flex-1 overflow-y-auto bg-zinc-100 py-10 px-4">
          <div
            className="max-w-[794px] mx-auto bg-white shadow-md rounded-sm min-h-[1000px] px-16 py-14"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13.5px",
              lineHeight: "1.85",
              color: "#1a1a1a",
            }}
          >
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none focus:outline-none"
            />
          </div>
        </div>

        {/* Track changes panel */}
        {trackChangesOpen && pendingCount > 0 && (
          <div className="w-[300px] border-l border-border bg-card flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Control de cambios</h3>
              <span className="text-xs text-muted-foreground bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {pendingChanges.map((change) => (
                <div
                  key={change.id}
                  className="border border-border rounded-lg p-3 bg-background"
                  style={{ borderLeftWidth: 3, borderLeftColor: change.userColor }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                      style={{ backgroundColor: change.userColor }}
                    >
                      {change.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{change.user}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
                      {change.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed mb-3 italic">
                    {change.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => acceptChange(change.id)}
                    >
                      <Check className="w-3 h-3" />
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs gap-1 border-destructive/30 text-destructive hover:bg-destructive/5"
                      onClick={() => rejectChange(change.id)}
                    >
                      <X className="w-3 h-3" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              ))}
              {pendingCount === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Check className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-foreground">Todo revisado</p>
                  <p className="text-xs text-muted-foreground mt-1">No hay cambios pendientes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Version history sheet ── */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="right" className="w-[340px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
            <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
              <History className="w-4 h-4 text-primary" />
              Historial de versiones
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="relative">
              <div className="absolute left-[11px] top-4 bottom-0 w-px bg-border" />
              <div className="space-y-7">
                {VERSIONS.map((v) => (
                  <div key={v.id} className="flex gap-4 items-start">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 mt-0.5 ${
                        v.isCurrent
                          ? "border-primary bg-primary"
                          : "border-border bg-background"
                      }`}
                    >
                      {v.isCurrent && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold ${
                            v.isCurrent ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {v.label}
                        </span>
                        {v.isCurrent && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                            actual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.timestamp}</p>
                      <p className="text-xs text-muted-foreground">Por: {v.author}</p>
                      {v.changes > 0 && (
                        <p className="text-xs text-foreground/50 mt-0.5">
                          {v.changes} cambio{v.changes !== 1 ? "s" : ""}
                        </p>
                      )}
                      {!v.isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-6 text-xs text-primary hover:text-primary hover:bg-primary/5 px-2 -ml-2"
                        >
                          Restaurar esta versión →
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function EditorDocumentos() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null)

  if (selectedDoc) {
    return (
      <DocumentEditor
        doc={selectedDoc}
        onBack={() => setSelectedDoc(null)}
      />
    )
  }

  return <DocumentList onOpen={setSelectedDoc} />
}


