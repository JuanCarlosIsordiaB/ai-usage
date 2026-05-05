"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Scale,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  Settings,
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
} from "lucide-react"

interface SidebarProps {
  activeModule?: string
  onNavigate?: (module: string) => void
}

const BADGE_COLORS = {
  default: "bg-[#F4F5F7] text-[#6B7280]",
  critical: "bg-[#FCE7EB] text-[#E11D48]",
  warning:  "bg-[#FEF3C7] text-[#F59E0B]",
  info:     "bg-[#E6EEFC] text-[#2563EB]",
  success:  "bg-[#E8F7EE] text-[#16A34A]",
}

interface NavItemProps {
  icon: LucideIcon
  label: string
  module?: string
  activeModule?: string
  onNavigate?: (module: string) => void
  badge?: string | number
  badgeColor?: keyof typeof BADGE_COLORS
}

function NavItem({
  icon: Icon,
  label,
  module,
  activeModule,
  onNavigate,
  badge,
  badgeColor = "default",
}: NavItemProps) {
  const isActive = module !== undefined && activeModule === module
  return (
    <button
      onClick={() => module && onNavigate?.(module)}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 h-10 rounded-lg text-[14px] transition-colors duration-75 text-left",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-[#6B7280] hover:bg-[#F4F5F7] hover:text-[#1A1D1F]"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none shrink-0",
            isActive ? "bg-white/25 text-white" : BADGE_COLORS[badgeColor]
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
    <p className="px-3 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF] select-none">
      {label}
    </p>
  )
}

export function Sidebar({ activeModule = "dashboard", onNavigate }: SidebarProps) {
  return (
    <div className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Brand */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Scale className="w-[18px] h-[18px] text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#1A1D1F] leading-none">LegalPro</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">Despacho Jurídico</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <NavItem
          icon={Home}
          label="Dashboard"
          module="dashboard"
          activeModule={activeModule}
          onNavigate={onNavigate}
        />

        <NavSection label="Gestión de casos" />
        <NavItem icon={FileText} label="Expedientes" badge={24} badgeColor="info" module="expedientes" activeModule={activeModule} onNavigate={onNavigate} />
        <NavItem icon={Users}    label="Clientes"    badge={156} module="clientes" activeModule={activeModule} onNavigate={onNavigate} />
        <NavItem icon={Calendar} label="Calendario"  module="calendario" activeModule={activeModule} onNavigate={onNavigate} badge={3} badgeColor="critical" />

        <NavSection label="Documentos e IA" />
        <NavItem
          icon={FileEdit}
          label="Editor de documentos"
          module="documentos"
          activeModule={activeModule}
          onNavigate={onNavigate}
        />
        <NavItem
          icon={Archive}
          label="Base de datos"
          module="base-de-datos"
          activeModule={activeModule}
          onNavigate={onNavigate}
        />
        <NavItem icon={Bot} label="Asistente IA" module="asistente-ia" activeModule={activeModule} onNavigate={onNavigate} />

        <NavSection label="Investigación legal" />
        <NavItem icon={Search}  label="Búsqueda jurisprudencial" module="investigacion" activeModule={activeModule} onNavigate={onNavigate} />
        <NavItem icon={Gavel}   label="Sentencias CJF/SCJN" badge="2.3M" module="investigacion" activeModule={activeModule} onNavigate={onNavigate} />
        <NavItem icon={Archive} label="Mis colecciones" module="investigacion" activeModule={activeModule} onNavigate={onNavigate} />

        <NavSection label="Comunicación" />
        <NavItem
          icon={MessageSquare}
          label="Chat interno"
          module="chat"
          activeModule={activeModule}
          onNavigate={onNavigate}
          badge={5}
          badgeColor="critical"
        />
        <NavItem
          icon={CreditCard}
          label="Facturación"
          module="facturacion"
          activeModule={activeModule}
          onNavigate={onNavigate}
        />
        <NavItem icon={Newspaper} label="Noticias jurídicas" module="noticias" activeModule={activeModule} onNavigate={onNavigate} />
        <NavItem
          icon={Bell}
          label="Notificaciones"
          module="notificaciones"
          activeModule={activeModule}
          onNavigate={onNavigate}
          badge={7}
          badgeColor="critical"
        />

        <NavSection label="Herramientas" />
        <NavItem icon={Clock}       label="Tiempo facturado" module="tiempo-facturado" activeModule={activeModule} onNavigate={onNavigate} />
        <NavItem icon={AlertCircle} label="Vencimientos" badge={3} badgeColor="warning" module="vencimientos" activeModule={activeModule} onNavigate={onNavigate} />
      </nav>

      {/* Footer */}
      <div className="px-2 py-2 border-t border-sidebar-border shrink-0">
        <NavItem icon={Settings} label="Configuración" />
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-[#EEF0FF] flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
            MG
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-[#1A1D1F] truncate">María González</p>
            <p className="text-[11px] text-[#9CA3AF] truncate">Socia directora</p>
          </div>
        </div>
      </div>
    </div>
  )
}
