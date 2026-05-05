"use client"

import { useState } from "react"
import { AlertCircle, Calendar, CheckCircle2, Clock, Filter, Plus, Folder, Bell, MoreHorizontal, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

type Urgencia = "Hoy" | "Mañana" | "Esta semana" | "Próximo mes" | "Completado"

interface Vencimiento {
  id: string
  titulo: string
  descripcion: string
  expediente: string
  cliente: string
  fecha: string
  urgencia: Urgencia
  tipo: string
  abogado: string
  completado: boolean
}

const URGENCIA_STYLES: Record<Urgencia, { bg: string; text: string; dot: string; icon: typeof AlertCircle }> = {
  Hoy:          { bg: "#FCE7EB", text: "#E11D48", dot: "#E11D48", icon: AlertCircle },
  Mañana:       { bg: "#FEF3C7", text: "#F59E0B", dot: "#F59E0B", icon: AlertTriangle },
  "Esta semana":{ bg: "#E6EEFC", text: "#2563EB", dot: "#2563EB", icon: Clock },
  "Próximo mes":{ bg: "#F4F5F7", text: "#6B7280", dot: "#6B7280", icon: Calendar },
  Completado:   { bg: "#E8F7EE", text: "#16A34A", dot: "#16A34A", icon: CheckCircle2 },
}

const INITIAL: Vencimiento[] = [
  { id: "1", titulo: "Contestación de demanda", descripcion: "Plazo legal para contestar demanda laboral en juzgado federal", expediente: "EXP-2024-002", cliente: "Constructora Torres S.A.", fecha: "04/05/2026", urgencia: "Hoy", tipo: "Plazo procesal", abogado: "Carlos Mendoza", completado: false },
  { id: "2", titulo: "Presentación de alegatos", descripcion: "Entregar escrito de alegatos en audiencia final", expediente: "EXP-2024-008", cliente: "Tecnología Avanzada S.A.", fecha: "05/05/2026", urgencia: "Mañana", tipo: "Audiencia", abogado: "Carlos Mendoza", completado: false },
  { id: "3", titulo: "Pago de fianza judicial", descripcion: "Renovar garantía de suspensión en amparo", expediente: "EXP-2024-002", cliente: "Constructora Torres S.A.", fecha: "06/05/2026", urgencia: "Esta semana", tipo: "Pago", abogado: "María González", completado: false },
  { id: "4", titulo: "Diligencias de inventario", descripcion: "Acudir al juzgado para levantamiento de inventario sucesorial", expediente: "EXP-2024-007", cliente: "Familia López Herrera", fecha: "08/05/2026", urgencia: "Esta semana", tipo: "Diligencia", abogado: "María González", completado: false },
  { id: "5", titulo: "Vencimiento contrato arrendamiento", descripcion: "El contrato de arrendamiento vence y debe renovarse o ejecutarse", expediente: "EXP-2024-001", cliente: "Roberto García Méndez", fecha: "15/05/2026", urgencia: "Esta semana", tipo: "Contractual", abogado: "María González", completado: false },
  { id: "6", titulo: "Audiencia de conciliación", descripcion: "Primera audiencia en juicio oral civil", expediente: "EXP-2024-003", cliente: "Patricia Sánchez López", fecha: "20/05/2026", urgencia: "Próximo mes", tipo: "Audiencia", abogado: "Ana Ruiz", completado: false },
  { id: "7", titulo: "Renovación poder notarial", descripcion: "El poder para pleitos y cobranzas vence a fin de mes", expediente: "—", cliente: "Importadora LATAM S.A.", fecha: "31/05/2026", urgencia: "Próximo mes", tipo: "Administrativo", abogado: "Ana Ruiz", completado: false },
  { id: "8", titulo: "Solicitud acuerdo previo", descripcion: "Se presentó solicitud de acuerdo previo al juzgado", expediente: "EXP-2024-005", cliente: "Ejido San Pedro", fecha: "28/04/2026", urgencia: "Completado", tipo: "Plazo procesal", abogado: "Carlos Mendoza", completado: true },
]

function UrgenciaPill({ urgencia }: { urgencia: Urgencia }) {
  const s = URGENCIA_STYLES[urgencia]
  const Icon = s.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium leading-none whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <Icon className="w-3 h-3" />
      {urgencia}
    </span>
  )
}

