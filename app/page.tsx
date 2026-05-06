"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { NotificacionesJuridicas } from "@/components/notificaciones-juridicas"
import { ChatInterno } from "@/components/chat-interno"
import { BaseDeDatos } from "@/components/base-de-datos"
import { EditorDocumentos } from "@/components/editor-documentos"
import { Calendario } from "@/components/calendario"
import { Facturacion } from "@/components/facturacion"
import { AIAssistant } from "@/components/ai-assistant"
import { LegalNews } from "@/components/legal-news"
import { Expedientes } from "@/components/expedientes"
import { Clientes } from "@/components/clientes"
import { InvestigacionJuridica } from "@/components/investigacion-juridica"
import { TiempoFacturado } from "@/components/tiempo-facturado"
import { Vencimientos } from "@/components/vencimientos"
import { PorHacer } from "@/components/por-hacer"
import { Despacho } from "@/components/despacho"

const MODULES = [
  "notificaciones", "chat", "base-de-datos", "documentos", "calendario",
  "facturacion", "asistente-ia", "noticias", "expedientes", "clientes",
  "investigacion", "investigacion-sentencias", "investigacion-colecciones",
  "tiempo-facturado", "vencimientos", "por-hacer", "despacho",
] as const
type Module = (typeof MODULES)[number]

const MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard", notificaciones: "Notificaciones", chat: "Chat interno",
  "base-de-datos": "Base de datos", documentos: "Documentos", calendario: "Calendario",
  facturacion: "Facturación", "asistente-ia": "Asistente IA", noticias: "Noticias",
  expedientes: "Expedientes", clientes: "Clientes", investigacion: "Investigación",
  "investigacion-sentencias": "Sentencias", "investigacion-colecciones": "Colecciones",
  "tiempo-facturado": "Tiempo facturado", vencimientos: "Vencimientos",
  "por-hacer": "Por hacer", despacho: "Despacho",
}

export default function HomePage() {
  const [activeModule, setActiveModule] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeModule={activeModule}
        onNavigate={setActiveModule}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden h-14 bg-white border-b border-[#EAEAEA] flex items-center gap-3 px-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5] text-[#555555]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 600, color: "#111111" }}>
            {MODULE_LABELS[activeModule] ?? "LegalPro"}
          </span>
        </header>

        <main className="flex-1 overflow-hidden">
        {activeModule === "notificaciones"  && <NotificacionesJuridicas />}
        {activeModule === "chat"            && <ChatInterno />}
        {activeModule === "base-de-datos"   && <BaseDeDatos />}
        {activeModule === "documentos"      && <EditorDocumentos />}
        {activeModule === "calendario"      && <Calendario />}
        {activeModule === "facturacion"     && <Facturacion />}
        {activeModule === "asistente-ia"    && <AIAssistant />}
        {activeModule === "noticias"        && <LegalNews />}
        {activeModule === "expedientes"     && <Expedientes />}
        {activeModule === "clientes"        && <Clientes />}
        {activeModule === "investigacion"              && <InvestigacionJuridica initialTab="busqueda" />}
        {activeModule === "investigacion-sentencias"   && <InvestigacionJuridica initialTab="sentencias" />}
        {activeModule === "investigacion-colecciones"  && <InvestigacionJuridica initialTab="colecciones" />}
        {activeModule === "tiempo-facturado" && <TiempoFacturado />}
        {activeModule === "vencimientos"    && <Vencimientos />}
        {activeModule === "por-hacer"       && <PorHacer />}
        {activeModule === "despacho"        && <Despacho />}
        {!MODULES.includes(activeModule as Module) && <Dashboard />}
        </main>
      </div>
    </div>
  )
}
