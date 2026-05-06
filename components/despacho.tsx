"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Building2,
  Users,
  Shield,
  FileText,
  CreditCard,
  Calendar,
  BarChart2,
  Settings,
  Mail,
  Phone,
  ChevronDown,
  UserPlus,
  CheckCircle,
  XCircle,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type Rol = "socio_director" | "socio" | "asociado_senior" | "asociado" | "becario" | "administrativo"

type PermisoId =
  | "expedientes" | "clientes" | "documentos" | "calendario"
  | "facturacion" | "reportes" | "configuracion" | "admin_despacho"

interface Permiso {
  id: PermisoId
  label: string
  icon: typeof FileText
  descripcion: string
}

interface Usuario {
  id: string
  nombre: string
  iniciales: string
  cargo: string
  rol: Rol
  correo: string
  telefono?: string
  activo: boolean
  permisos: PermisoId[]
}

// ── Config ────────────────────────────────────────────────────────────────────

const ROL_CONFIG: Record<Rol, { label: string; color: string; bg: string; nivel: number }> = {
  socio_director: { label: "Socio Director",   color: "#725a42", bg: "#F5F0EB", nivel: 5 },
  socio:          { label: "Socio",             color: "#7c3aed", bg: "#F5F3FF", nivel: 4 },
  asociado_senior:{ label: "Asociado Senior",  color: "#0ea5e9", bg: "#F0F9FF", nivel: 3 },
  asociado:       { label: "Asociado",          color: "#10b981", bg: "#ECFDF5", nivel: 2 },
  becario:        { label: "Becario",           color: "#f97316", bg: "#FFF7ED", nivel: 1 },
  administrativo: { label: "Administrativo",    color: "#64748b", bg: "#F8FAFC", nivel: 1 },
}

const PERMISOS: Permiso[] = [
  { id: "expedientes",    label: "Expedientes",      icon: FileText,   descripcion: "Ver y editar expedientes" },
  { id: "clientes",       label: "Clientes",         icon: Users,      descripcion: "Gestión de clientes" },
  { id: "documentos",     label: "Documentos",       icon: FileText,   descripcion: "Crear y editar documentos" },
  { id: "calendario",     label: "Calendario",       icon: Calendar,   descripcion: "Agenda y eventos" },
  { id: "facturacion",    label: "Facturación",      icon: CreditCard, descripcion: "Facturas y cobros" },
  { id: "reportes",       label: "Reportes",         icon: BarChart2,  descripcion: "Reportes y estadísticas" },
  { id: "configuracion",  label: "Configuración",    icon: Settings,   descripcion: "Ajustes del sistema" },
  { id: "admin_despacho", label: "Admin despacho",   icon: Shield,     descripcion: "Gestión de usuarios y roles" },
]

const PERMISOS_POR_ROL: Record<Rol, PermisoId[]> = {
  socio_director: ["expedientes","clientes","documentos","calendario","facturacion","reportes","configuracion","admin_despacho"],
  socio:          ["expedientes","clientes","documentos","calendario","facturacion","reportes"],
  asociado_senior:["expedientes","clientes","documentos","calendario","reportes"],
  asociado:       ["expedientes","clientes","documentos","calendario"],
  becario:        ["expedientes","documentos"],
  administrativo: ["clientes","calendario","facturacion","configuracion"],
}

const AVATAR_COLORS: Record<string, string> = {
  MG: "#725a42", CL: "#7c3aed", AG: "#10b981", PR: "#0ea5e9",
  LH: "#ec4899", RM: "#f97316", SC: "#14b8a6", DF: "#64748b",
}

// ── Initial data ──────────────────────────────────────────────────────────────

const INITIAL_USUARIOS: Usuario[] = [
  {
    id: "u1", nombre: "María González", iniciales: "MG", cargo: "Socia Directora",
    rol: "socio_director", correo: "m.gonzalez@lexapro.mx", telefono: "+52 55 1234-5678",
    activo: true, permisos: PERMISOS_POR_ROL.socio_director,
  },
  {
    id: "u2", nombre: "Carlos López", iniciales: "CL", cargo: "Socio",
    rol: "socio", correo: "c.lopez@lexapro.mx", telefono: "+52 55 2345-6789",
    activo: true, permisos: PERMISOS_POR_ROL.socio,
  },
  {
    id: "u3", nombre: "Ana García", iniciales: "AG", cargo: "Asociada Senior",
    rol: "asociado_senior", correo: "a.garcia@lexapro.mx", telefono: "+52 55 3456-7890",
    activo: true, permisos: PERMISOS_POR_ROL.asociado_senior,
  },
  {
    id: "u4", nombre: "Pedro Ramírez", iniciales: "PR", cargo: "Asociado",
    rol: "asociado", correo: "p.ramirez@lexapro.mx",
    activo: true, permisos: PERMISOS_POR_ROL.asociado,
  },
  {
    id: "u5", nombre: "Lucía Herrera", iniciales: "LH", cargo: "Asociada",
    rol: "asociado", correo: "l.herrera@lexapro.mx",
    activo: true, permisos: PERMISOS_POR_ROL.asociado,
  },
  {
    id: "u6", nombre: "Rodrigo Mendoza", iniciales: "RM", cargo: "Becario",
    rol: "becario", correo: "r.mendoza@lexapro.mx",
    activo: true, permisos: PERMISOS_POR_ROL.becario,
  },
  {
    id: "u7", nombre: "Sofía Castro", iniciales: "SC", cargo: "Becaria",
    rol: "becario", correo: "s.castro@lexapro.mx",
    activo: false, permisos: PERMISOS_POR_ROL.becario,
  },
  {
    id: "u8", nombre: "Diego Flores", iniciales: "DF", cargo: "Administrativo",
    rol: "administrativo", correo: "d.flores@lexapro.mx", telefono: "+52 55 8765-4321",
    activo: true, permisos: PERMISOS_POR_ROL.administrativo,
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function RolBadge({ rol }: { rol: Rol }) {
  const c = ROL_CONFIG[rol]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  )
}

function AvatarCircle({ iniciales, size = "md" }: { iniciales: string; size?: "sm" | "md" | "lg" }) {
  const color = AVATAR_COLORS[iniciales] ?? "#725a42"
  const sizeClass = size === "lg" ? "w-14 h-14 text-lg" : size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {iniciales}
    </div>
  )
}

