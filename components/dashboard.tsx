'use client'

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Folder,
  Newspaper,
  Clock,
  Calendar,
  Users,
  Scale,
  Plus,
  MessageSquare,
  Bell,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Search,
  Zap,
} from "lucide-react"

// ── WhatsApp brand icon (kept as inline SVG) ──────────────────────────────────
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.116 1.528 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.722.97.994-3.624-.235-.372A9.818 9.818 0 1112 21.818z" />
  </svg>
)

// ── Status pill ───────────────────────────────────────────────────────────────
type StatusKey = "activo" | "revision" | "urgente" | "completado" | "hoy" | "manana" | "3dias" | "en-progreso"

const STATUS_CONFIG: Record<StatusKey, { label: string; dot: string; text: string; bg: string }> = {
  activo:        { label: "Activo",        dot: "#2563EB", text: "#2563EB", bg: "#E6EEFC" },
  revision:      { label: "Revisión",      dot: "#F59E0B", text: "#F59E0B", bg: "#FEF3C7" },
  urgente:       { label: "Urgente",       dot: "#E11D48", text: "#E11D48", bg: "#FCE7EB" },
  completado:    { label: "Completado",    dot: "#16A34A", text: "#16A34A", bg: "#E8F7EE" },
  hoy:           { label: "Hoy",           dot: "#E11D48", text: "#E11D48", bg: "#FCE7EB" },
  manana:        { label: "Mañana",        dot: "#F59E0B", text: "#F59E0B", bg: "#FEF3C7" },
  "3dias":       { label: "3 días",        dot: "#6B7280", text: "#6B7280", bg: "#F4F5F7" },
  "en-progreso": { label: "En progreso",   dot: "#5B5BFE", text: "#5B5BFE", bg: "#EEF0FF" },
}

function StatusPill({ status }: { status: StatusKey }) {
  const c = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium leading-none whitespace-nowrap shrink-0"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────
type CalendarEvent = {
  id: string
  title: string
  datetime: string
  location: string
}

type Aviso = {
  id: string
  titulo: string
  descripcion: string
  autor: string
  fecha: string
  addToCalendar: boolean
  notifyWhatsApp: boolean
}

// ── Data ──────────────────────────────────────────────────────────────────────
const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Reunión con cliente", datetime: "Hoy 14:00",     location: "Caso TechCorp" },
  { id: "2", title: "Junta de socios",     datetime: "Mañana 10:00",  location: "Despacho" },
  { id: "3", title: "Audiencia virtual",   datetime: "Viernes 09:00", location: "Juzgado Quinto" },
  { id: "4", title: "Firma de contrato",   datetime: "Lunes 11:00",   location: "StartupXYZ" },
]

