"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Smile, Paperclip, Send, Hash, ChevronDown, MessageSquare, Users } from "lucide-react"

const conversations = [
  {
    id: 1,
    type: "dm",
    name: "Lic. García Morales",
    initials: "GM",
    preview: "¿Ya revisaste el expediente 2847?",
    time: "10:32",
    unread: 3,
    online: true,
  },
  {
    id: 2,
    type: "group",
    name: "Equipo Litigios",
    initials: "EL",
    preview: "Ana: La audiencia es el lunes a las 10am",
    time: "09:15",
    unread: 7,
    online: false,
  },
  {
    id: 3,
    type: "dm",
    name: "Dra. López Vega",
    initials: "LV",
    preview: "Gracias, lo reviso hoy mismo",
    time: "Ayer",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    type: "group",
    name: "Casos Corporativos",
    initials: "CC",
    preview: "Carlos: El contrato ya está listo para firma",
    time: "Lun",
    unread: 2,
    online: false,
  },
  {
    id: 5,
    type: "dm",
    name: "Lic. Ramírez Torres",
    initials: "RT",
    preview: "Te mando el informe en un momento",
    time: "Lun",
    unread: 0,
    online: true,
  },
]

type ChatMessage = { id: number; sender: string; initials: string; content: string; time: string; sent: boolean }

const INITIAL_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: "Lic. García Morales", initials: "GM", content: "Buenos días, ¿ya tuviste oportunidad de revisar el expediente 2847-B?", time: "10:15", sent: false },
    { id: 2, sender: "Yo", initials: "YO", content: "Sí, lo estuve revisando ayer. Hay algunos puntos que necesitamos discutir.", time: "10:18", sent: true },
    { id: 3, sender: "Lic. García Morales", initials: "GM", content: "Perfecto. ¿Puedes enviarme un resumen de los hallazgos principales?", time: "10:22", sent: false },
    { id: 4, sender: "Yo", initials: "YO", content: "Claro, te lo preparo ahora. Hay una inconsistencia en las fechas del contrato original que puede ser relevante para el caso.", time: "10:25", sent: true },
    { id: 5, sender: "Lic. García Morales", initials: "GM", content: "¿Ya revisaste el expediente 2847?", time: "10:32", sent: false },
  ],
  2: [
    { id: 1, sender: "Ana Martínez", initials: "AM", content: "Equipo, les comento que el juicio del caso Hernández fue reprogramado.", time: "08:50", sent: false },
    { id: 2, sender: "Carlos Reyes", initials: "CR", content: "¿Para qué fecha quedó?", time: "09:00", sent: false },
    { id: 3, sender: "Yo", initials: "YO", content: "Necesitamos actualizar el calendario y notificar al cliente.", time: "09:10", sent: true },
    { id: 4, sender: "Ana Martínez", initials: "AM", content: "La audiencia es el lunes a las 10am en el Juzgado 4to Civil.", time: "09:15", sent: false },
  ],
  3: [
    { id: 1, sender: "Yo", initials: "YO", content: "Dra. López, le envío el borrador del amparo para su revisión.", time: "Ayer 15:30", sent: true },
    { id: 2, sender: "Dra. López Vega", initials: "LV", content: "Gracias, lo reviso hoy mismo", time: "Ayer 16:45", sent: false },
  ],
  4: [
    { id: 1, sender: "Carlos Reyes", initials: "CR", content: "Equipo, el cliente aprobó las modificaciones al contrato de fusión.", time: "Lun 14:20", sent: false },
    { id: 2, sender: "Yo", initials: "YO", content: "Excelente noticia. ¿Procedemos con la firma esta semana?", time: "Lun 14:35", sent: true },
    { id: 3, sender: "Carlos Reyes", initials: "CR", content: "El contrato ya está listo para firma, coordinemos con el cliente.", time: "Lun 15:00", sent: false },
  ],
  5: [
    { id: 1, sender: "Lic. Ramírez Torres", initials: "RT", content: "Hola, ¿necesitas el informe de actividades de abril?", time: "Lun 11:00", sent: false },
    { id: 2, sender: "Yo", initials: "YO", content: "Sí, por favor. Para esta tarde si es posible.", time: "Lun 11:15", sent: true },
    { id: 3, sender: "Lic. Ramírez Torres", initials: "RT", content: "Te mando el informe en un momento", time: "Lun 11:20", sent: false },
  ],
}

