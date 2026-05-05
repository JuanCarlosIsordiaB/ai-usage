"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, ExternalLink, Search, Calendar, Filter, CheckCheck, Check } from "lucide-react"

type NotifSource = "tribunal" | "dof"

type Notification = {
  id: string
  source: NotifSource
  title: string
  date: string
  excerpt: string
  materia: string
  read: boolean
  badgeLabel: string
  badgeColor: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "t1",
    source: "tribunal",
    title: "Resolución de amparo en materia fiscal – Expediente 234/2026",
    date: "2026-05-03",
    excerpt:
      "El Juzgado Tercero de Distrito resolvió conceder el amparo al quejoso respecto de los actos reclamados a la autoridad hacendaria, ordenando la devolución de las cantidades retenidas indebidamente.",
    materia: "Fiscal",
    read: false,
    badgeLabel: "TRIBUNAL",
    badgeColor: "bg-blue-600",
  },
  {
    id: "t2",
    source: "tribunal",
    title: "Notificación de audiencia – Juicio oral mercantil 89/2026",
    date: "2026-05-02",
    excerpt:
      "Se cita a las partes a audiencia de desahogo de pruebas para el día 12 de mayo de 2026 a las 10:00 horas en la sala de juicios orales del Tribunal Superior de Justicia.",
    materia: "Mercantil",
    read: false,
    badgeLabel: "TRIBUNAL",
    badgeColor: "bg-blue-600",
  },
  {
    id: "t3",
    source: "tribunal",
    title: "Acuerdo admisorio – Demanda laboral 1102/2026",
    date: "2026-04-30",
    excerpt:
      "Se admite a trámite la demanda presentada por el actor, emplazándose al demandado para que comparezca dentro del término de ley a manifestar lo que a su derecho convenga.",
    materia: "Laboral",
    read: true,
    badgeLabel: "TRIBUNAL",
    badgeColor: "bg-blue-600",
  },
  {
    id: "t4",
    source: "tribunal",
    title: "Sentencia definitiva – Controversia familiar 456/2025",
    date: "2026-04-28",
    excerpt:
      "Se dicta sentencia definitiva en la que se resuelve la controversia sobre guarda y custodia conforme a lo dispuesto por el Código Civil local y el interés superior del menor.",
    materia: "Familiar",
    read: false,
    badgeLabel: "TRIBUNAL",
    badgeColor: "bg-blue-600",
  },
  {
    id: "t5",
    source: "tribunal",
    title: "Auto de requerimiento – Garantía de ejecución 78/2026",
    date: "2026-04-25",
    excerpt:
      "Se requiere a la parte demandada para que en un plazo de cinco días hábiles otorgue la garantía ordenada en la resolución interlocutoria de fecha 18 de abril del presente año.",
    materia: "Civil",
    read: true,
    badgeLabel: "TRIBUNAL",
    badgeColor: "bg-blue-600",
  },
  {
    id: "d1",
    source: "dof",
    title: "Decreto por el que se reforman disposiciones del Código Fiscal de la Federación",
    date: "2026-05-04",
    excerpt:
      "Se modifican los artículos 17-H, 32-D y 69-B para fortalecer las facultades de fiscalización electrónica y el combate a la evasión fiscal mediante comprobantes digitales apócrifos.",
    materia: "Fiscal",
    read: false,
    badgeLabel: "DOF",
    badgeColor: "bg-amber-600",
  },
  {
    id: "d2",
    source: "dof",
    title: "NOM-037-STPS-2025 – Teletrabajo: condiciones de seguridad y salud",
    date: "2026-05-02",
    excerpt:
      "Establece las condiciones mínimas de seguridad, salud y ergonomía que deben observarse en los centros de trabajo bajo modalidad de teletrabajo, con vigencia a partir del 1 de junio de 2026.",
    materia: "Laboral",
    read: false,
    badgeLabel: "DOF",
    badgeColor: "bg-amber-600",
  },
  {
    id: "d3",
    source: "dof",
    title: "Acuerdo COFEPRIS – Nuevas reglas de farmacovigilancia",
    date: "2026-04-29",
    excerpt:
      "Se actualizan los lineamientos para el reporte de reacciones adversas a medicamentos, en concordancia con las directrices de la Organización Mundial de la Salud y la Farmacopea de los Estados Unidos Mexicanos.",
    materia: "Salud",
    read: true,
    badgeLabel: "DOF",
    badgeColor: "bg-amber-600",
  },
  {
    id: "d4",
    source: "dof",
    title: "Reforma a la Ley de Infraestructura de la Calidad",
    date: "2026-04-25",
    excerpt:
      "Se amplía el catálogo de organismos de certificación acreditados y se establecen nuevos plazos para la renovación de certificados de conformidad de productos regulados.",
    materia: "Mercantil",
    read: true,
    badgeLabel: "DOF",
    badgeColor: "bg-amber-600",
  },
]

