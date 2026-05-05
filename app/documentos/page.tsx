"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DocumentosList, type Document } from "@/components/documentos-list"
import { DocumentosEditor } from "@/components/documentos-editor"

export default function DocumentosPage() {
  const [openDoc, setOpenDoc] = useState<Document | null>(null)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {openDoc ? (
          <DocumentosEditor document={openDoc} onBack={() => setOpenDoc(null)} />
        ) : (
          <DocumentosList onOpen={setOpenDoc} />
        )}
      </main>
    </div>
  )
}