export function ChatInterno() {
  const [activeId, setActiveId] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState(INITIAL_MESSAGES)
  const [newConvOpen, setNewConvOpen] = useState(false)
  const [newConvType, setNewConvType] = useState<"dm" | "group" | null>(null)
  const [newConvName, setNewConvName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.id === activeId)!
  const messages = allMessages[activeId] ?? []
  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const dms = filtered.filter(c => c.type === "dm")
  const groups = filtered.filter(c => c.type === "group")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!message.trim()) return
    const now = new Date()
    const time = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "Yo",
      initials: "YO",
      content: message.trim(),
      time,
      sent: true,
    }
    setAllMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }))
    setMessage("")
  }

  return (
    <div className="flex h-full bg-background">
      {/* ── Left panel ── */}
      <div className="w-80 border-r border-border flex flex-col shrink-0 bg-card">
        {/* Header */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Mensajes</h2>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-border"
              onClick={() => { setNewConvType(null); setNewConvName(""); setNewConvOpen(true) }}
              title="Nueva conversación"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8 h-8 text-sm bg-background"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            {/* Direct messages */}
            {dms.length > 0 && (
              <div>
                <button className="flex items-center gap-1 px-2 mb-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
                  <ChevronDown className="w-3 h-3" />
                  MENSAJES DIRECTOS
                </button>
                <div className="space-y-0.5">
                  {dms.map(conv => (
                    <ConvItem
                      key={conv.id}
                      conv={conv}
                      active={activeId === conv.id}
                      onClick={() => setActiveId(conv.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Channels */}
            {groups.length > 0 && (
              <div>
                <button className="flex items-center gap-1 px-2 mb-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
                  <ChevronDown className="w-3 h-3" />
                  CANALES
                </button>
                <div className="space-y-0.5">
                  {groups.map(conv => (
                    <ConvItem
                      key={conv.id}
                      conv={conv}
                      active={activeId === conv.id}
                      onClick={() => setActiveId(conv.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 bg-card shrink-0">
          <div className="relative">
            <Avatar initials={activeConv.initials} isGroup={activeConv.type === "group"} size="md" />
            {activeConv.type === "dm" && (
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${activeConv.online ? "bg-green-500" : "bg-gray-400"}`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground leading-tight">{activeConv.name}</h3>
            <p className="text-xs text-muted-foreground">
              {activeConv.type === "dm"
                ? activeConv.online ? "En línea" : "Desconectado"
                : "4 miembros · 2 en línea"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-5 py-4">
          {/* Date separator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2">Hoy</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.sent ? "flex-row-reverse" : "flex-row"}`}
              >
                {!msg.sent && (
                  <Avatar initials={msg.initials} isGroup={false} size="sm" />
                )}
                <div className={`flex flex-col max-w-[65%] ${msg.sent ? "items-end" : "items-start"}`}>
                  {!msg.sent && activeConv.type === "group" && (
                    <span className="text-xs text-muted-foreground mb-1 px-1 font-medium">{msg.sender}</span>
                  )}
                  <div
                    className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.sent
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                        : "bg-muted text-foreground rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input bar */}
        <div className="px-5 py-4 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-2 bg-background rounded-xl border border-border px-2 py-1.5">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <input
              type="text"
              placeholder={`Mensaje ${activeConv.type === "group" ? `en ${activeConv.name}` : `a ${activeConv.name}`}...`}
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground min-w-0"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            >
              <Smile className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── New conversation modal ── */}
      <Dialog open={newConvOpen} onOpenChange={setNewConvOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Nueva conversación
            </DialogTitle>
          </DialogHeader>

          {!newConvType ? (
            <div className="flex flex-col gap-3 py-2">
              <button
                onClick={() => setNewConvType("dm")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-muted transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Mensaje directo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Conversación privada con un miembro del despacho</p>
                </div>
              </button>
              <button
                onClick={() => setNewConvType("group")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-muted transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#EEF0FF] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Canal grupal</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Canal temático para un equipo o caso</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              <button
                onClick={() => setNewConvType(null)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground -mt-1 w-fit"
              >
                ← Volver
              </button>
              <div className="space-y-1.5">
                <Label htmlFor="new-conv-name">
                  {newConvType === "dm" ? "Nombre del contacto" : "Nombre del canal"}
                </Label>
                <Input
                  id="new-conv-name"
                  placeholder={newConvType === "dm" ? "Ej. Lic. Pérez Morales" : "Ej. Caso García — Equipo"}
                  value={newConvName}
                  onChange={e => setNewConvName(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === "Enter" && newConvName.trim() && setNewConvOpen(false)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewConvOpen(false)}>Cancelar</Button>
                <Button
                  disabled={!newConvName.trim()}
                  onClick={() => setNewConvOpen(false)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {newConvType === "dm" ? "Iniciar conversación" : "Crear canal"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ── Sub-components ── */

type ConvType = typeof conversations[number]

function ConvItem({ conv, active, onClick }: { conv: ConvType; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-left transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      }`}
    >
      <div className="relative shrink-0">
        <Avatar initials={conv.initials} isGroup={conv.type === "group"} size="md" active={active} />
        {conv.type === "dm" && (
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${
              active ? "border-primary" : "border-card"
            } ${conv.online ? "bg-green-500" : "bg-gray-400"}`}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-sm font-medium truncate ${active ? "text-primary-foreground" : "text-foreground"}`}>
            {conv.name}
          </span>
          <span className={`text-xs shrink-0 ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {conv.time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className={`text-xs truncate ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
            {conv.preview}
          </p>
          {conv.unread > 0 && (
            <Badge className="ml-1 h-4 min-w-4 flex items-center justify-center text-xs px-1 bg-destructive text-destructive-foreground shrink-0 rounded-full">
              {conv.unread}
            </Badge>
          )}
        </div>
      </div>
    </button>
  )
}

function Avatar({
  initials,
  isGroup,
  size,
  active = false,
}: {
  initials: string
  isGroup: boolean
  size: "sm" | "md"
  active?: boolean
}) {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm"
  const bg = active
    ? "bg-primary-foreground text-primary"
    : "bg-primary text-primary-foreground"

  return (
    <div className={`${dim} ${bg} rounded-full flex items-center justify-center font-semibold shrink-0`}>
      {isGroup ? <Hash className="w-3.5 h-3.5" /> : initials}
    </div>
  )
}