const MATERIAS = ["Todas", "Fiscal", "Laboral", "Mercantil", "Familiar", "Civil", "Salud"]

export function NotificacionesJuridicas() {
  const [activeTab, setActiveTab] = useState<NotifSource>("tribunal")
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [keyword, setKeyword] = useState("")
  const [materia, setMateria] = useState("Todas")
  const [dateFilter, setDateFilter] = useState("")

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => (n.source === activeTab ? { ...n, read: true } : n)))
  }

  const unreadCount = (source: NotifSource) => notifications.filter((n) => n.source === source && !n.read).length

  const totalUnread = notifications.filter((n) => !n.read).length

  const filtered = notifications.filter((n) => {
    if (n.source !== activeTab) return false
    if (materia !== "Todas" && n.materia !== materia) return false
    if (keyword) {
      const kw = keyword.toLowerCase()
      if (!n.title.toLowerCase().includes(kw) && !n.excerpt.toLowerCase().includes(kw)) return false
    }
    if (dateFilter && !n.date.startsWith(dateFilter)) return false
    return true
  })

  const hasFilters = keyword || materia !== "Todas" || dateFilter

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-background shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-7 h-7 text-secondary" />
              {totalUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notificaciones Jurídicas</h1>
              <p className="text-sm text-muted-foreground">
                Tribunal Federal y Diario Oficial de la Federación
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4" />
            Marcar todos como leídos
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-5 border-b border-border">
          {(["tribunal", "dof"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "tribunal" ? "Notificaciones del Tribunal" : "Diario Oficial de la Federación (DOF)"}
              {unreadCount(tab) > 0 && (
                <Badge variant="destructive" className="text-[10px] h-4 px-1.5 min-w-4 rounded-full">
                  {unreadCount(tab)}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <div className="relative flex-1 min-w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por palabra clave..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={materia} onValueChange={setMateria}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Materia jurídica" />
            </SelectTrigger>
            <SelectContent>
              {MATERIAS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                setKeyword("")
                setMateria("Todas")
                setDateFilter("")
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
            <Bell className="w-8 h-8 opacity-30" />
            <p className="text-sm">No hay notificaciones que coincidan con los filtros.</p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={() => markAsRead(notification.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: () => void
}) {
  return (
    <Card
      className={`transition-all ${
        notification.read ? "opacity-60" : "border-l-4 border-l-primary shadow-sm"
      }`}
    >
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-start gap-3">
          {!notification.read && (
            <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded text-white ${notification.badgeColor}`}
              >
                {notification.badgeLabel}
              </span>
              <Badge variant="outline" className="text-xs">
                {notification.materia}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(notification.date + "T12:00:00").toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <p
              className={`font-semibold leading-snug ${
                notification.read ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {notification.title}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 ml-5">{notification.excerpt}</p>
        <div className="flex items-center gap-2 ml-5">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
            <ExternalLink className="w-3.5 h-3.5" />
            Ver más
          </Button>
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs h-7 text-muted-foreground hover:text-foreground"
              onClick={onMarkRead}
            >
              <Check className="w-3.5 h-3.5" />
              Marcar como leído
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
