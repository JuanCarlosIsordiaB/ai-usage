"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Share2,
  History,
  Save,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Check,
  X,
  MoreHorizontal,
  Link2,
  Image,
  Table2,
  Highlighter,
  Strikethrough,
  RotateCcw,
  RotateCw,
} from "lucide-react"
import type { Document } from "./documentos-list"

// ─── Collaborator definitions ──────────────────────────────────────────────────

const COLLABORATORS = [
  { name: "Ana García",    initials: "AG", color: "#10b981", online: true  },
  { name: "Carlos López",  initials: "CL", color: "#7c3aed", online: true  },
  { name: "María Torres",  initials: "MT", color: "#f97316", online: false },
]

// ─── Track-change data ─────────────────────────────────────────────────────────

interface Change {
  id: string
  author: (typeof COLLABORATORS)[number]
  type: "inserción" | "eliminación"
  snippet: string
  time: string
}

const PENDING_CHANGES: Change[] = [
  {
    id: "c1",
    author: COLLABORATORS[0],
    type: "inserción",
    snippet: "…deberá cumplir con las disposiciones establecidas en el Código Civil Federal…",
    time: "hace 8 min",
  },
  {
    id: "c2",
    author: COLLABORATORS[1],
    type: "eliminación",
    snippet: "…de conformidad con lo estipulado previamente por las partes contratantes…",
    time: "hace 22 min",
  },
  {
    id: "c3",
    author: COLLABORATORS[0],
    type: "inserción",
    snippet: "…con vigencia a partir del 1° de junio de 2026 y hasta el 31 de mayo de 2027…",
    time: "hace 35 min",
  },
]

// ─── Version history data ──────────────────────────────────────────────────────

