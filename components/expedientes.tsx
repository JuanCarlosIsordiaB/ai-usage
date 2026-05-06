"use client"

import { useState } from "react"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Folder,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

type ExpedienteStatus = "Activo" | "Urgente" | "En revisión" | "Cerrado"

interface Expediente {
  id: string
  folio: string
  asunto: string
  cliente: string
  tipo: string
  status: ExpedienteStatus
  abogado: string
  fechaApertura: string
  ultimaActuacion: string
}

const STATUS_STYLES: Record<ExpedienteStatus, { bg: string; text: string; dot: string }> = {
  Activo:       { bg: "#725a4214", text: "#725a42", dot: "#725a42" },
  Urgente:      { bg: "#FCE7EB", text: "#E11D48", dot: "#E11D48" },
  "En revisión":{ bg: "#FEF3C7", text: "#F59E0B", dot: "#F59E0B" },
  Cerrado:      { bg: "#E8F7EE", text: "#16A34A", dot: "#16A34A" },
}

function StatusPill({ status }: { status: ExpedienteStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium leading-none whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  )
}

const INITIAL_EXPEDIENTES: Expediente[] = [
  { id: "1", folio: "EXP-2024-001", asunto: "Divorcio contencioso García vs. García", cliente: "Roberto García Méndez", tipo: "Familiar", status: "Activo", abogado: "María González", fechaApertura: "12/01/2024", ultimaActuacion: "Hace 2 días" },
  { id: "2", folio: "EXP-2024-002", asunto: "Recurso de amparo en materia laboral", cliente: "Constructora Torres S.A.", tipo: "Laboral", status: "Urgente", abogado: "Carlos Mendoza", fechaApertura: "15/01/2024", ultimaActuacion: "Hoy" },
  { id: "3", folio: "EXP-2024-003", asunto: "Contrato de compraventa inmueble", cliente: "Patricia Sánchez López", tipo: "Civil", status: "En revisión", abogado: "María González", fechaApertura: "20/01/2024", ultimaActuacion: "Hace 1 semana" },
  { id: "4", folio: "EXP-2024-004", asunto: "Demanda por incumplimiento mercantil", cliente: "Importadora LATAM S.A. de C.V.", tipo: "Mercantil", status: "Activo", abogado: "Ana Ruiz", fechaApertura: "03/02/2024", ultimaActuacion: "Ayer" },
  { id: "5", folio: "EXP-2024-005", asunto: "Regularización de propiedad ejidal", cliente: "Ejido San Pedro Tlaquepaque", tipo: "Agrario", status: "Activo", abogado: "Carlos Mendoza", fechaApertura: "10/02/2024", ultimaActuacion: "Hace 3 días" },
  { id: "6", folio: "EXP-2023-089", asunto: "Cobro de pagaré vencido", cliente: "Banco Nacional S.A.", tipo: "Mercantil", status: "Cerrado", abogado: "Ana Ruiz", fechaApertura: "05/09/2023", ultimaActuacion: "Hace 2 meses" },
  { id: "7", folio: "EXP-2024-006", asunto: "Sucesión testamentaria López", cliente: "Familia López Herrera", tipo: "Familiar", status: "En revisión", abogado: "María González", fechaApertura: "18/02/2024", ultimaActuacion: "Hace 5 días" },
  { id: "8", folio: "EXP-2024-007", asunto: "Litigio por despido injustificado", cliente: "Tecnología Avanzada S.A.", tipo: "Laboral", status: "Urgente", abogado: "Carlos Mendoza", fechaApertura: "22/02/2024", ultimaActuacion: "Hoy" },
]

