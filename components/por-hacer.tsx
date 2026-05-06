"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building,
  Layers,
  Trash2,
  Filter,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type Prioridad = "urgente" | "alta" | "normal" | "baja"
type Categoria = "expediente" | "cliente" | "administrativo" | "interno"

interface Tarea {
  id: string
  titulo: string
  prioridad: Prioridad
  categoria: Categoria
  expediente?: string
  cliente?: string
  vencimiento?: string
  completado: boolean
  assignee?: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const INITIAL_TAREAS: Tarea[] = [
  {
    id: "t1",
    titulo: "Presentar escrito de contestación de demanda",
    prioridad: "urgente",
    categoria: "expediente",
    expediente: "EXP-2024-008",
    cliente: "González vs. Industrias del Norte",
    vencimiento: "Hoy 23:59",
    assignee: "MG",
    completado: false,
  },
  {
    id: "t2",
    titulo: "Revisar y firmar contrato de prestación de servicios TechCorp",
    prioridad: "urgente",
    categoria: "expediente",
    expediente: "EXP-2024-001",
    cliente: "TechCorp S.A.",
    vencimiento: "Mañana 12:00",
    assignee: "CL",
    completado: false,
  },
  {
    id: "t3",
    titulo: "Depositar honorarios en cuenta del despacho",
    prioridad: "alta",
    categoria: "administrativo",
    vencimiento: "Hoy",
    assignee: "DF",
    completado: false,
  },
  {
    id: "t4",
    titulo: "Llamar a cliente — Familia Herrera para actualizar estatus",
    prioridad: "alta",
    categoria: "cliente",
    expediente: "EXP-2024-005",
    cliente: "Familia Herrera",
    vencimiento: "Esta semana",
    assignee: "AG",
    completado: false,
  },
  {
    id: "t5",
    titulo: "Preparar presentación para junta mensual de socios",
    prioridad: "normal",
    categoria: "interno",
    vencimiento: "15 May 2026",
    assignee: "MG",
    completado: false,
  },
  {
    id: "t6",
    titulo: "Actualizar directorio de proveedores legales",
    prioridad: "normal",
    categoria: "administrativo",
    vencimiento: "Esta semana",
    assignee: "DF",
    completado: false,
  },
  {
    id: "t7",
    titulo: "Revisar sentencia del Juzgado Séptimo Mercantil",
    prioridad: "alta",
    categoria: "expediente",
    expediente: "EXP-2024-015",
    cliente: "Familia Reyes",
    vencimiento: "20 May 2026",
    assignee: "PR",
    completado: false,
  },
  {
    id: "t8",
    titulo: "Subir documentos escaneados al expediente digital",
    prioridad: "baja",
    categoria: "administrativo",
    assignee: "SC",
    completado: false,
  },
  {
    id: "t9",
    titulo: "Enviar contrato firmado a StartupXYZ",
    prioridad: "urgente",
    categoria: "expediente",
    expediente: "EXP-2024-002",
    cliente: "StartupXYZ",
    vencimiento: "Completado hoy",
    assignee: "CL",
    completado: true,
  },
  {
    id: "t10",
    titulo: "Confirmar fecha de audiencia con Juzgado Familiar",
    prioridad: "alta",
    categoria: "expediente",
    expediente: "EXP-2024-003",
    vencimiento: "Completado ayer",
    assignee: "AG",
    completado: true,
  },
]

// ── Config ────────────────────────────────────────────────────────────────────

const PRIORIDAD_CONFIG: Record<Prioridad, { label: string; color: string; bg: string; icon: typeof AlertTriangle }> = {
  urgente: { label: "Urgente", color: "#BE123C", bg: "#FFF1F2", icon: AlertTriangle },
  alta:    { label: "Alta",    color: "#B45309", bg: "#FFFBEB", icon: Clock },
  normal:  { label: "Normal",  color: "#725a42", bg: "#F5F0EB", icon: Clock },
  baja:    { label: "Baja",    color: "#555555", bg: "#F5F5F5", icon: Clock },
}

const CATEGORIA_CONFIG: Record<Categoria, { label: string; icon: typeof FileText }> = {
  expediente:    { label: "Expediente",    icon: FileText },
  cliente:       { label: "Cliente",       icon: User },
  administrativo:{ label: "Administrativo",icon: Building },
  interno:       { label: "Interno",       icon: Layers },
}

const ASSIGNEE_COLORS: Record<string, string> = {
  MG: "#725a42", CL: "#7c3aed", AG: "#10b981", PR: "#0ea5e9",
  LH: "#ec4899", RM: "#f97316", SC: "#14b8a6", DF: "#64748b",
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  const c = PRIORIDAD_CONFIG[prioridad]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  )
}

