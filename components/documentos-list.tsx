"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Download,
  Trash2,
  Eye,
  Edit3,
  SortAsc,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = "Borrador" | "En revisión" | "Final"

interface Author {
  name: string
  initials: string
  color: string
}

interface Document {
  id: string
  name: string
  matter: string
  modifiedAt: string
  modifiedBy: string
  authors: Author[]
  status: DocStatus
  size: string
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const AUTHORS: Record<string, Author> = {
  ana:    { name: "Ana García",     initials: "AG", color: "#10b981" },
  carlos: { name: "Carlos López",   initials: "CL", color: "#7c3aed" },
  maria:  { name: "María Torres",   initials: "MT", color: "#f97316" },
  pedro:  { name: "Pedro Ramírez",  initials: "PR", color: "#0ea5e9" },
  lucia:  { name: "Lucía Herrera",  initials: "LH", color: "#ec4899" },
}

const DOCUMENTS: Document[] = [
  {
    id: "DOC-001",
    name: "Contrato de Prestación de Servicios — TechCorp S.A.",
    matter: "EXP-2024-001",
    modifiedAt: "hace 12 min",
    modifiedBy: "Ana García",
    authors: [AUTHORS.ana, AUTHORS.carlos, AUTHORS.maria],
    status: "En revisión",
    size: "248 KB",
  },
  {
    id: "DOC-002",
    name: "Demanda Laboral — González vs. Industrias del Norte",
    matter: "EXP-2024-002",
    modifiedAt: "hace 1 hora",
    modifiedBy: "Carlos López",
    authors: [AUTHORS.carlos, AUTHORS.pedro],
    status: "Borrador",
    size: "182 KB",
  },
  {
    id: "DOC-003",
    name: "Convenio de Confidencialidad — StartupXYZ",
    matter: "EXP-2024-003",
    modifiedAt: "Ayer, 16:45",
    modifiedBy: "María Torres",
    authors: [AUTHORS.maria, AUTHORS.ana, AUTHORS.lucia, AUTHORS.pedro],
    status: "Final",
    size: "95 KB",
  },
  {
    id: "DOC-004",
    name: "Escrito de Contestación de Demanda — Caso Herrera",
    matter: "EXP-2024-005",
    modifiedAt: "02 May 2026",
    modifiedBy: "Lucía Herrera",
    authors: [AUTHORS.lucia, AUTHORS.carlos],
    status: "Borrador",
    size: "340 KB",
  },
  {
    id: "DOC-005",
    name: "Acta Constitutiva — Empresa Inmobiliaria Omega",
    matter: "EXP-2024-008",
    modifiedAt: "28 Abr 2026",
    modifiedBy: "Pedro Ramírez",
    authors: [AUTHORS.pedro, AUTHORS.ana, AUTHORS.maria],
    status: "Final",
    size: "521 KB",
  },
  {
    id: "DOC-006",
    name: "Recurso de Amparo — Flores Méndez",
    matter: "EXP-2024-011",
    modifiedAt: "25 Abr 2026",
    modifiedBy: "Ana García",
    authors: [AUTHORS.ana, AUTHORS.carlos],
    status: "En revisión",
    size: "167 KB",
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: DocStatus }) {
  const map: Record<DocStatus, { label: string; className: string }> = {
    "Borrador":    { label: "Borrador",    className: "bg-gray-100 text-gray-600 border-gray-200" },
    "En revisión": { label: "En revisión", className: "bg-amber-50 text-amber-700 border-amber-200" },
    "Final":       { label: "Final",       className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  }
  const { label, className } = map[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  )
}

function AvatarStack({ authors }: { authors: Author[] }) {
  const max = 3
  const visible = authors.slice(0, max)
  const overflow = authors.length - max

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((a) => (
        <div
          key={a.name}
          title={a.name}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white ring-2 ring-white select-none"
          style={{ backgroundColor: a.color }}
        >
          {a.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 ring-2 ring-white">
          +{overflow}
        </div>
      )}
    </div>
  )
}

function StatCard({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-2xl font-bold ${accent ?? "text-foreground"}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface DocumentosListProps {
  onOpen: (doc: Document) => void
}

export function DocumentosList({ onOpen }: DocumentosListProps) {
  const total      = DOCUMENTS.length
  const borradores = DOCUMENTS.filter((d) => d.status === "Borrador").length
  const revision   = DOCUMENTS.filter((d) => d.status === "En revisión").length
  const finales    = DOCUMENTS.filter((d) => d.status === "Final").length

  return (
    <div className="flex flex-col h-full bg-background">

      {/* ── Page header ── */}
      <header className="border-b border-border bg-background shrink-0">
        {/* Top bar */}
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#EEF0FF] rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-[22px] font-semibold text-foreground leading-none">Documentos</h1>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Nuevo documento
          </Button>
        </div>

        {/* Summary counts */}
        <div className="px-6 pb-3 flex items-center gap-8 border-t border-border pt-3">
          <StatCard value={String(total)} label="Total" />
          <div className="w-px h-6 bg-border" />
          <StatCard value={String(borradores)} label="Borradores" accent="text-[#6B7280]" />
          <StatCard value={String(revision)} label="En revisión" accent="text-[#F59E0B]" />
          <StatCard value={String(finales)} label="Finales" accent="text-[#16A34A]" />
        </div>
      </header>

      {/* ── Toolbar ── */}
      <div className="px-6 py-4 border-b border-border bg-card/50 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background border-border text-sm h-9"
            placeholder="Buscar documentos, expedientes, autores…"
          />
        </div>

        <Button variant="outline" className="h-9 gap-2 text-sm border-border text-foreground">
          <Filter className="w-3.5 h-3.5" />
          Filtrar
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </Button>

        <Button variant="outline" className="h-9 gap-2 text-sm border-border text-foreground">
          <SortAsc className="w-3.5 h-3.5" />
          Ordenar
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </Button>

        {/* Status quick-filters */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">Todos</button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:bg-muted">Borradores</button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-amber-200 text-amber-700 hover:bg-amber-50">En revisión</button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-50">Finales</button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/50 border-b border-border backdrop-blur-sm z-10">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="rounded border-border" />
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-36">Expediente</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-48">Última modificación</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-36">Autores</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-36">Estado</th>
              <th className="w-16 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DOCUMENTS.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-muted/40 transition-colors group cursor-pointer"
                onClick={() => onOpen(doc)}
              >
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-border" />
                </td>

                {/* Name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-primary/8 rounded text-primary shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                    </div>
                  </div>
                </td>

                {/* Matter */}
                <td className="px-4 py-3.5">
                  <Badge variant="outline" className="text-xs font-mono border-border text-muted-foreground">
                    {doc.matter}
                  </Badge>
                </td>

                {/* Modified */}
                <td className="px-4 py-3.5">
                  <p className="text-foreground">{doc.modifiedAt}</p>
                  <p className="text-xs text-muted-foreground">{doc.modifiedBy}</p>
                </td>

                {/* Authors */}
                <td className="px-4 py-3.5">
                  <AvatarStack authors={doc.authors} />
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusChip status={doc.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="border-t border-border bg-card px-6 py-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">6</span> de{" "}
          <span className="font-medium text-foreground">24</span> documentos
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border text-foreground" disabled>
            Anterior
          </Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  p === 1
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border text-foreground">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

export type { Document }
