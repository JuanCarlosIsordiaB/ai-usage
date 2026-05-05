'use client'

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// ── Icons ─────────────────────────────────────────────────────────────────────

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const NewsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const ScaleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 10h8M8 14h6M7 21l3-3h7a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.116 1.528 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.722.97.994-3.624-.235-.372A9.818 9.818 0 1112 21.818z" />
  </svg>
)

// ── Types ─────────────────────────────────────────────────────────────────────

type CalendarEvent = {
  id: string
  title: string
  datetime: string
  location: string
  borderColor: string
  bgColor: string
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

// ── Initial data ──────────────────────────────────────────────────────────────

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Reunión con Cliente",  datetime: "Hoy 14:00",     location: "Caso TechCorp",  borderColor: "border-primary/20",   bgColor: "bg-primary/5" },
  { id: "2", title: "Junta de Socios",      datetime: "Mañana 10:00",  location: "Despacho",       borderColor: "border-accent/20",    bgColor: "bg-accent/5" },
  { id: "3", title: "Audiencia Virtual",    datetime: "Viernes 09:00", location: "Juzgado Quinto", borderColor: "border-secondary/20", bgColor: "bg-secondary/5" },
  { id: "4", title: "Firma de Contrato",    datetime: "Lunes 11:00",   location: "StartupXYZ",     borderColor: "border-border",       bgColor: "bg-background" },
]