export function Vencimientos() {
  const [items, setItems] = useState(INITIAL)
  const [filter, setFilter] = useState("todos")
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ titulo: "", descripcion: "", expediente: "", cliente: "", fecha: "", tipo: "Plazo procesal" })

  const filtered = items.filter((v) => filter === "todos" || v.urgencia === filter)

  const counts = {
    hoy: items.filter((v) => v.urgencia === "Hoy" && !v.completado).length,
    manana: items.filter((v) => v.urgencia === "Mañana" && !v.completado).length,
    semana: items.filter((v) => v.urgencia === "Esta semana" && !v.completado).length,
    completados: items.filter((v) => v.completado).length,
  }

  function toggleComplete(id: string) {
    setItems(items.map((v) =>
      v.id === id ? { ...v, completado: !v.completado, urgencia: !v.completado ? "Completado" : "Esta semana" } : v
    ))
  }

  function addVencimiento() {
    if (!form.titulo) return
    const nuevo: Vencimiento = {
      id: String(Date.now()),
      ...form,
      urgencia: "Esta semana",
      abogado: "María González",
      completado: false,
    }
    setItems([nuevo, ...items])
    setForm({ titulo: "", descripcion: "", expediente: "", cliente: "", fecha: "", tipo: "Plazo procesal" })
    setShowNew(false)
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Vencimientos
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Plazos, audiencias y fechas críticas de tus expedientes</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Nuevo vencimiento
        </Button>
      </div>

      <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { label: "Vencen hoy", value: counts.hoy, bg: "#FCE7EB", text: "#E11D48", icon: AlertCircle },
          { label: "Mañana", value: counts.manana, bg: "#FEF3C7", text: "#F59E0B", icon: AlertTriangle },
          { label: "Esta semana", value: counts.semana, bg: "#E6EEFC", text: "#2563EB", icon: Clock },
          { label: "Completados", value: counts.completados, bg: "#E8F7EE", text: "#16A34A", icon: CheckCircle2 },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.text }} />
              </div>
              <div>
                <p className="text-[22px] font-bold text-foreground leading-none">{s.value}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="px-6 pb-3 flex gap-2 shrink-0 flex-wrap">
        {(["todos", "Hoy", "Mañana", "Esta semana", "Próximo mes", "Completado"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className="text-[12px] h-7"
            onClick={() => setFilter(f)}
          >
            {f === "todos" ? "Todos" : f}
            {f !== "todos" && f !== "Completado" && (
              <span className="ml-1 text-[10px] opacity-70">
                ({items.filter((v) => v.urgencia === f && !v.completado).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      <div className="px-6 pb-6 space-y-3 flex-1 overflow-auto">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-[14px]">No hay vencimientos en esta categoría</p>
          </div>
        )}
        {filtered.map((v) => (
          <Card
            key={v.id}
            className={v.completado ? "opacity-60" : ""}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(v.id)}
                  className="mt-0.5 shrink-0"
                >
                  {v.completado
                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                    : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/40 hover:border-primary transition-colors" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-medium ${v.completado ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {v.titulo}
                      </p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{v.descripcion}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <UrgenciaPill urgencia={v.urgencia} />
                        <Badge variant="outline" className="text-[11px]">{v.tipo}</Badge>
                        <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                          <Folder className="w-3 h-3" />{v.expediente}
                        </span>
                        <span className="text-[12px] text-muted-foreground">{v.cliente}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-[12px] font-medium text-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />{v.fecha}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{v.abogado}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2" onClick={() => toggleComplete(v.id)}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {v.completado ? "Marcar pendiente" : "Marcar completado"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Bell className="w-3.5 h-3.5" />Configurar alerta</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Folder className="w-3.5 h-3.5" />Ver expediente</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo vencimiento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Nombre del plazo o actuación" />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={2} placeholder="Detalles del vencimiento" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Fecha</Label>
                <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Plazo procesal", "Audiencia", "Pago", "Contractual", "Administrativo", "Diligencia"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Expediente</Label>
                <Input value={form.expediente} onChange={(e) => setForm({ ...form, expediente: e.target.value })} placeholder="EXP-2024-XXX" />
              </div>
              <div className="space-y-1.5">
                <Label>Cliente</Label>
                <Input value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Nombre del cliente" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button onClick={addVencimiento} disabled={!form.titulo}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