// ── Permissions modal ─────────────────────────────────────────────────────────

interface PermisosModalProps {
  usuario: Usuario
  onClose: () => void
  onSave: (id: string, permisos: PermisoId[], rol: Rol) => void
}

function PermisosModal({ usuario, onClose, onSave }: PermisosModalProps) {
  const [permisos, setPermisos] = useState<PermisoId[]>(usuario.permisos)
  const [rol, setRol] = useState<Rol>(usuario.rol)

  function handleRolChange(newRol: Rol) {
    setRol(newRol)
    setPermisos(PERMISOS_POR_ROL[newRol])
  }

  function togglePermiso(id: PermisoId) {
    setPermisos(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Permisos — {usuario.nombre}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-5">
          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <Label>Rol</Label>
            <select
              value={rol}
              onChange={e => handleRolChange(e.target.value as Rol)}
              className="h-9 rounded-md border border-[#EAEAEA] bg-white px-3 text-sm text-[#111111] outline-none focus-visible:border-[#725a42]"
            >
              {Object.entries(ROL_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-[#888888]">Cambiar el rol asigna permisos predeterminados automáticamente.</p>
          </div>

          {/* Permissions */}
          <div className="flex flex-col gap-1.5">
            <Label>Permisos individuales</Label>
            <div className="border border-[#EAEAEA] rounded-xl overflow-hidden">
              {PERMISOS.map((p, i) => {
                const Icon = p.icon
                const tiene = permisos.includes(p.id)
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i < PERMISOS.length - 1 ? "border-b border-[#EAEAEA]" : ""
                    } ${tiene ? "bg-white" : "bg-[#FAFAFA]"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tiene ? "bg-[#725a4214]" : "bg-[#F5F5F5]"}`}>
                        <Icon className={`w-3.5 h-3.5 ${tiene ? "text-[#725a42]" : "text-[#AAAAAA]"}`} />
                      </div>
                      <div>
                        <p className={`text-[13px] font-medium ${tiene ? "text-[#111111]" : "text-[#888888]"}`}>{p.label}</p>
                        <p className="text-[11px] text-[#AAAAAA]">{p.descripcion}</p>
                      </div>
                    </div>
                    <Switch
                      checked={tiene}
                      onCheckedChange={() => togglePermiso(p.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(usuario.id, permisos, rol)}>Guardar cambios</Button>
      </DialogFooter>
    </DialogContent>
  )
}

// ── User card ─────────────────────────────────────────────────────────────────

interface UsuarioCardProps {
  usuario: Usuario
  onEditPermisos: (u: Usuario) => void
  onToggleActivo: (id: string) => void
}

function UsuarioCard({ usuario, onEditPermisos, onToggleActivo }: UsuarioCardProps) {
  const [rolOpen, setRolOpen] = useState(false)
  const rolCfg = ROL_CONFIG[usuario.rol]

  return (
    <div className={`bg-white rounded-xl border border-[#EAEAEA] p-5 flex flex-col gap-4 transition-opacity ${!usuario.activo ? "opacity-60" : ""}`}>
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <AvatarCircle iniciales={usuario.iniciales} size="md" />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${usuario.activo ? "bg-[#10B981]" : "bg-[#CCCCCC]"}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#111111] leading-tight">{usuario.nombre}</p>
          <p className="text-[12px] text-[#888888]">{usuario.cargo}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {usuario.activo
            ? <CheckCircle className="w-4 h-4 text-[#10B981]" />
            : <XCircle className="w-4 h-4 text-[#CCCCCC]" />
          }
          <span className="text-[11px] text-[#888888]">{usuario.activo ? "Activo" : "Inactivo"}</span>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[12px] text-[#555555]">
          <Mail className="w-3.5 h-3.5 text-[#AAAAAA]" />
          {usuario.correo}
        </div>
        {usuario.telefono && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#555555]">
            <Phone className="w-3.5 h-3.5 text-[#AAAAAA]" />
            {usuario.telefono}
          </div>
        )}
      </div>

      {/* Role */}
      <div className="flex items-center justify-between">
        <RolBadge rol={usuario.rol} />
        <span className="text-[11px] text-[#AAAAAA]">{usuario.permisos.length} permisos</span>
      </div>

      {/* Permissions preview */}
      <div className="flex flex-wrap gap-1.5">
        {PERMISOS.map(p => {
          const tiene = usuario.permisos.includes(p.id)
          return (
            <span
              key={p.id}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                tiene
                  ? "bg-[#F5F0EB] text-[#725a42]"
                  : "bg-[#F5F5F5] text-[#CCCCCC] line-through"
              }`}
            >
              {p.label}
            </span>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#F5F5F5]">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-[12px] gap-1.5"
          onClick={() => onEditPermisos(usuario)}
        >
          <Shield className="w-3.5 h-3.5" />
          Editar permisos
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-[12px] px-3"
          onClick={() => onToggleActivo(usuario.id)}
        >
          {usuario.activo ? "Desactivar" : "Activar"}
        </Button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Despacho() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS)
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [filtroRol, setFiltroRol] = useState<Rol | "todos">("todos")

  const activos   = usuarios.filter(u => u.activo).length
  const inactivos = usuarios.filter(u => !u.activo).length

  const filtrados = filtroRol === "todos"
    ? usuarios
    : usuarios.filter(u => u.rol === filtroRol)

  function handleSavePermisos(id: string, permisos: PermisoId[], rol: Rol) {
    setUsuarios(prev => prev.map(u =>
      u.id === id ? { ...u, permisos, rol, cargo: ROL_CONFIG[rol].label } : u
    ))
    setEditando(null)
    toast.success("Permisos actualizados")
  }

  function handleToggleActivo(id: string) {
    setUsuarios(prev => prev.map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    ))
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">

      {/* Header */}
      <header className="h-16 border-b border-[#EAEAEA] bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#725a4214] flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-[#725a42]" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-[#111111] leading-none">Despacho</h1>
            <p className="text-[12px] text-[#888888] mt-0.5">Gestión de usuarios y permisos</p>
          </div>
        </div>
        <Button className="bg-[#111111] text-white hover:bg-[#333333] gap-1.5 h-9 px-4 text-[13px]">
          <UserPlus className="w-4 h-4" />
          Agregar usuario
        </Button>
      </header>

      {/* Stats + filters */}
      <div className="bg-white border-b border-[#EAEAEA] shrink-0">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[20px] sm:text-[22px] font-bold text-[#111111]">{usuarios.length}</span>
            <span className="text-[11px] text-[#888888]">Total</span>
          </div>
          <div className="w-px h-8 bg-[#EAEAEA]" />
          <div className="flex flex-col">
            <span className="text-[20px] sm:text-[22px] font-bold text-[#10B981]">{activos}</span>
            <span className="text-[11px] text-[#888888]">Activos</span>
          </div>
          <div className="w-px h-8 bg-[#EAEAEA]" />
          <div className="flex flex-col">
            <span className="text-[20px] sm:text-[22px] font-bold text-[#888888]">{inactivos}</span>
            <span className="text-[11px] text-[#888888]">Inactivos</span>
          </div>
        </div>
        {/* Role filter — horizontal scroll on mobile */}
        <div className="px-4 sm:px-6 pb-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setFiltroRol("todos")}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border whitespace-nowrap ${
                filtroRol === "todos"
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#555555] border-[#EAEAEA] hover:bg-[#F5F5F5]"
              }`}
            >
              Todos
            </button>
            {(Object.keys(ROL_CONFIG) as Rol[]).map(r => (
              <button
                key={r}
                onClick={() => setFiltroRol(r)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border whitespace-nowrap"
                style={filtroRol === r
                  ? { backgroundColor: ROL_CONFIG[r].bg, color: ROL_CONFIG[r].color, borderColor: "transparent" }
                  : { backgroundColor: "#fff", color: "#555555", borderColor: "#EAEAEA" }
                }
              >
                {ROL_CONFIG[r].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Users className="w-10 h-10 text-[#CCCCCC] mb-3" />
            <p className="text-[#555555] font-medium">Sin usuarios en este rol</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtrados.map(u => (
              <UsuarioCard
                key={u.id}
                usuario={u}
                onEditPermisos={setEditando}
                onToggleActivo={handleToggleActivo}
              />
            ))}
          </div>
        )}
      </div>

      {/* Permissions modal */}
      <Dialog open={!!editando} onOpenChange={open => !open && setEditando(null)}>
        {editando && (
          <PermisosModal
            usuario={editando}
            onClose={() => setEditando(null)}
            onSave={handleSavePermisos}
          />
        )}
      </Dialog>
    </div>
  )
}
