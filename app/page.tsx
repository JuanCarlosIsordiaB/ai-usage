"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { NotificacionesJuridicas } from "@/components/notificaciones-juridicas"
import { ChatInterno } from "@/components/chat-interno"
import { BaseDeDatos } from "@/components/base-de-datos"
import { EditorDocumentos } from "@/components/editor-documentos"
import { Calendario } from "@/components/calendario"

const MODULES = ["notificaciones", "chat", "base-de-datos", "documentos", "calendario"] as const
type Module = (typeof MODULES)[number]

export default function HomePage() {
  const [activeModule, setActiveModule] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeModule={activeModule} onNavigate={setActiveModule} />
      <main className="flex-1 overflow-hidden">
        {activeModule === "notificaciones" && <NotificacionesJuridicas />}
        {activeModule === "chat"           && <ChatInterno />}
        {activeModule === "base-de-datos"  && <BaseDeDatos />}
        {activeModule === "documentos"     && <EditorDocumentos />}
        {activeModule === "calendario"     && <Calendario />}
        {!MODULES.includes(activeModule as Module) && <Dashboard />}
      </main>
    </div>
  )
}
