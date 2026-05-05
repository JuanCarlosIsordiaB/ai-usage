'use client'

import { useState } from "react"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Bell,
  ChevronRight,
  Trash2,
} from "lucide-react"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"

// ── WhatsApp icon ─────────────────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.116 1.528 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.722.97.994-3.624-.235-.372A9.818 9.818 0 1112 21.818z" />
  </svg>
)

// ── Types ─────────────────────────────────────────────────────────────────────
type EventType = "audiencia" | "reunion" | "vencimiento" | "firma" | "otro"

type Evento = {
  id: string
  title: string
  date: Date
  time: string
  location: string
  type: EventType
  expediente?: string
  description?: string
}

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; dot: string; bg: string; text: string }> = {
  audiencia:   { label: "Audiencia",   dot: "#E11D48", bg: "#FCE7EB", text: "#E11D48" },
  reunion:     { label: "Reunión",     dot: "#5B5BFE", bg: "#EEF0FF", text: "#5B5BFE" },
  vencimiento: { label: "Vencimiento", dot: "#F59E0B", bg: "#FEF3C7", text: "#F59E0B" },
  firma:       { label: "Firma",       dot: "#16A34A", bg: "#E8F7EE", text: "#16A34A" },
  otro:        { label: "Otro",        dot: "#6B7280", bg: "#F4F5F7", text: "#6B7280" },
}

function TypePill({ type }: { type: EventType }) {
  const c = EVENT_TYPE_CONFIG[type]
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

// ── Seed data ─────────────────────────────────────────────────────────────────
const today = new Date()
const d = (offset: number) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() + offset)
  return dt
}

const INITIAL_EVENTS: Evento[] = [
  { id: "e1", title: "Reunión con cliente", date: d(0), time: "14:00", location: "Sala de juntas A", type: "reunion", expediente: "EXP-2024-001" },
  { id: "e2", title: "Junta de socios", date: d(1), time: "10:00", location: "Despacho", type: "reunion" },
  { id: "e3", title: "Audiencia virtual", date: d(4), time: "09:00", location: "Juzgado Quinto", type: "audiencia", expediente: "EXP-2024-008" },
  { id: "e4", title: "Firma de contrato", date: d(7), time: "11:00", location: "StartupXYZ", type: "firma", expediente: "EXP-2024-002" },
  { id: "e5", title: "Vencimiento — Mediación", date: d(3), time: "23:59", location: "Juzgado Familiar", type: "vencimiento", expediente: "EXP-2024-015" },
  { id: "e6", title: "Audiencia EXP-2024-008", date: d(10), time: "10:30", location: "Juzgado Segundo Familiar", type: "audiencia", expediente: "EXP-2024-008" },
  { id: "e7", title: "Entrega de documentos", date: d(1), time: "17:00", location: "Juzgado Séptimo Mercantil", type: "vencimiento", expediente: "EXP-2024-015" },
]

