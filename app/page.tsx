"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { NotificacionesJuridicas } from "@/components/notificaciones-juridicas"
import { ChatInterno } from "@/components/chat-interno"
import { BaseDeDatos } from "@/components/base-de-datos"

export default function HomePage() {
  const [activeModule, setActiveModule] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeModule={activeModule} onNavigate={setActiveModule} />
      <main className="flex-1 overflow-hidden">
        {activeModule === "notificaciones" && <NotificacionesJuridicas />}
        {activeModule === "chat" && <ChatInterno />}
        {activeModule === "base-de-datos" && <BaseDeDatos />}
        {activeModule !== "notificaciones" && activeModule !== "chat" && activeModule !== "base-de-datos" && <Dashboard />}
      </main>
    </div>
  )
}