export function Expedientes() {
  const [expedientes, setExpedientes] = useState<Expediente[]>(INITIAL_EXPEDIENTES)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ asunto: "", cliente: "", tipo: "Civil", abogado: "María González" })

  const filtered = expedientes.filter((e) => {
    const matchSearch =
      e.folio.toLowerCase().includes(search.toLowerCase()) ||
      e.asunto.toLowerCase().includes(search.toLowerCase()) ||
      e.cliente.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "todos" || e.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = {
    total: expedientes.length,
    activos: expedientes.filter((e) => e.status === "Activo").length,
    urgentes: expedientes.filter((e) => e.status === "Urgente").length,
    cerrados: expedientes.filter((e) => e.status === "Cerrado").length,
  }

  function handleCreate() {
    if (!newForm.asunto || !newForm.cliente) return
    const next: Expediente = {
      id: String(Date.now()),
      folio: `EXP-2024-${String(expedientes.length + 1).padStart(3, "0")}`,
      asunto: newForm.asunto,
      cliente: newForm.cliente,
      tipo: newForm.tipo,
      status: "Activo",
      abogado: newForm.abogado,
      fechaApertura: new Date().toLocaleDateString("es-MX"),
      ultimaActuacion: "Hoy",
    }
    setExpedientes([next, ...expedientes])
    setNewForm({ asunto: "", cliente: "", tipo: "Civil", abogado: "María González" })
    setShowNew(false)
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-[18px] sm:text-[20px] font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            Expedientes
          </h1>
          <p className="hidden sm:block text-[13px] text-muted-foreground mt-0.5">Gestión de casos y expedientes del despacho</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2 shrink-0 text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo </span>expediente
        </Button>
      </div>

      <div className="px-4 sm:px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0">
        {[
          { label: "Total expedientes", value: counts.total, icon: FileText, color: "text-primary" },
          { label: "Activos", value: counts.activos, icon: Clock, color: "text-blue-600" },
          { label: "Urgentes", value: counts.urgentes, icon: AlertCircle, color: "text-red-600" },
          { label: "Cerrados", value: counts.cerrados, icon: CheckCircle2, color: "text-green-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color} shrink-0`} />
              <div>
                <p className="text-[22px] font-bold text-foreground leading-none">{stat.value}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-3 shrink-0">
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por folio, asunto o cliente..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 sm:w-40">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Urgente">Urgente</SelectItem>
            <SelectItem value="En revisión">En revisión</SelectItem>
            <SelectItem value="Cerrado">Cerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="px-4 sm:px-6 pb-6 flex-1 overflow-auto">
        <Card>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Folio</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Abogado</TableHead>
                <TableHead className="hidden lg:table-cell">Última actuación</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="hidden sm:table-cell font-mono text-[12px] text-muted-foreground">{exp.folio}</TableCell>
                  <TableCell className="max-w-[180px] sm:max-w-[220px]">
                    <p className="text-[13px] font-medium text-foreground truncate">{exp.asunto}</p>
                    <p className="md:hidden text-[11px] text-muted-foreground mt-0.5 truncate">{exp.cliente}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-[13px] text-muted-foreground">{exp.cliente}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className="text-[11px]">{exp.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={exp.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-[13px] text-muted-foreground">{exp.abogado}</TableCell>
                  <TableCell className="hidden lg:table-cell text-[12px] text-muted-foreground">{exp.ultimaActuacion}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Eye className="w-3.5 h-3.5" />Ver expediente</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><FileText className="w-3.5 h-3.5" />Agregar actuación</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><Users className="w-3.5 h-3.5" />Cambiar abogado</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-[13px]">
                    No se encontraron expedientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </Card>
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo expediente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Asunto *</Label>
              <Input
                placeholder="Descripción del caso"
                value={newForm.asunto}
                onChange={(e) => setNewForm({ ...newForm, asunto: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <Input
                placeholder="Nombre del cliente"
                value={newForm.cliente}
                onChange={(e) => setNewForm({ ...newForm, cliente: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tipo de caso</Label>
                <Select value={newForm.tipo} onValueChange={(v) => setNewForm({ ...newForm, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Civil", "Familiar", "Laboral", "Mercantil", "Penal", "Agrario", "Administrativo"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Abogado asignado</Label>
                <Select value={newForm.abogado} onValueChange={(v) => setNewForm({ ...newForm, abogado: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["María González", "Carlos Mendoza", "Ana Ruiz"].map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!newForm.asunto || !newForm.cliente}>Crear expediente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


