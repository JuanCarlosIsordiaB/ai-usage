"use client"

import { useState } from "react"
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

const MODULES = [
  "notificaciones", "chat", "base-de-datos", "documentos", "calendario",
  "facturacion", "asistente-ia", "noticias", "expedientes", "clientes",
  "investigacion", "tiempo-facturado", "vencimientos",
] as const
type Module = (typeof MODULES)[number]

export default function HomePage() {
  const [activeModule, setActiveModule] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeModule={activeModule} onNavigate={setActiveModule} />
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
        {activeModule === "investigacion"   && <InvestigacionJuridica />}
        {activeModule === "tiempo-facturado" && <TiempoFacturado />}
        {activeModule === "vencimientos"    && <Vencimientos />}
        {!MODULES.includes(activeModule as Module) && <Dashboard />}
      </main>
    </div>
  )
}
