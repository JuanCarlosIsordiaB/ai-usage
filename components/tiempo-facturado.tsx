"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, Play, Pause, Plus, Timer, DollarSign, TrendingUp, Folder, MoreHorizontal, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface TimeEntry {
  id: string
  descripcion: string
  cliente: string
  expediente: string
  abogado: string
  fecha: string
  duracion: string
  minutos: number
  tarifa: number
  facturado: boolean
}

const ENTRIES: TimeEntry[] = [
  { id: "1", descripcion: "Revisión y análisis de contrato de arrendamiento", cliente: "Roberto García Méndez", expediente: "EXP-2024-001", abogado: "María González", fecha: "04/05/2026", duracion: "2h 30m", minutos: 150, tarifa: 1800, facturado: false },
  { id: "2", descripcion: "Audiencia inicial juzgado laboral", cliente: "Constructora Torres S.A.", expediente: "EXP-2024-002", abogado: "Carlos Mendoza", fecha: "04/05/2026", duracion: "3h 00m", minutos: 180, tarifa: 2400, facturado: false },
  { id: "3", descripcion: "Elaboración de demanda civil", cliente: "Patricia Sánchez López", expediente: "EXP-2024-003", abogado: "María González", fecha: "03/05/2026", duracion: "4h 15m", minutos: 255, tarifa: 3600, facturado: true },
  { id: "4", descripcion: "Consulta y asesoría mercantil", cliente: "Importadora LATAM S.A.", expediente: "EXP-2024-004", abogado: "Ana Ruiz", fecha: "03/05/2026", duracion: "1h 00m", minutos: 60, tarifa: 900, facturado: true },
  { id: "5", descripcion: "Investigación jurisprudencial", cliente: "Familia López Herrera", expediente: "EXP-2024-007", abogado: "María González", fecha: "02/05/2026", duracion: "2h 00m", minutos: 120, tarifa: 1600, facturado: false },
  { id: "6", descripcion: "Redacción de escrito de agravios", cliente: "Constructora Torres S.A.", expediente: "EXP-2024-002", abogado: "Carlos Mendoza", fecha: "02/05/2026", duracion: "3h 30m", minutos: 210, tarifa: 2800, facturado: false },
  { id: "7", descripcion: "Notificación y seguimiento de acuerdos", cliente: "Ejido San Pedro", expediente: "EXP-2024-005", abogado: "Carlos Mendoza", fecha: "01/05/2026", duracion: "1h 30m", minutos: 90, tarifa: 1200, facturado: true },
]

