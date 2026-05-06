"use client"

import { useState } from "react"
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  Building2,
  User,
  Folder,
  Star,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

type ClienteTipo = "Persona física" | "Persona moral"

interface Cliente {
  id: string
  nombre: string
  rfc: string
  tipo: ClienteTipo
  email: string
  telefono: string
  expedientes: number
  estado: "Activo" | "Inactivo"
  desde: string
  abogado: string
  vip: boolean
}

const INITIAL_CLIENTES: Cliente[] = [
  { id: "1", nombre: "Roberto García Méndez", rfc: "GAMR780512HDF", tipo: "Persona física", email: "r.garcia@email.com", telefono: "55 4821 0032", expedientes: 3, estado: "Activo", desde: "Ene 2022", abogado: "María González", vip: true },
  { id: "2", nombre: "Constructora Torres S.A. de C.V.", rfc: "CTO930215ABC", tipo: "Persona moral", email: "legal@constructoratorres.mx", telefono: "55 3000 1145", expedientes: 7, estado: "Activo", desde: "Mar 2020", abogado: "Carlos Mendoza", vip: true },
  { id: "3", nombre: "Patricia Sánchez López", rfc: "SALP910804MDF", tipo: "Persona física", email: "patricia.sl@gmail.com", telefono: "55 6612 9087", expedientes: 1, estado: "Activo", desde: "Ene 2024", abogado: "María González", vip: false },
  { id: "4", nombre: "Importadora LATAM S.A. de C.V.", rfc: "ILA020307XYZ", tipo: "Persona moral", email: "juridico@latam.com.mx", telefono: "55 1234 5678", expedientes: 4, estado: "Activo", desde: "Jun 2021", abogado: "Ana Ruiz", vip: false },
  { id: "5", nombre: "Ejido San Pedro Tlaquepaque", rfc: "ESPT891120AAA", tipo: "Persona moral", email: "ejido.sanpedro@gmail.com", telefono: "33 8890 2213", expedientes: 2, estado: "Activo", desde: "Feb 2024", abogado: "Carlos Mendoza", vip: false },
  { id: "6", nombre: "Banco Nacional S.A.", rfc: "BNA540601AAA", tipo: "Persona moral", email: "legal@bna.com.mx", telefono: "55 5000 0000", expedientes: 12, estado: "Inactivo", desde: "May 2019", abogado: "Ana Ruiz", vip: false },
  { id: "7", nombre: "Familia López Herrera", rfc: "LOHE651201HDF", tipo: "Persona física", email: "familia.lopez.h@outlook.com", telefono: "55 9923 7741", expedientes: 2, estado: "Activo", desde: "Feb 2024", abogado: "María González", vip: false },
  { id: "8", nombre: "Tecnología Avanzada S.A.", rfc: "TAV150403MXN", tipo: "Persona moral", email: "rrhh@tecavanzada.mx", telefono: "55 7788 9900", expedientes: 3, estado: "Activo", desde: "Feb 2024", abogado: "Carlos Mendoza", vip: false },
]

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTES)
  const [search, setSearch] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ nombre: "", rfc: "", tipo: "Persona física" as ClienteTipo, email: "", telefono: "" })

  const filtered = clientes.filter((c) => {
    const q = search.toLowerCase()
    const match = c.nombre.toLowerCase().includes(q) || c.rfc.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    const tipo = filterTipo === "todos" || c.tipo === filterTipo
    return match && tipo
  })

  const counts = {
    total: clientes.length,
    fisicas: clientes.filter((c) => c.tipo === "Persona física").length,
    morales: clientes.filter((c) => c.tipo === "Persona moral").length,
    activos: clientes.filter((c) => c.estado === "Activo").length,
  }

  function handleCreate() {
    if (!form.nombre) return
    const nuevo: Cliente = {
      id: String(Date.now()),
      nombre: form.nombre,
      rfc: form.rfc,
      tipo: form.tipo,
      email: form.email,
      telefono: form.telefono,
      expedientes: 0,
      estado: "Activo",
      desde: new Date().toLocaleDateString("es-MX", { month: "short", year: "numeric" }),
      abogado: "María González",
      vip: false,
    }
    setClientes([nuevo, ...clientes])
    setForm({ nombre: "", rfc: "", tipo: "Persona física", email: "", telefono: "" })
    setShowNew(false)
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-[18px] sm:text-[20px] font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Clientes
          </h1>
          <p className="hidden sm:block text-[13px] text-muted-foreground mt-0.5">Directorio y gestión de clientes del despacho</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2 shrink-0 text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo </span>cliente
        </Button>
      </div>

      <div className="px-4 sm:px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0">
        {[
          { label: "Total clientes", value: counts.total, icon: Users, color: "text-primary" },
          { label: "Activos", value: counts.activos, icon: User, color: "text-green-600" },
          { label: "Personas físicas", value: counts.fisicas, icon: User, color: "text-blue-600" },
          { label: "Personas morales", value: counts.morales, icon: Building2, color: "text-purple-600" },
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

      <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-3 shrink-0">
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, RFC o correo..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-36 sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="Persona física">Persona física</SelectItem>
            <SelectItem value="Persona moral">Persona moral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="px-4 sm:px-6 pb-6 flex-1 overflow-auto">
        <Card>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden sm:table-cell">RFC</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead className="hidden lg:table-cell">Contacto</TableHead>
                <TableHead className="hidden md:table-cell">Expedientes</TableHead>
                <TableHead className="hidden lg:table-cell">Abogado</TableHead>
                <TableHead className="hidden lg:table-cell">Cliente desde</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
                        {c.nombre.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-medium text-foreground max-w-[160px] truncate block">
                          {c.nombre}
                          {c.vip && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 inline ml-1 shrink-0" />}
                        </span>
                        <span className="sm:hidden text-[11px] text-muted-foreground font-mono">{c.rfc}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-[12px] text-muted-foreground">{c.rfc}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-[11px] gap-1">
                      {c.tipo === "Persona física" ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                      {c.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-0.5">
                      <p className="text-[12px] text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />{c.email}
                      </p>
                      <p className="text-[12px] text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />{c.telefono}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                      <Folder className="w-3.5 h-3.5" />{c.expedientes}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-[13px] text-muted-foreground">{c.abogado}</TableCell>
                  <TableCell className="hidden lg:table-cell text-[13px] text-muted-foreground">{c.desde}</TableCell>
                  <TableCell>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={c.estado === "Activo"
                        ? { backgroundColor: "#E8F7EE", color: "#16A34A" }
                        : { backgroundColor: "#F5F5F5", color: "#555555" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.estado === "Activo" ? "#16A34A" : "#555555" }} />
                      {c.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Eye className="w-3.5 h-3.5" />Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><Folder className="w-3.5 h-3.5" />Ver expedientes</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><Mail className="w-3.5 h-3.5" />Enviar mensaje</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-muted-foreground text-[13px]">
                    No se encontraron clientes
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
            <DialogTitle>Nuevo cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre completo / Razón social *</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del cliente" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>RFC</Label>
                <Input value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value })} placeholder="RFC con homoclave" />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as ClienteTipo })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Persona física">Persona física</SelectItem>
                    <SelectItem value="Persona moral">Persona moral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="55 0000 0000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!form.nombre}>Guardar cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