const INITIAL_AVISOS: Aviso[] = [
  {
    id: "a1",
    titulo: "Reunión general de despacho",
    descripcion: "Revisión de casos activos y asignación de nuevas responsabilidades para el trimestre.",
    autor: "María González",
    fecha: "04 May 2026",
    addToCalendar: false,
    notifyWhatsApp: false,
  },
  {
    id: "a2",
    titulo: "Actualización de tarifas",
    descripcion: "Las nuevas tarifas de honorarios entran en vigor a partir del lunes próximo.",
    autor: "Carlos Ruiz",
    fecha: "03 May 2026",
    addToCalendar: false,
    notifyWhatsApp: false,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export function Dashboard() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS)
  const [whatsappModal, setWhatsappModal] = useState<{
    open: boolean
    mode: "grupo" | "directo" | null
    event: CalendarEvent | null
  }>({ open: false, mode: null, event: null })
  const [avisos, setAvisos] = useState<Aviso[]>(INITIAL_AVISOS)
  const [avisoModalOpen, setAvisoModalOpen] = useState(false)
  const [newAviso, setNewAviso] = useState({
    titulo: "",
    descripcion: "",
    addToCalendar: false,
    notifyWhatsApp: false,
  })

  useEffect(() => {
    setCalendarEvents(prev => [
      ...prev,
      {
        id: `audiencia-${Date.now()}`,
        title: "Audiencia — EXP-2024-008",
        datetime: "Por programar",
        location: "Juzgado Segundo Familiar",
      },
    ])
    toast.success("Audiencia agregada al calendario automáticamente")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openWhatsappModal(event: CalendarEvent, mode: "grupo" | "directo") {
    setWhatsappModal({ open: true, mode, event })
  }

  function closeWhatsappModal() {
    setWhatsappModal({ open: false, mode: null, event: null })
  }

  function toggleAvisoCalendar(id: string) {
    setAvisos(prev => prev.map(a => a.id === id ? { ...a, addToCalendar: !a.addToCalendar } : a))
  }

  function toggleAvisoWhatsApp(id: string) {
    setAvisos(prev => prev.map(a => a.id === id ? { ...a, notifyWhatsApp: !a.notifyWhatsApp } : a))
  }

  function handlePublicarAviso() {
    if (!newAviso.titulo.trim()) return
    const aviso: Aviso = {
      id: `aviso-${Date.now()}`,
      titulo: newAviso.titulo.trim(),
      descripcion: newAviso.descripcion.trim(),
      autor: "María González",
      fecha: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
      addToCalendar: newAviso.addToCalendar,
      notifyWhatsApp: newAviso.notifyWhatsApp,
    }
    setAvisos(prev => [aviso, ...prev])
    setNewAviso({ titulo: "", descripcion: "", addToCalendar: false, notifyWhatsApp: false })
    setAvisoModalOpen(false)
  }

  return (
    <div className="flex flex-col h-full bg-background">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="h-16 border-b border-border bg-background px-6 flex items-center gap-4 shrink-0">
        <h1 className="text-[22px] font-semibold text-foreground leading-none">Dashboard</h1>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              placeholder="Buscar expedientes, clientes..."
              className="w-full h-9 pl-9 pr-4 bg-[#F4F5F7] rounded-full text-[14px] text-foreground placeholder:text-[#9CA3AF] border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="relative w-9 h-9 rounded-lg hover:bg-[#F4F5F7] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#EEF0FF] flex items-center justify-center text-[12px] font-semibold text-primary hover:bg-[#E0E0FF] transition-colors">
            MG
          </button>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Calendario */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-[18px] font-semibold text-foreground leading-none">Calendario</CardTitle>
                <CardDescription className="text-[13px] mt-0.5">Agenda y citas programadas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {calendarEvents.map(event => (
                <div key={event.id} className="p-3.5 border border-border rounded-lg flex flex-col gap-2.5">
                  <div>
                    <p className="text-[14px] font-semibold text-foreground leading-snug">{event.title}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{event.datetime}</p>
                    <p className="text-[12px] text-muted-foreground">{event.location}</p>
                  </div>
                  <div className="flex flex-col gap-1 pt-2.5 border-t border-border">
                    <button
                      className="flex items-center gap-1.5 text-[12px] text-[#25D366] font-medium hover:underline text-left"
                      onClick={() => openWhatsappModal(event, "grupo")}
                    >
                      <WhatsAppIcon /> Enviar a grupo
                    </button>
                    <button
                      className="flex items-center gap-1.5 text-[12px] text-[#25D366] font-medium hover:underline text-left"
                      onClick={() => openWhatsappModal(event, "directo")}
                    >
                      <WhatsAppIcon /> Enviar directo
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-[13px] text-primary hover:text-primary/80 flex items-center justify-center gap-1 py-1 transition-colors">
              Abrir calendario completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardContent>
        </Card>

        {/* Avisos internos */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <CardTitle className="text-[18px] font-semibold text-foreground leading-none">Avisos internos</CardTitle>
                  <CardDescription className="text-[13px] mt-0.5">Comunicados y avisos del despacho</CardDescription>
                </div>
              </div>
              <Button
                className="bg-primary text-white hover:bg-primary/90 gap-1.5 h-9 px-4 text-[13px] font-medium"
                onClick={() => setAvisoModalOpen(true)}
              >
                <Plus className="w-4 h-4" /> Nuevo aviso
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {avisos.map(aviso => (
                <div key={aviso.id} className="p-4 border border-border rounded-lg flex flex-col gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-foreground leading-snug">{aviso.titulo}</p>
                    <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{aviso.descripcion}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] text-[#9CA3AF]">{aviso.autor}</span>
                      <span className="text-[11px] text-[#9CA3AF]">·</span>
                      <span className="text-[11px] text-[#9CA3AF]">{aviso.fecha}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`cal-${aviso.id}`}
                        className="text-[12px] text-muted-foreground cursor-pointer select-none flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Agregar al calendario
                      </Label>
                      <Switch
                        id={`cal-${aviso.id}`}
                        checked={aviso.addToCalendar}
                        onCheckedChange={() => toggleAvisoCalendar(aviso.id)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`wa-${aviso.id}`}
                        className="text-[12px] text-muted-foreground cursor-pointer select-none flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Notificar por WhatsApp
                      </Label>
                      <Switch
                        id={`wa-${aviso.id}`}
                        checked={aviso.notifyWhatsApp}
                        onCheckedChange={() => toggleAvisoWhatsApp(aviso.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Grid de secciones ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Expedientes */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
                  <Folder className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-[15px] font-semibold text-foreground">Expedientes</CardTitle>
                  <CardDescription className="text-[12px]">Gestión de expedientes activos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-[14px] font-semibold text-foreground">EXP-2024-001</p>
                  <p className="text-[12px] text-muted-foreground">Demanda laboral</p>
                </div>
                <StatusPill status="activo" />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-[14px] font-semibold text-foreground">EXP-2024-002</p>
                  <p className="text-[12px] text-muted-foreground">Contrato comercial</p>
                </div>
                <StatusPill status="revision" />
              </div>
              <button className="w-full text-[13px] text-primary hover:text-primary/80 flex items-center justify-center gap-1 pt-1 transition-colors">
                Ver todos los expedientes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </CardContent>
          </Card>

          {/* Noticias jurídicas */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F4F5F7] flex items-center justify-center shrink-0">
                  <Newspaper className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div>
                  <CardTitle className="text-[15px] font-semibold text-foreground">Noticias jurídicas</CardTitle>
                  <CardDescription className="text-[12px]">Últimas actualizaciones legales</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: "Nueva Reforma Laboral 2024", meta: "Hace 2 horas" },
                { title: "Criterio SCJN sobre contratos", meta: "Publicado ayer" },
                { title: "Actualización Código Civil", meta: "Hace 3 días" },
              ].map((item, i) => (
                <div key={i} className="p-3 border border-border rounded-lg">
                  <p className="text-[14px] font-semibold text-foreground leading-snug">{item.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{item.meta}</p>
                </div>
              ))}
              <button className="w-full text-[13px] text-primary hover:text-primary/80 flex items-center justify-center gap-1 pt-1 transition-colors">
                Ver todas las noticias <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </CardContent>
          </Card>

          {/* Próximos vencimientos */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FCE7EB] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#E11D48]" />
                </div>
                <div>
                  <CardTitle className="text-[15px] font-semibold text-foreground">Próximos vencimientos</CardTitle>
                  <CardDescription className="text-[12px]">Fechas límite importantes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-[14px] font-semibold text-foreground">Audiencia preliminar</p>
                  <p className="text-[12px] text-muted-foreground">Caso: Tech Corp</p>
                </div>
                <StatusPill status="hoy" />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-[14px] font-semibold text-foreground">Entrega de documentos</p>
                  <p className="text-[12px] text-muted-foreground">Caso: StartupXYZ</p>
                </div>
                <StatusPill status="manana" />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-[14px] font-semibold text-foreground">Mediación</p>
                  <p className="text-[12px] text-muted-foreground">Caso: Familia Rodríguez</p>
                </div>
                <StatusPill status="3dias" />
              </div>
              <button className="w-full text-[13px] text-primary hover:text-primary/80 flex items-center justify-center gap-1 pt-1 transition-colors">
                Ver calendario completo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </CardContent>
          </Card>

          {/* Avisos del despacho */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <CardTitle className="text-[15px] font-semibold text-foreground">Avisos del despacho</CardTitle>
                  <CardDescription className="text-[12px]">Comunicación interna del equipo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: "Reunión general",         meta: "Viernes 16:00 · Sala de juntas", autor: "María González" },
                { title: "Nuevo cliente asignado",  meta: "Caso corporativo — Equipo A",    autor: "Carlos Ruiz" },
                { title: "Actualización sistema",   meta: "Mantenimiento programado",        autor: "IT Despacho" },
              ].map((item, i) => (
                <div key={i} className="p-3 border border-border rounded-lg">
                  <p className="text-[14px] font-semibold text-foreground leading-snug">{item.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{item.meta}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Por: {item.autor}</p>
                </div>
              ))}
              <button className="w-full text-[13px] text-primary hover:text-primary/80 flex items-center justify-center gap-1 pt-1 transition-colors">
                Ver chat interno <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </CardContent>
          </Card>

          {/* Acuerdos del día */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-[15px] font-semibold text-foreground">Acuerdos del día</CardTitle>
                  <CardDescription className="text-[12px]">Resoluciones judiciales encontradas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">Sentencia favorable</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Juzgado Tercero Civil · EXP-2024-001</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Ana Martínez</p>
                  </div>
                  <StatusPill status="completado" />
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <p className="text-[14px] font-semibold text-foreground">Auto de admisión</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">Juzgado Séptimo Mercantil · EXP-2024-015</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Luis Hernández</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <p className="text-[14px] font-semibold text-foreground">Citatorio a audiencia</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">Juzgado Segundo Familiar · EXP-2024-008</p>
                <p className="text-[11px] text-[#25D366] mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Audiencia añadida al calendario
                </p>
              </div>
              <button className="w-full text-[13px] text-primary hover:text-primary/80 flex items-center justify-center gap-1 pt-1 transition-colors">
                Ver todos los acuerdos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Expedientes prioritarios */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Folder className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-[18px] font-semibold text-foreground">Expedientes prioritarios</CardTitle>
                <CardDescription>Casos que requieren atención inmediata</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-[#F4F5F7] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
                  <Folder className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">Demanda laboral — Tech Corp</p>
                  <p className="text-[12px] text-muted-foreground">Actualizado hace 2 horas · Prioridad alta</p>
                </div>
              </div>
              <StatusPill status="en-progreso" />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-[#F4F5F7] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8F7EE] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">Contrato comercial — StartupXYZ</p>
                  <p className="text-[12px] text-muted-foreground">Completado ayer · Cliente satisfecho</p>
                </div>
              </div>
              <StatusPill status="completado" />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-[#F4F5F7] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FCE7EB] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#E11D48]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">Divorcio — Familia Rodríguez</p>
                  <p className="text-[12px] text-[#E11D48]">Vence en 3 días · Requiere documentación</p>
                </div>
              </div>
              <StatusPill status="urgente" />
            </div>

            <button className="w-full text-[13px] text-muted-foreground hover:text-foreground border border-border rounded-lg py-2.5 flex items-center justify-center gap-1 hover:bg-[#F4F5F7] transition-colors mt-1">
              Ver todos los expedientes <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-[18px] font-semibold text-foreground">Acciones rápidas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button className="h-auto py-3.5 flex-col gap-2 bg-primary text-white hover:bg-primary/90 font-medium rounded-lg">
                <Plus className="w-5 h-5" />
                <span className="text-[13px]">Nuevo expediente</span>
              </Button>
              <Button variant="outline" className="h-auto py-3.5 flex-col gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-[#F4F5F7] rounded-lg">
                <FileText className="w-5 h-5" />
                <span className="text-[13px]">Crear documento</span>
              </Button>
              <Button variant="outline" className="h-auto py-3.5 flex-col gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-[#F4F5F7] rounded-lg">
                <Calendar className="w-5 h-5" />
                <span className="text-[13px]">Programar cita</span>
              </Button>
              <Button variant="outline" className="h-auto py-3.5 flex-col gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-[#F4F5F7] rounded-lg">
                <Users className="w-5 h-5" />
                <span className="text-[13px]">Agregar cliente</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ── Modal: WhatsApp ──────────────────────────────────────────────────── */}
      <Dialog open={whatsappModal.open} onOpenChange={open => { if (!open) closeWhatsappModal() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WhatsAppIcon />
              {whatsappModal.mode === "grupo" ? "Enviar a grupo de WhatsApp" : "Enviar por WhatsApp"}
            </DialogTitle>
            <DialogDescription>Confirma el envío del siguiente evento:</DialogDescription>
          </DialogHeader>
          {whatsappModal.event && (
            <div className="p-4 border border-border rounded-lg bg-[#F4F5F7] space-y-1.5">
              <p className="text-[14px] font-semibold text-foreground">{whatsappModal.event.title}</p>
              <p className="text-[13px] text-muted-foreground">
                <span className="text-[#9CA3AF]">Fecha/hora:</span> {whatsappModal.event.datetime}
              </p>
              <p className="text-[13px] text-muted-foreground">
                <span className="text-[#9CA3AF]">Lugar:</span> {whatsappModal.event.location}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeWhatsappModal}>Cancelar</Button>
            <Button
              className="gap-2 text-white"
              style={{ backgroundColor: "#25D366" }}
              onClick={closeWhatsappModal}
            >
              <WhatsAppIcon /> Confirmar envío
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Nuevo aviso ───────────────────────────────────────────────── */}
      <Dialog
        open={avisoModalOpen}
        onOpenChange={open => {
          if (!open) setNewAviso({ titulo: "", descripcion: "", addToCalendar: false, notifyWhatsApp: false })
          setAvisoModalOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo aviso interno</DialogTitle>
            <DialogDescription>Completa los campos y publica el aviso para el equipo.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="aviso-titulo">Título</Label>
              <Input
                id="aviso-titulo"
                placeholder="Título del aviso"
                value={newAviso.titulo}
                onChange={e => setNewAviso(prev => ({ ...prev, titulo: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="aviso-desc">Descripción</Label>
              <Textarea
                id="aviso-desc"
                placeholder="Describe el aviso..."
                className="resize-none"
                rows={3}
                value={newAviso.descripcion}
                onChange={e => setNewAviso(prev => ({ ...prev, descripcion: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-cal" className="cursor-pointer select-none flex items-center gap-2 text-[13px]">
                  <Calendar className="w-4 h-4 text-muted-foreground" /> Agregar al calendario
                </Label>
                <Switch
                  id="modal-cal"
                  checked={newAviso.addToCalendar}
                  onCheckedChange={v => setNewAviso(prev => ({ ...prev, addToCalendar: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-wa" className="cursor-pointer select-none flex items-center gap-2 text-[13px]">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" /> Notificar por WhatsApp
                </Label>
                <Switch
                  id="modal-wa"
                  checked={newAviso.notifyWhatsApp}
                  onCheckedChange={v => setNewAviso(prev => ({ ...prev, notifyWhatsApp: v }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvisoModalOpen(false)}>Cancelar</Button>
            <Button onClick={handlePublicarAviso} disabled={!newAviso.titulo.trim()}>Publicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