// ── Component ─────────────────────────────────────────────────────────────────
export function Calendario() {
  const [eventos, setEventos] = useState<Evento[]>(INITIAL_EVENTS)
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const [modalOpen, setModalOpen] = useState(false)
  const [newEvento, setNewEvento] = useState({
    title: "",
    time: "09:00",
    location: "",
    type: "reunion" as EventType,
    expediente: "",
    description: "",
  })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const eventsOnDate = (date: Date) => eventos.filter(e => isSameDay(e.date, date))
  const selectedEvents = eventsOnDate(selectedDate)

  const upcomingEvents = [...eventos]
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  function handleAddEvento() {
    if (!newEvento.title.trim()) return
    const evento: Evento = {
      id: `ev-${Date.now()}`,
      title: newEvento.title.trim(),
      date: selectedDate,
      time: newEvento.time,
      location: newEvento.location.trim(),
      type: newEvento.type,
      expediente: newEvento.expediente.trim() || undefined,
      description: newEvento.description.trim() || undefined,
    }
    setEventos(prev => [...prev, evento])
    setNewEvento({ title: "", time: "09:00", location: "", type: "reunion", expediente: "", description: "" })
    setModalOpen(false)
    toast.success("Evento agregado al calendario")
  }

  function handleDelete(id: string) {
    setEventos(prev => prev.filter(e => e.id !== id))
    setDeleteConfirm(null)
    toast.success("Evento eliminado")
  }

  // Build modifiers: dates that have events get dot indicators
  const eventDates = eventos.map(e => e.date)

  return (
    <div className="flex flex-col h-full bg-background">

      {/* ── Top bar ───────────────────────────────────────────────────────────── */}
      <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
            <CalendarIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-foreground leading-none">Calendario</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">Agenda y citas programadas</p>
          </div>
        </div>
        <Button
          className="bg-primary text-white hover:bg-primary/90 gap-1.5 h-9 px-4 text-[13px] font-medium"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> Nuevo evento
        </Button>
      </header>

      {/* ── Main layout ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex gap-0">

        {/* Left: calendar + upcoming */}
        <div className="w-80 border-r border-border flex flex-col overflow-y-auto shrink-0 p-4 gap-4">

          {/* Calendar picker */}
          <Card className="border-border shadow-none">
            <CardContent className="p-3 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={es}
                modifiers={{ hasEvent: eventDates }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: 700,
                    textDecoration: "underline",
                    textDecorationColor: "#5B5BFE",
                    textUnderlineOffset: "3px",
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="border-border shadow-none">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-[13px] font-semibold text-foreground">Tipos de evento</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 flex flex-col gap-1.5">
              {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                  <span className="text-[12px] text-muted-foreground">{cfg.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming events */}
          <Card className="border-border shadow-none">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-[13px] font-semibold text-foreground">Próximos eventos</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 flex flex-col gap-2">
              {upcomingEvents.length === 0 ? (
                <p className="text-[12px] text-muted-foreground">Sin eventos próximos</p>
              ) : upcomingEvents.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => setSelectedDate(ev.date)}
                  className="flex items-start gap-2 text-left hover:bg-[#F4F5F7] rounded-lg p-1.5 -mx-1.5 transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: EVENT_TYPE_CONFIG[ev.type].dot }} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-foreground truncate">{ev.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {format(ev.date, "d MMM", { locale: es })} · {ev.time}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: day events panel */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[20px] font-semibold text-foreground capitalize">
                {format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
              </h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {selectedEvents.length === 0
                  ? "Sin eventos para este día"
                  : `${selectedEvents.length} evento${selectedEvents.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-1.5 h-9 px-3 text-[13px] border-border"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-4 h-4" /> Agregar
            </Button>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF0FF] flex items-center justify-center mb-4">
                <CalendarIcon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-[15px] font-medium text-foreground">Sin eventos</p>
              <p className="text-[13px] text-muted-foreground mt-1 max-w-xs">
                No hay nada programado para este día. Haz clic en "Agregar" para crear un evento.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {selectedEvents
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(ev => (
                  <Card key={ev.id} className="border-border shadow-none hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="w-1 self-stretch rounded-full shrink-0"
                            style={{ backgroundColor: EVENT_TYPE_CONFIG[ev.type].dot }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[15px] font-semibold text-foreground">{ev.title}</p>
                              <TypePill type={ev.type} />
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                <Clock className="w-3.5 h-3.5 shrink-0" /> {ev.time}
                              </span>
                              {ev.location && (
                                <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {ev.location}
                                </span>
                              )}
                              {ev.expediente && (
                                <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                  <Users className="w-3.5 h-3.5 shrink-0" /> {ev.expediente}
                                </span>
                              )}
                            </div>

                            {ev.description && (
                              <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed">{ev.description}</p>
                            )}

                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                              <button className="flex items-center gap-1.5 text-[12px] text-[#25D366] font-medium hover:underline">
                                <WhatsAppIcon /> Notificar por WhatsApp
                              </button>
                              <span className="text-border">·</span>
                              <button className="flex items-center gap-1.5 text-[12px] text-primary font-medium hover:underline">
                                <Bell className="w-3.5 h-3.5" /> Recordatorio
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setDeleteConfirm(ev.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-[#E11D48] hover:bg-[#FCE7EB] transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(([key, cfg]) => {
              const count = eventos.filter(e => e.type === key).length
              return (
                <div key={key} className="p-3 border border-border rounded-lg flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                  <div>
                    <p className="text-[18px] font-semibold text-foreground leading-none">{count}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{cfg.label}{count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Modal: Nuevo evento ────────────────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={open => { setModalOpen(open); if (!open) setNewEvento({ title: "", time: "09:00", location: "", type: "reunion", expediente: "", description: "" }) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo evento</DialogTitle>
            <DialogDescription>
              Agregando para el {format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-title">Título *</Label>
              <Input
                id="ev-title"
                placeholder="Ej. Audiencia inicial"
                value={newEvento.title}
                onChange={e => setNewEvento(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-time">Hora</Label>
                <Input
                  id="ev-time"
                  type="time"
                  value={newEvento.time}
                  onChange={e => setNewEvento(p => ({ ...p, time: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-type">Tipo</Label>
                <select
                  id="ev-type"
                  value={newEvento.type}
                  onChange={e => setNewEvento(p => ({ ...p, type: e.target.value as EventType }))}
                  className="h-9 rounded-md border border-input bg-background px-3 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-location">Lugar / Sala</Label>
              <Input
                id="ev-location"
                placeholder="Ej. Juzgado Quinto"
                value={newEvento.location}
                onChange={e => setNewEvento(p => ({ ...p, location: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-exp">Expediente relacionado</Label>
              <Input
                id="ev-exp"
                placeholder="Ej. EXP-2024-001"
                value={newEvento.expediente}
                onChange={e => setNewEvento(p => ({ ...p, expediente: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-desc">Notas</Label>
              <Textarea
                id="ev-desc"
                placeholder="Descripción o notas adicionales..."
                className="resize-none"
                rows={2}
                value={newEvento.description}
                onChange={e => setNewEvento(p => ({ ...p, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddEvento} disabled={!newEvento.title.trim()}>
              Agregar evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Confirmar eliminación ───────────────────────────────────────── */}
      <Dialog open={!!deleteConfirm} onOpenChange={open => { if (!open) setDeleteConfirm(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar evento</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button
              className="bg-[#E11D48] text-white hover:bg-[#be123c]"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