const VERSIONS = [
  { id: "v4", label: "Versión actual",       author: COLLABORATORS[0], time: "Hoy, 10:48",         tag: "En revisión" },
  { id: "v3", label: "Versión final v2",     author: COLLABORATORS[1], time: "Hoy, 09:15",         tag: "Guardada"    },
  { id: "v2", label: "Borrador revisado",    author: COLLABORATORS[0], time: "Ayer, 16:30",        tag: null          },
  { id: "v1", label: "Versión inicial",      author: COLLABORATORS[1], time: "02 May 2026, 11:00", tag: null          },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function CollaboratorAvatar({
  c,
  size = "md",
}: {
  c: (typeof COLLABORATORS)[number]
  size?: "sm" | "md"
}) {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-xs"
  return (
    <div className="relative" title={c.name}>
      <div
        className={`${dim} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white`}
        style={{ backgroundColor: c.color }}
      >
        {c.initials}
      </div>
      {c.online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-1 ring-white" />
      )}
    </div>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border mx-1" />
}

function ToolbarButton({
  children,
  active,
  title,
}: {
  children: React.ReactNode
  active?: boolean
  title?: string
}) {
  return (
    <button
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

// Inline tracked-change highlight
function TrackedSpan({
  color,
  bg,
  border,
  author,
  type,
  children,
}: {
  color: string
  bg: string
  border: string
  author: string
  type: "ins" | "del"
  children: React.ReactNode
}) {
  return (
    <span className="relative inline">
      {/* Author label bubble */}
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-t-md mr-0.5 select-none"
        style={{ backgroundColor: color, color: "#fff" }}
      >
        {author}
        {type === "ins" ? " +" : " −"}
      </span>
      <span
        className={`px-0.5 ${type === "del" ? "line-through opacity-70" : ""}`}
        style={{ backgroundColor: bg, borderBottom: `2px solid ${border}` }}
      >
        {children}
      </span>
    </span>
  )
}

// Change card in the right panel
function ChangeCard({
  change,
  onAccept,
  onReject,
}: {
  change: Change
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <div className="p-3 border border-border rounded-lg bg-background hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: change.author.color }}
          >
            {change.author.initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground leading-none">{change.author.name}</p>
            <p className="text-[10px] text-muted-foreground">{change.time}</p>
          </div>
        </div>
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
            change.type === "inserción"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {change.type}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 italic">{change.snippet}</p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onAccept}
          className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 flex-1"
        >
          <Check className="w-3 h-3" />
          Aceptar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onReject}
          className="h-7 px-3 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 gap-1.5 flex-1"
        >
          <X className="w-3 h-3" />
          Rechazar
        </Button>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface DocumentosEditorProps {
  document: Document
  onBack: () => void
}

export function DocumentosEditor({ document, onBack }: DocumentosEditorProps) {
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showTrackChanges,   setShowTrackChanges]   = useState(true)
  const [changes, setChanges] = useState<Change[]>(PENDING_CHANGES)

  const acceptChange  = (id: string) => setChanges((p) => p.filter((c) => c.id !== id))
  const rejectChange  = (id: string) => setChanges((p) => p.filter((c) => c.id !== id))
  const acceptAll     = () => setChanges([])

  return (
    <div className="flex flex-col h-full bg-background">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background px-4 flex items-center gap-3 h-16 shrink-0">
        {/* Back */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <input
            className="w-full text-base font-semibold text-foreground bg-transparent border-b-2 border-transparent hover:border-border focus:border-primary outline-none truncate transition-colors"
            defaultValue={document.name}
          />
        </div>

        {/* Status chip */}
        <span
          className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            document.status === "En revisión"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : document.status === "Final"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {document.status}
        </span>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Online collaborators */}
        <div className="flex items-center -space-x-2 shrink-0">
          {COLLABORATORS.map((c) => (
            <CollaboratorAvatar key={c.name} c={c} />
          ))}
        </div>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Track changes toggle */}
        <Button
          variant={showTrackChanges ? "default" : "outline"}
          size="sm"
          onClick={() => setShowTrackChanges((v) => !v)}
          className={`h-8 text-xs gap-1.5 shrink-0 ${
            showTrackChanges
              ? "bg-primary text-primary-foreground"
              : "border-border text-foreground"
          }`}
        >
          <Highlighter className="w-3.5 h-3.5" />
          Control de cambios
          {changes.length > 0 && (
            <span className="ml-1 w-4 h-4 rounded-full bg-amber-400 text-[10px] font-bold text-amber-900 flex items-center justify-center">
              {changes.length}
            </span>
          )}
        </Button>

        {/* Version history */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowVersionHistory((v) => !v)}
          className="h-8 text-xs gap-1.5 border-border text-foreground shrink-0"
        >
          <History className="w-3.5 h-3.5" />
          Historial
        </Button>

        {/* Share */}
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-border text-foreground shrink-0">
          <Share2 className="w-3.5 h-3.5" />
          Compartir
        </Button>

        {/* Save */}
        <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground shrink-0">
          <Save className="w-3.5 h-3.5" />
          Guardar
        </Button>
      </header>

      {/* ── Formatting toolbar ───────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card px-3 py-1.5 flex items-center gap-0.5 overflow-x-auto">
        {/* Undo / Redo */}
        <ToolbarButton title="Deshacer"><RotateCcw className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Rehacer"><RotateCw className="w-3.5 h-3.5" /></ToolbarButton>

        <ToolbarDivider />

        {/* Style selector */}
        <button className="flex items-center gap-1.5 h-8 px-2.5 rounded text-sm text-foreground hover:bg-muted transition-colors">
          <span className="min-w-[80px] text-left text-sm">Normal</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        <ToolbarDivider />

        {/* Font size */}
        <button className="flex items-center gap-1 h-8 px-2 rounded text-sm text-foreground hover:bg-muted transition-colors">
          <span className="w-7 text-center text-sm font-medium">12</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        <ToolbarDivider />

        {/* Text formatting */}
        <ToolbarButton title="Negrita"><Bold className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Cursiva"><Italic className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Subrayado"><Underline className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Tachado"><Strikethrough className="w-3.5 h-3.5" /></ToolbarButton>

        <ToolbarDivider />

        {/* Color */}
        <button
          title="Color de texto"
          className="w-8 h-8 flex flex-col items-center justify-center gap-0.5 rounded hover:bg-muted transition-colors"
        >
          <span className="text-xs font-bold text-foreground leading-none">A</span>
          <span className="w-4 h-1 rounded-sm bg-primary" />
        </button>

        <button
          title="Resaltar"
          className="w-8 h-8 flex flex-col items-center justify-center gap-0.5 rounded hover:bg-muted transition-colors"
        >
          <Highlighter className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton title="Lista con viñetas"><List className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Lista numerada"><ListOrdered className="w-3.5 h-3.5" /></ToolbarButton>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton active title="Alinear a la izquierda"><AlignLeft className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Centrar"><AlignCenter className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Alinear a la derecha"><AlignRight className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Justificar"><AlignJustify className="w-3.5 h-3.5" /></ToolbarButton>

        <ToolbarDivider />

        {/* Insert */}
        <ToolbarButton title="Insertar enlace"><Link2 className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Insertar imagen"><Image className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Insertar tabla"><Table2 className="w-3.5 h-3.5" /></ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Más opciones"><MoreHorizontal className="w-3.5 h-3.5" /></ToolbarButton>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Canvas area ── */}
        <div className="flex-1 bg-gray-100 overflow-auto py-10 px-6">
          {/* Paper */}
          <div
            className="mx-auto bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] min-h-[1056px]"
            style={{ width: "816px", padding: "96px 96px 96px" }}
          >
            {/* Coloured user cursors legend */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-dashed border-gray-200">
              {COLLABORATORS.filter((c) => c.online).map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-gray-500">{c.name}</span>
                </div>
              ))}
            </div>

            {/* ── Document content ── */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              Contrato de Prestación de Servicios
            </h1>
            <p className="text-sm text-gray-500 mb-8">TechCorp S.A. de C.V. · EXP-2024-001</p>

            <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">
              I. Partes Contratantes
            </h2>
            <p className="text-sm text-gray-700 leading-7 mb-6">
              Por una parte, <strong>TechCorp S.A. de C.V.</strong>, con domicilio en Av. Reforma 350, Col. Juárez,
              Ciudad de México, representada en este acto por su Director General, el Lic. Roberto Sandoval
              Jiménez (en adelante "el Cliente"); y por la otra parte, el Despacho Jurídico{" "}
              <strong>LegalPro Abogados S.C.</strong>, con domicilio en Paseo de la Reforma 505, Piso 12,
              Col. Cuauhtémoc, Ciudad de México (en adelante "el Prestador").
            </p>

            <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">
              II. Objeto del Contrato
            </h2>
            <p className="text-sm text-gray-700 leading-7 mb-4">
              El Prestador se obliga a prestar al Cliente los servicios jurídicos de asesoría, consultoría y
              representación legal en materia{" "}
              <TrackedSpan
                color="#10b981"
                bg="#d1fae5"
                border="#10b981"
                author="Ana G."
                type="ins"
              >
                mercantil, corporativa y de propiedad intelectual
              </TrackedSpan>
              , en los términos y condiciones que se establecen en el presente instrumento.
            </p>

            <p className="text-sm text-gray-700 leading-7 mb-6">
              El Prestador{" "}
              <TrackedSpan
                color="#10b981"
                bg="#d1fae5"
                border="#10b981"
                author="Ana G."
                type="ins"
              >
                deberá cumplir con las disposiciones establecidas en el Código Civil Federal y demás
                ordenamientos aplicables
              </TrackedSpan>
              {" "}durante la vigencia del presente contrato.{" "}
              <TrackedSpan
                color="#7c3aed"
                bg="#ede9fe"
                border="#7c3aed"
                author="Carlos L."
                type="del"
              >
                de conformidad con lo estipulado previamente por las partes contratantes en reunión del
                15 de enero del año en curso
              </TrackedSpan>
            </p>

            <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">
              III. Vigencia
            </h2>
            <p className="text-sm text-gray-700 leading-7 mb-6">
              El presente contrato tendrá una vigencia de doce meses,{" "}
              <TrackedSpan
                color="#10b981"
                bg="#d1fae5"
                border="#10b981"
                author="Ana G."
                type="ins"
              >
                con vigencia a partir del 1° de junio de 2026 y hasta el 31 de mayo de 2027
              </TrackedSpan>
              , pudiendo prorrogarse por períodos iguales mediante acuerdo escrito de ambas partes con un
              mínimo de treinta días naturales de anticipación a su vencimiento.
            </p>

            <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">
              IV. Honorarios y Forma de Pago
            </h2>
            <p className="text-sm text-gray-700 leading-7 mb-4">
              El Cliente se obliga a pagar al Prestador por los servicios objeto del presente contrato la
              cantidad de{" "}
              <strong>$85,000.00 (Ochenta y cinco mil pesos 00/100 M.N.)</strong> mensuales más el Impuesto
              al Valor Agregado correspondiente, pagaderos dentro de los primeros cinco días hábiles de
              cada mes.
            </p>

            {/* User B cursor indicator */}
            <div className="flex items-center gap-1 my-2">
              <div
                className="w-0.5 h-5 animate-pulse"
                style={{ backgroundColor: "#7c3aed" }}
              />
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: "#7c3aed" }}
              >
                Carlos L.
              </span>
            </div>

            <p className="text-sm text-gray-400 italic leading-7">
              V. Confidencialidad · VI. Rescisión · VII. Jurisdicción…{" "}
              <span className="text-xs text-gray-300">[resto del documento]</span>
            </p>
          </div>
        </div>

        {/* ── Track changes panel ── */}
        {showTrackChanges && (
          <aside className="w-80 border-l border-border bg-card flex flex-col overflow-hidden shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Control de cambios</h3>
                {changes.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                    {changes.length}
                  </span>
                )}
              </div>
              {changes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={acceptAll}
                  className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
                >
                  Aceptar todos
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {changes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                  <Check className="w-8 h-8 mb-2 text-emerald-400" />
                  <p className="text-sm font-medium text-foreground">Sin cambios pendientes</p>
                  <p className="text-xs mt-1">Todos los cambios han sido revisados.</p>
                </div>
              ) : (
                changes.map((c) => (
                  <ChangeCard
                    key={c.id}
                    change={c}
                    onAccept={() => acceptChange(c.id)}
                    onReject={() => rejectChange(c.id)}
                  />
                ))
              )}
            </div>
          </aside>
        )}

        {/* ── Version history overlay ── */}
        {showVersionHistory && (
          <aside className="w-80 border-l border-border bg-card flex flex-col overflow-hidden shrink-0 absolute right-0 top-0 bottom-0 z-20 shadow-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Historial de versiones</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVersionHistory(false)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-border" />

                <div className="space-y-6">
                  {VERSIONS.map((v, i) => (
                    <div key={v.id} className="flex gap-4 relative">
                      {/* Dot */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ring-2 ring-white ${
                          i === 0 ? "bg-primary" : "bg-white border-2 border-border"
                        }`}
                      >
                        {i === 0 && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium leading-snug ${i === 0 ? "text-primary" : "text-foreground"}`}>
                            {v.label}
                          </p>
                          {v.tag && (
                            <span
                              className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                v.tag === "En revisión"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {v.tag}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                            style={{ backgroundColor: v.author.color }}
                          >
                            {v.author.initials[0]}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {v.author.name.split(" ")[0]} · {v.time}
                          </p>
                        </div>
                        {i !== 0 && (
                          <button className="text-xs text-primary hover:underline mt-1.5">
                            Restaurar esta versión
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
