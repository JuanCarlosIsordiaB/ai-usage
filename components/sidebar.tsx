import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

export function Sidebar({ activeModule = "dashboard", onNavigate }: SidebarProps) {
  const navBtn = (module: string) =>
    `w-full justify-start gap-3 ${
      activeModule === module
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Scale className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">LegalPro</h1>
            <p className="text-sm text-sidebar-foreground/70">Despacho Jurídico</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Button
          variant="ghost"
          className={navBtn("dashboard")}
          onClick={() => onNavigate?.("dashboard")}
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Button>

        <div className="pt-2">
          <p className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-3">GESTIÓN DE CASOS</p>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <FileText className="w-4 h-4" />
            Expedientes
            <Badge variant="secondary" className="ml-auto bg-secondary text-secondary-foreground">
              24
            </Badge>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Users className="w-4 h-4" />
            Clientes
            <Badge variant="outline" className="ml-auto bg-background text-foreground border-border">
              156
            </Badge>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Calendar className="w-4 h-4" />
            Calendario
            <Badge variant="destructive" className="ml-auto bg-destructive text-destructive-foreground">
              3
            </Badge>
          </Button>
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-3">DOCUMENTOS E IA</p>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <FileEdit className="w-4 h-4" />
            Editor de Documentos
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Bot className="w-4 h-4" />
            Asistente IA
          </Button>
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-3">INVESTIGACIÓN LEGAL</p>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Search className="w-4 h-4" />
            Búsqueda Jurisprudencial
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Gavel className="w-4 h-4" />
            Sentencias CJF/SCJN
            <Badge variant="outline" className="ml-auto text-xs bg-background text-foreground border-border">
              2.3M
            </Badge>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Archive className="w-4 h-4" />
            Mis Colecciones
          </Button>
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-3">COMUNICACIÓN</p>

          <Button
            variant="ghost"
            className={navBtn("chat")}
            onClick={() => onNavigate?.("chat")}
          >
            <MessageSquare className="w-4 h-4" />
            Chat Interno
            {activeModule !== "chat" && (
              <Badge variant="destructive" className="ml-auto bg-destructive text-destructive-foreground">
                5
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            className={navBtn("facturacion")}
            onClick={() => onNavigate?.("facturacion")}
          >
            <CreditCard className="w-4 h-4" />
            Facturación
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Newspaper className="w-4 h-4" />
            Noticias Jurídicas
          </Button>

          <Button
            variant="ghost"
            className={navBtn("notificaciones")}
            onClick={() => onNavigate?.("notificaciones")}
          >
            <div className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-destructive rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                7
              </span>
            </div>
            Notificaciones Jurídicas
            <Badge variant="destructive" className="ml-auto bg-destructive text-destructive-foreground text-[10px] h-4 px-1.5">
              7
            </Badge>
          </Button>
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-3">HERRAMIENTAS</p>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Clock className="w-4 h-4" />
            Tiempo Facturado
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <AlertCircle className="w-4 h-4" />
            Vencimientos
            <Badge variant="destructive" className="ml-auto bg-destructive text-destructive-foreground">
              3
            </Badge>
          </Button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="w-4 h-4" />
          Configuración
        </Button>
      </div>
    </div>
  )
}