const INITIAL_AVISOS: Aviso[] = [
  {
    id: "a1",
    titulo: "Reunión General de Despacho",
    descripcion: "Revisión de casos activos y asignación de nuevas responsabilidades para el trimestre.",
    autor: "María González",
    fecha: "04 May 2026",
    addToCalendar: false,
    notifyWhatsApp: false,
  },
  {
    id: "a2",
    titulo: "Actualización de Tarifas",
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
  const [audienciaCreated, setAudienciaCreated] = useState(false)
  const [whatsappModal, setWhatsappModal] = useState<{
    open: boolean
    mode: "grupo" | "directo" | null
    event: CalendarEvent | null
  }>({ open: false, mode: null, event: null })
  const [avisos, setAvisos] = useState<Aviso[]>(INITIAL_AVISOS)
  const [avisoModalOpen, setAvisoModalOpen] = useState(false)
  const [newAviso, setNewAviso] = useState({ titulo: "", descripcion: "", addToCalendar: false, notifyWhatsApp: false })

  function openWhatsappModal(event: CalendarEvent, mode: "grupo" | "directo") {
    setWhatsappModal({ open: true, mode, event })
  }

  function closeWhatsappModal() {
    setWhatsappModal({ open: false, mode: null, event: null })
  }

  function handleWhatsappConfirm() {
    closeWhatsappModal()
  }

  function handleCrearAudienciaDesdeAcuerdo() {
    if (audienciaCreated) return
    const newEvent: CalendarEvent = {
      id: `audiencia-${Date.now()}`,
      title: "Audiencia — EXP-2024-008",
      datetime: "Por definir",
      location: "Juzgado Segundo Familiar",
      borderColor: "border-primary/20",
      bgColor: "bg-primary/5",
    }
    setCalendarEvents(prev => [...prev, newEvent])
    setAudienciaCreated(true)
    toast.success("Audiencia agregada al calendario automáticamente")
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
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Jurídico</h1>
            <p className="text-card-foreground mt-1">
              Bienvenido de vuelta, <span className="font-semibold text-foreground">María González</span>
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md gap-2">
            <ChatIcon /> CHAT
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">

        {/* ── Calendario ─────────────────────────────────────────────────────── */}
        <Card className="border-border shadow-md hover:shadow-lg transition-shadow bg-card mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-card-foreground flex items-center gap-3 text-xl">
              <div className="p-3 bg-primary rounded-lg">
                <CalendarIcon />
              </div>
              Calendario
            </CardTitle>
            <CardDescription className="text-card-foreground/70">Agenda y citas programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {calendarEvents.map(event => (
                <div key={event.id} className={`p-4 border ${event.borderColor} rounded-lg ${event.bgColor} flex flex-col gap-2`}>
                  <p className="font-semibold text-foreground text-sm">{event.title}</p>
                  <p className="text-xs text-foreground/70">{event.datetime} — {event.location}</p>
                  <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-start gap-2 text-xs h-7 px-2 hover:bg-[#25D366]/10 text-[#25D366] font-medium"
                      onClick={() => openWhatsappModal(event, "grupo")}
                    >
                      <WhatsAppIcon /> Enviar a grupo
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-start gap-2 text-xs h-7 px-2 hover:bg-[#25D366]/10 text-[#25D366] font-medium"
                      onClick={() => openWhatsappModal(event, "directo")}
                    >
                      <WhatsAppIcon /> Enviar por WhatsApp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 mt-4"
            >
              Abrir calendario completo →
            </Button>
          </CardContent>
        </Card>

        {/* ── Avisos Internos ─────────────────────────────────────────────────── */}
        <Card className="border-border shadow-md hover:shadow-lg transition-shadow bg-card mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground flex items-center gap-3 text-xl">
                  <div className="p-3 bg-accent rounded-lg">
                    <BellIcon />
                  </div>
                  Avisos Internos
                </CardTitle>
                <CardDescription className="text-card-foreground/70 mt-1">
                  Comunicados y avisos del despacho
                </CardDescription>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                onClick={() => setAvisoModalOpen(true)}
              >
                <PlusIcon /> Nuevo Aviso
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {avisos.map(aviso => (
                <div key={aviso.id} className="p-4 border border-border rounded-lg bg-background flex flex-col gap-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{aviso.titulo}</p>
                    <p className="text-xs text-foreground/70 mt-1 leading-relaxed">{aviso.descripcion}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Por: {aviso.autor}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{aviso.fecha}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`cal-${aviso.id}`} className="text-xs cursor-pointer select-none">
                        📅 Agregar al calendario
                      </Label>
                      <Switch
                        id={`cal-${aviso.id}`}
                        checked={aviso.addToCalendar}
                        onCheckedChange={() => toggleAvisoCalendar(aviso.id)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`wa-${aviso.id}`} className="text-xs cursor-pointer select-none">
                        📲 Notificar por WhatsApp
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

        {/* ── Grid de secciones ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* Expedientes */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderIcon />
                </div>
                Expedientes
              </CardTitle>
              <CardDescription className="text-card-foreground/70">Gestión de expedientes activos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <p className="font-semibold text-sm text-foreground">EXP-2024-001</p>
                  <p className="text-xs text-foreground/70">Demanda Laboral</p>
                </div>
                <Badge className="bg-secondary text-secondary-foreground border-secondary/20">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <p className="font-semibold text-sm text-foreground">EXP-2024-002</p>
                  <p className="text-xs text-foreground/70">Contrato Comercial</p>
                </div>
                <Badge className="bg-accent text-accent-foreground border-accent/20">Revisión</Badge>
              </div>
              <Button variant="ghost" className="w-full justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                Ver todos los expedientes →
              </Button>
            </CardContent>
          </Card>

          {/* Noticias Jurídicas */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <NewsIcon />
                </div>
                Noticias Jurídicas
              </CardTitle>
              <CardDescription className="text-card-foreground/70">Últimas actualizaciones legales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-border rounded-lg bg-background">
                <p className="font-semibold text-sm text-foreground">Nueva Reforma Laboral 2024</p>
                <p className="text-xs text-foreground/70">Publicado hace 2 horas</p>
              </div>
              <div className="p-3 border border-border rounded-lg bg-background">
                <p className="font-semibold text-sm text-foreground">Criterio SCJN sobre Contratos</p>
                <p className="text-xs text-foreground/70">Publicado ayer</p>
              </div>
              <div className="p-3 border border-border rounded-lg bg-background">
                <p className="font-semibold text-sm text-foreground">Actualización Código Civil</p>
                <p className="text-xs text-foreground/70">Hace 3 días</p>
              </div>
              <Button variant="ghost" className="w-full justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                Ver todas las noticias →
              </Button>
            </CardContent>
          </Card>

          {/* Próximos Vencimientos */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <ClockIcon />
                </div>
                Próximos Vencimientos
              </CardTitle>
              <CardDescription className="text-card-foreground/70">Fechas límite importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <p className="font-semibold text-sm text-foreground">Audiencia Preliminar</p>
                  <p className="text-xs text-muted-foreground">Caso: Tech Corp</p>
                </div>
                <Badge className="bg-destructive text-destructive-foreground">Hoy</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-accent/20 rounded-lg bg-accent/5">
                <div>
                  <p className="font-semibold text-sm text-foreground">Entrega de Documentos</p>
                  <p className="text-xs text-muted-foreground">Caso: StartupXYZ</p>
                </div>
                <Badge className="bg-accent text-accent-foreground">Mañana</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <p className="font-semibold text-sm text-foreground">Mediación</p>
                  <p className="text-xs text-foreground/70">Caso: Familia Rodríguez</p>
                </div>
                <Badge className="bg-muted text-muted-foreground">3 días</Badge>
              </div>
              <Button variant="ghost" className="w-full justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                Ver calendario completo →
              </Button>
            </CardContent>
          </Card>

          {/* Avisos del Despacho */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <UsersIcon />
                </div>
                Avisos del Despacho
              </CardTitle>
              <CardDescription className="text-card-foreground/70">Comunicación interna del equipo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-accent/20 rounded-lg bg-accent/5">
                <p className="font-semibold text-sm text-foreground">Reunión General</p>
                <p className="text-xs text-muted-foreground">Viernes 16:00 - Sala de juntas</p>
                <p className="text-xs text-foreground/70 mt-1">Por: María González</p>
              </div>
              <div className="p-3 border border-secondary/20 rounded-lg bg-secondary/5">
                <p className="font-semibold text-sm text-secondary-foreground">Nuevo Cliente Asignado</p>
                <p className="text-xs text-secondary-foreground/80">Caso corporativo - Equipo A</p>
                <p className="text-xs text-foreground/70 mt-1">Por: Carlos Ruiz</p>
              </div>
              <div className="p-3 border border-primary/20 rounded-lg bg-primary/5">
                <p className="font-semibold text-sm text-primary">Actualización Sistema</p>
                <p className="text-xs text-primary/80">Mantenimiento programado</p>
                <p className="text-xs text-foreground/70 mt-1">Por: IT Despacho</p>
              </div>
              <Button variant="ghost" className="w-full justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                Ver chat interno →
              </Button>
            </CardContent>
          </Card>

          {/* Acuerdos del Día */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ScaleIcon />
                </div>
                Acuerdos del Día
              </CardTitle>
              <CardDescription className="text-card-foreground/70">Resoluciones judiciales encontradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-secondary/20 rounded-lg bg-secondary/5">
                <p className="font-semibold text-sm text-secondary-foreground">Sentencia Favorable</p>
                <p className="text-xs text-secondary-foreground/80">Juzgado Tercero Civil - EXP-2024-001</p>
                <p className="text-xs text-foreground/70 mt-1">Revisado por: Ana Martínez</p>
              </div>
              <div className="p-3 border border-accent/20 rounded-lg bg-accent/5">
                <p className="font-semibold text-sm text-accent">Auto de Admisión</p>
                <p className="text-xs text-accent/80">Juzgado Séptimo Mercantil - EXP-2024-015</p>
                <p className="text-xs text-foreground/70 mt-1">Revisado por: Luis Hernández</p>
              </div>
              <div className="p-3 border border-primary/20 rounded-lg bg-primary/5">
                <p className="font-semibold text-sm text-primary">Citatorio a Audiencia</p>
                <p className="text-xs text-primary/80">Juzgado Segundo Familiar - EXP-2024-008</p>
                <p className="text-xs text-foreground/70 mt-1">Revisado por: Carmen López</p>
                <div className="mt-2">
                  {!audienciaCreated ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 border-primary/30 text-primary hover:bg-primary/5"
                      onClick={handleCrearAudienciaDesdeAcuerdo}
                    >
                      + Crear Audiencia en Calendario
                    </Button>
                  ) : (
                    <span className="text-xs text-[#25D366] font-medium">✓ Audiencia añadida al calendario</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                Ver todos los acuerdos →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Expedientes Prioritarios ─────────────────────────────────────────── */}
        <Card className="border-border shadow-sm bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <FolderIcon /> Expedientes Prioritarios
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Casos que requieren atención inmediata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-background/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FolderIcon />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Demanda Laboral - Tech Corp</p>
                  <p className="text-sm text-muted-foreground">Actualizado hace 2 horas • Prioridad Alta</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary-foreground border-primary/20">En Progreso</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-background/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Contrato Comercial - StartupXYZ</p>
                  <p className="text-sm text-muted-foreground">Completado ayer • Cliente satisfecho</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Completado</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5 hover:bg-destructive/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-destructive">Divorcio - Familia Rodríguez</p>
                  <p className="text-sm text-destructive/80">Vence en 3 días • Requiere documentación</p>
                </div>
              </div>
              <Badge className="bg-destructive text-destructive-foreground">Urgente</Badge>
            </div>

            <Button variant="outline" className="w-full justify-center gap-2 border-border text-muted-foreground hover:bg-muted bg-transparent">
              Ver todos los expedientes →
            </Button>
          </CardContent>
        </Card>

        {/* ── Acciones Rápidas ─────────────────────────────────────────────────── */}
        <Card className="border-border shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusIcon /> Nuevo Expediente
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-border text-muted-foreground hover:bg-muted bg-transparent">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              Crear Documento
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-border text-muted-foreground hover:bg-muted bg-transparent">
              <CalendarIcon /> Programar Cita
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-border text-muted-foreground hover:bg-muted bg-transparent">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm0 0V9a2 2 0 002-2h2a2 2 0 002 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Agregar Cliente
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Modal: Confirmación WhatsApp ─────────────────────────────────────── */}
      <Dialog
        open={whatsappModal.open}
        onOpenChange={open => { if (!open) closeWhatsappModal() }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WhatsAppIcon />
              {whatsappModal.mode === "grupo" ? "Enviar a grupo de WhatsApp" : "Enviar por WhatsApp"}
            </DialogTitle>
            <DialogDescription>
              Confirma el envío del siguiente evento:
            </DialogDescription>
          </DialogHeader>
          {whatsappModal.event && (
            <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-1.5">
              <p className="font-semibold text-foreground">{whatsappModal.event.title}</p>
              <p className="text-sm text-foreground/80">
                <span className="text-muted-foreground">Fecha/Hora:</span> {whatsappModal.event.datetime}
              </p>
              <p className="text-sm text-foreground/80">
                <span className="text-muted-foreground">Lugar:</span> {whatsappModal.event.location}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeWhatsappModal}>
              Cancelar
            </Button>
            <Button
              className="gap-2 text-white"
              style={{ backgroundColor: "#25D366" }}
              onClick={handleWhatsappConfirm}
            >
              <WhatsAppIcon /> Confirmar envío
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Nuevo Aviso ───────────────────────────────────────────────── */}
      <Dialog
        open={avisoModalOpen}
        onOpenChange={open => {
          if (!open) setNewAviso({ titulo: "", descripcion: "", addToCalendar: false, notifyWhatsApp: false })
          setAvisoModalOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Aviso Interno</DialogTitle>
            <DialogDescription>
              Completa los campos y publica el aviso para el equipo.
            </DialogDescription>
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
                <Label htmlFor="modal-cal" className="cursor-pointer select-none">📅 Agregar al calendario</Label>
                <Switch
                  id="modal-cal"
                  checked={newAviso.addToCalendar}
                  onCheckedChange={v => setNewAviso(prev => ({ ...prev, addToCalendar: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-wa" className="cursor-pointer select-none">📲 Notificar por WhatsApp</Label>
                <Switch
                  id="modal-wa"
                  checked={newAviso.notifyWhatsApp}
                  onCheckedChange={v => setNewAviso(prev => ({ ...prev, notifyWhatsApp: v }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvisoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePublicarAviso} disabled={!newAviso.titulo.trim()}>
              Publicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