function fmt(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function TiempoFacturado() {
  const [entries, setEntries] = useState(ENTRIES)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [timerDesc, setTimerDesc] = useState("")
  const [timerCliente, setTimerCliente] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ descripcion: "", cliente: "", expediente: "", duracion: "", tarifa: "" })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  function stopAndSave() {
    if (elapsed === 0) return
    const mins = Math.round(elapsed / 60)
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const entry: TimeEntry = {
      id: String(Date.now()),
      descripcion: timerDesc || "Entrada de tiempo",
      cliente: timerCliente || "Sin cliente",
      expediente: "—",
      abogado: "María González",
      fecha: new Date().toLocaleDateString("es-MX"),
      duracion: `${h > 0 ? h + "h " : ""}${m}m`,
      minutos: mins,
      tarifa: Math.round(mins * 13.33),
      facturado: false,
    }
    setEntries([entry, ...entries])
    setElapsed(0)
    setRunning(false)
    setTimerDesc("")
    setTimerCliente("")
  }

  function addManual() {
    if (!form.descripcion) return
    const entry: TimeEntry = {
      id: String(Date.now()),
      descripcion: form.descripcion,
      cliente: form.cliente,
      expediente: form.expediente || "—",
      abogado: "María González",
      fecha: new Date().toLocaleDateString("es-MX"),
      duracion: form.duracion,
      minutos: 60,
      tarifa: Number(form.tarifa) || 0,
      facturado: false,
    }
    setEntries([entry, ...entries])
    setForm({ descripcion: "", cliente: "", expediente: "", duracion: "", tarifa: "" })
    setShowNew(false)
  }

  const totalMins = entries.reduce((s, e) => s + e.minutos, 0)
  const totalHrs = (totalMins / 60).toFixed(1)
  const totalFacturado = entries.filter((e) => e.facturado).reduce((s, e) => s + e.tarifa, 0)
  const totalPendiente = entries.filter((e) => !e.facturado).reduce((s, e) => s + e.tarifa, 0)
  const pendienteCount = entries.filter((e) => !e.facturado).length

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Tiempo facturado
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Control de horas trabajadas y registro de tiempos</p>
        </div>
        <Button onClick={() => setShowNew(true)} variant="outline" className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Agregar entrada
        </Button>
      </div>

      <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { label: "Total horas (mes)", value: totalHrs + "h", icon: Clock, color: "text-primary" },
          { label: "Por facturar", value: `$${totalPendiente.toLocaleString()}`, icon: Timer, color: "text-orange-500" },
          { label: "Facturado", value: `$${totalFacturado.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
          { label: "Entradas pendientes", value: pendienteCount, icon: TrendingUp, color: "text-blue-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-8 h-8 ${s.color} shrink-0`} />
              <div>
                <p className="text-[22px] font-bold text-foreground leading-none">{s.value}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timer widget */}
      <div className="px-6 pb-4 shrink-0">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="text-[32px] font-mono font-bold text-primary tabular-nums w-32">{fmt(elapsed)}</div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                placeholder="Descripción de la actividad..."
                value={timerDesc}
                onChange={(e) => setTimerDesc(e.target.value)}
                className="bg-background"
              />
              <Input
                placeholder="Cliente"
                value={timerCliente}
                onChange={(e) => setTimerCliente(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant={running ? "destructive" : "default"}
                className="gap-2"
                onClick={() => setRunning(!running)}
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? "Pausar" : "Iniciar"}
              </Button>
              {elapsed > 0 && (
                <Button variant="outline" className="gap-2" onClick={stopAndSave}>
                  <CheckCircle2 className="w-4 h-4" />Guardar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-6 flex-1 overflow-auto">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[14px]">Registros de tiempo — Mayo 2026</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Expediente</TableHead>
                <TableHead>Abogado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead className="text-right">Importe</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-[13px] text-foreground max-w-[200px] truncate">{e.descripcion}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{e.cliente}</TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{e.expediente}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{e.abogado}</TableCell>
                  <TableCell className="text-[12px] text-muted-foreground">{e.fecha}</TableCell>
                  <TableCell className="font-mono text-[13px] font-medium">{e.duracion}</TableCell>
                  <TableCell className="text-right text-[13px] font-medium">${e.tarifa.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={e.facturado
                        ? { backgroundColor: "#E8F7EE", color: "#16A34A" }
                        : { backgroundColor: "#FEF3C7", color: "#F59E0B" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.facturado ? "#16A34A" : "#F59E0B" }} />
                      {e.facturado ? "Facturado" : "Pendiente"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar entrada de tiempo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Descripción *</Label>
              <Textarea
                placeholder="Describe la actividad realizada"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Cliente</Label>
                <Input value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Nombre del cliente" />
              </div>
              <div className="space-y-1.5">
                <Label>Expediente</Label>
                <Input value={form.expediente} onChange={(e) => setForm({ ...form, expediente: e.target.value })} placeholder="EXP-2024-XXX" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duración</Label>
                <Input value={form.duracion} onChange={(e) => setForm({ ...form, duracion: e.target.value })} placeholder="2h 30m" />
              </div>
              <div className="space-y-1.5">
                <Label>Importe ($)</Label>
                <Input type="number" value={form.tarifa} onChange={(e) => setForm({ ...form, tarifa: e.target.value })} placeholder="0.00" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button onClick={addManual} disabled={!form.descripcion}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