function CategoriaBadge({ categoria }: { categoria: Categoria }) {
  const c = CATEGORIA_CONFIG[categoria]
  const Icon = c.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F5F5] text-[#555555] whitespace-nowrap shrink-0">
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  )
}

function Avatar({ initials }: { initials: string }) {
  const color = ASSIGNEE_COLORS[initials] ?? "#725a42"
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
      style={{ backgroundColor: color }}
      title={initials}
    >
      {initials}
    </div>
  )
}

interface TareaRowProps {
  tarea: Tarea
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TareaRow({ tarea, onToggle, onDelete }: TareaRowProps) {
  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3.5 border-b border-[#EAEAEA] transition-colors last:border-0 ${
        tarea.completado ? "bg-[#FAFAFA]" : "bg-white hover:bg-[#FAFAFA]"
      }`}
    >
      <button
        onClick={() => onToggle(tarea.id)}
        className="mt-0.5 shrink-0 text-[#CCCCCC] hover:text-[#111111] transition-colors"
      >
        {tarea.completado
          ? <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          : <Circle className="w-5 h-5" />
        }
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-[14px] leading-snug ${tarea.completado ? "line-through text-[#888888]" : "text-[#111111]"}`}>
          {tarea.titulo}
        </p>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <PrioridadBadge prioridad={tarea.prioridad} />
          <CategoriaBadge categoria={tarea.categoria} />
          {tarea.expediente && (
            <span className="text-[11px] text-[#888888] font-mono">{tarea.expediente}</span>
          )}
          {tarea.cliente && (
            <span className="text-[11px] text-[#555555]">{tarea.cliente}</span>
          )}
          {tarea.vencimiento && (
            <span className={`text-[11px] flex items-center gap-0.5 ${
              tarea.vencimiento.toLowerCase().startsWith("hoy") && !tarea.completado
                ? "text-[#BE123C] font-semibold"
                : "text-[#888888]"
            }`}>
              <Clock className="w-3 h-3" />
              {tarea.vencimiento}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {tarea.assignee && <Avatar initials={tarea.assignee} />}
        <button
          onClick={() => onDelete(tarea.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#CCCCCC] hover:text-[#EF4444]"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function PorHacer() {
  const [tareas, setTareas] = useState<Tarea[]>(INITIAL_TAREAS)
  const [filtro, setFiltro] = useState<"todas" | "pendientes" | "completadas">("pendientes")
  const [modalOpen, setModalOpen] = useState(false)
  const [nueva, setNueva] = useState({ titulo: "", prioridad: "normal" as Prioridad, categoria: "expediente" as Categoria, vencimiento: "" })

  const pendientes   = tareas.filter(t => !t.completado)
  const completadas  = tareas.filter(t => t.completado)
  const urgentes     = pendientes.filter(t => t.prioridad === "urgente").length

  const tareasFiltradas = filtro === "todas"
    ? tareas
    : filtro === "pendientes"
    ? pendientes
    : completadas

  function handleToggle(id: string) {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, completado: !t.completado } : t))
  }

  function handleDelete(id: string) {
    setTareas(prev => prev.filter(t => t.id !== id))
    toast.success("Tarea eliminada")
  }

  function handleAdd() {
    if (!nueva.titulo.trim()) return
    const tarea: Tarea = {
      id: `t${Date.now()}`,
      titulo: nueva.titulo.trim(),
      prioridad: nueva.prioridad,
      categoria: nueva.categoria,
      vencimiento: nueva.vencimiento || undefined,
      assignee: "MG",
      completado: false,
    }
    setTareas(prev => [tarea, ...prev])
    setNueva({ titulo: "", prioridad: "normal", categoria: "expediente", vencimiento: "" })
    setModalOpen(false)
    toast.success("Tarea agregada")
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">

      {/* Header */}
      <header className="h-16 border-b border-[#EAEAEA] bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#725a4214] flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4 text-[#725a42]" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-[#111111] leading-none">Por hacer</h1>
            <p className="text-[12px] text-[#888888] mt-0.5">Tareas y pendientes del despacho</p>
          </div>
        </div>
        <Button
          className="bg-[#111111] text-white hover:bg-[#333333] gap-1.5 h-9 px-4 text-[13px]"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Nueva tarea
        </Button>
      </header>

      {/* Stats */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-[#EAEAEA] flex flex-wrap items-center gap-4 sm:gap-6 shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[20px] sm:text-[22px] font-bold text-[#111111]">{pendientes.length}</span>
            <span className="text-[11px] text-[#888888]">Pendientes</span>
          </div>
          <div className="w-px h-8 bg-[#EAEAEA]" />
          <div className="flex flex-col">
            <span className="text-[20px] sm:text-[22px] font-bold text-[#BE123C]">{urgentes}</span>
            <span className="text-[11px] text-[#888888]">Urgentes</span>
          </div>
          <div className="w-px h-8 bg-[#EAEAEA]" />
          <div className="flex flex-col">
            <span className="text-[20px] sm:text-[22px] font-bold text-[#10B981]">{completadas.length}</span>
            <span className="text-[11px] text-[#888888]">Completadas</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-lg p-1 sm:ml-auto">
          {(["pendientes", "todas", "completadas"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-[12px] font-medium transition-colors ${
                filtro === f
                  ? "bg-white text-[#111111] shadow-sm"
                  : "text-[#555555] hover:text-[#111111]"
              }`}
            >
              {f === "pendientes" ? "Pendientes" : f === "todas" ? "Todas" : "Hechas"}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-6">
        {tareasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#CCCCCC] mb-3" />
            <p className="text-[#555555] font-medium">Sin tareas en esta vista</p>
            <p className="text-[#888888] text-sm mt-1">¡Todo al día!</p>
          </div>
        ) : (
          <>
            {/* Urgentes section */}
            {filtro !== "completadas" && tareasFiltradas.filter(t => t.prioridad === "urgente" && !t.completado).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#BE123C]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#BE123C]">Urgente</span>
                </div>
                <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden shadow-sm">
                  {tareasFiltradas.filter(t => t.prioridad === "urgente" && !t.completado).map(t => (
                    <TareaRow key={t.id} tarea={t} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )}

            {/* Pendientes normales */}
            {filtro !== "completadas" && tareasFiltradas.filter(t => t.prioridad !== "urgente" && !t.completado).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Filter className="w-3.5 h-3.5 text-[#555555]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">Pendientes</span>
                </div>
                <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden shadow-sm">
                  {tareasFiltradas
                    .filter(t => t.prioridad !== "urgente" && !t.completado)
                    .sort((a, b) => {
                      const order: Record<Prioridad, number> = { urgente: 0, alta: 1, normal: 2, baja: 3 }
                      return order[a.prioridad] - order[b.prioridad]
                    })
                    .map(t => (
                      <TareaRow key={t.id} tarea={t} onToggle={handleToggle} onDelete={handleDelete} />
                    ))}
                </div>
              </div>
            )}

            {/* Completadas */}
            {filtro !== "pendientes" && tareasFiltradas.filter(t => t.completado).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981]">Completadas</span>
                </div>
                <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden shadow-sm">
                  {tareasFiltradas.filter(t => t.completado).map(t => (
                    <TareaRow key={t.id} tarea={t} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* New task modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Descripción de la tarea</Label>
                <Input
                  placeholder="¿Qué hay que hacer?"
                  value={nueva.titulo}
                  onChange={e => setNueva(p => ({ ...p, titulo: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Prioridad</Label>
                  <select
                    value={nueva.prioridad}
                    onChange={e => setNueva(p => ({ ...p, prioridad: e.target.value as Prioridad }))}
                    className="h-9 rounded-md border border-[#EAEAEA] bg-white px-3 text-sm text-[#111111] outline-none focus-visible:border-[#725a42] focus-visible:ring-2 focus-visible:ring-[#725a4214]"
                  >
                    <option value="urgente">Urgente</option>
                    <option value="alta">Alta</option>
                    <option value="normal">Normal</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Categoría</Label>
                  <select
                    value={nueva.categoria}
                    onChange={e => setNueva(p => ({ ...p, categoria: e.target.value as Categoria }))}
                    className="h-9 rounded-md border border-[#EAEAEA] bg-white px-3 text-sm text-[#111111] outline-none focus-visible:border-[#725a42] focus-visible:ring-2 focus-visible:ring-[#725a4214]"
                  >
                    <option value="expediente">Expediente</option>
                    <option value="cliente">Cliente</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="interno">Interno</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Vencimiento (opcional)</Label>
                <Input
                  placeholder="Ej. Hoy 18:00, Esta semana, 20 May 2026"
                  value={nueva.vencimiento}
                  onChange={e => setNueva(p => ({ ...p, vencimiento: e.target.value }))}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={!nueva.titulo.trim()}>Agregar tarea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
