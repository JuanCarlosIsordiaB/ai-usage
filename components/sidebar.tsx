"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Scale,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  Home,
  Clock,
  AlertCircle,
  Search,
  CreditCard,
  Bot,
  FileEdit,
  Gavel,
  Newspaper,
  Archive,
  Bell,
  LogOut,
  Settings,
  CheckSquare,
  Building2,
} from "lucide-react"

interface SidebarProps {
  activeModule?: string
  onNavigate?: (module: string) => void
  isOpen?: boolean
  onClose?: () => void
}

interface NavItemProps {
  icon: LucideIcon
  label: string
  module?: string
  activeModule?: string
  onNavigate?: (module: string) => void
  badge?: string | number
  badgeVariant?: "accent" | "critical" | "warning" | "info" | "default"
  danger?: boolean
}

function NavItem({
  icon: Icon,
  label,
  module,
  activeModule,
  onNavigate,
  badge,
  badgeVariant = "accent",
  danger = false,
}: NavItemProps) {
  const isActive = module !== undefined && activeModule === module

  const badgeBg: Record<string, string> = {
    accent:   "bg-[#725a42] text-white",
    critical: "bg-[var(--status-error)] text-white",
    warning:  "bg-[var(--status-warning)] text-white",
    info:     "bg-[var(--status-info)] text-white",
    default:  "bg-[var(--bg-light)] text-[var(--color-slate-600)]",
  }

  return (
    <button
      onClick={() => module && onNavigate?.(module)}
      className={cn(
        "nav-item",
        isActive && "nav-item--active",
        danger && "nav-item--danger",
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "ml-auto min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0",
            isActive
              ? "bg-[#725a42] text-white"
              : badgeBg[badgeVariant],
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

function NavSection({ label }: { label: string }) {
  return (
    <p className="px-2 pt-5 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-slate-400)] select-none">
      {label}
    </p>
  )
}

export function Sidebar({ activeModule = "dashboard", onNavigate, isOpen = false, onClose }: SidebarProps) {
  function navigate(module: string) {
    onNavigate?.(module)
    onClose?.()
  }

  const inner = (
    <>
      {/* Logo */}
      <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid var(--border-default)", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, color: "var(--color-charcoal)", letterSpacing: "-0.5px" }}>
          Legal<span style={{ color: "#725a42" }}>Pro</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: "16px 12px" }}>
        <NavItem icon={Home} label="Dashboard" module="dashboard" activeModule={activeModule} onNavigate={navigate} />

        <NavSection label="Gestión de casos" />
        <NavItem icon={FileText}   label="Expedientes"  badge={24}    badgeVariant="info"     module="expedientes"  activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Users}      label="Clientes"     badge={156}   badgeVariant="default"  module="clientes"     activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Calendar}   label="Calendario"   badge={3}     badgeVariant="critical" module="calendario"   activeModule={activeModule} onNavigate={navigate} />

        <NavSection label="Documentos e IA" />
        <NavItem icon={FileEdit}   label="Editor de documentos" module="documentos"              activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Archive}    label="Base de datos"        module="base-de-datos"           activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Bot}        label="Asistente IA"         module="asistente-ia"            activeModule={activeModule} onNavigate={navigate} />

        <NavSection label="Investigación legal" />
        <NavItem icon={Search}     label="Búsqueda jurisprudencial" module="investigacion"             activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Gavel}      label="Sentencias CJF/SCJN"      badge="2.3M" badgeVariant="default" module="investigacion-sentencias"  activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Archive}    label="Mis colecciones"          module="investigacion-colecciones" activeModule={activeModule} onNavigate={navigate} />

        <NavSection label="Comunicación" />
        <NavItem icon={MessageSquare} label="Chat interno"     badge={5} badgeVariant="critical" module="chat"          activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={CreditCard}    label="Facturación"                                        module="facturacion"   activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Newspaper}     label="Noticias jurídicas"                                 module="noticias"      activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={Bell}          label="Notificaciones"   badge={7} badgeVariant="critical" module="notificaciones" activeModule={activeModule} onNavigate={navigate} />

        <NavSection label="Herramientas" />
        <NavItem icon={Clock}         label="Tiempo facturado"                                   module="tiempo-facturado" activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={AlertCircle}   label="Vencimientos"     badge={3} badgeVariant="warning"  module="vencimientos"     activeModule={activeModule} onNavigate={navigate} />
        <NavItem icon={CheckSquare}   label="Por hacer"        badge={8} badgeVariant="critical" module="por-hacer"        activeModule={activeModule} onNavigate={navigate} />

        <NavSection label="Administración" />
        <NavItem icon={Building2}     label="Despacho"                                           module="despacho"         activeModule={activeModule} onNavigate={navigate} />
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border-default)", flexShrink: 0 }}>
        <NavItem icon={Settings} label="Configuración" />
        <NavItem icon={LogOut}   label="Cerrar sesión" danger />
        <div className="flex items-center gap-3 mt-1" style={{ padding: "10px 12px" }}>
          <div className="relative shrink-0" style={{ display: "inline-block" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#725a4214", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#725a42" }}>MG</div>
            <span style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, background: "var(--status-success)", border: "2px solid #fff", borderRadius: "50%" }} />
          </div>
          <div className="min-w-0">
            <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-charcoal)" }}>María González</p>
            <p className="truncate" style={{ fontSize: 11, color: "var(--color-slate-400)" }}>Socia directora</p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <div
        className="hidden md:flex w-64 flex-col shrink-0"
        style={{ background: "#fff", borderRight: "1px solid var(--border-default)", height: "100vh" }}
      >
        {inner}
      </div>

      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed left-0 top-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#fff", borderRight: "1px solid var(--border-default)" }}
      >
        {inner}
      </div>
    </>
  )
}
