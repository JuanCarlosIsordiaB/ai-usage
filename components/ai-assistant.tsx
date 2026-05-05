"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, FileText, Search, MessageSquare, Zap, Upload, Copy, Sparkles } from "lucide-react"

export function AIAssistant() {
  const [query, setQuery] = useState("")
  const [documentText, setDocumentText] = useState("")

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-[22px] font-semibold text-foreground flex items-center justify-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Asistente IA jurídica
        </h1>
        <p className="text-muted-foreground">Potencia tu práctica legal con inteligencia artificial avanzada</p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Chat Legal</TabsTrigger>
          <TabsTrigger value="document">Redacción</TabsTrigger>
          <TabsTrigger value="analysis">Análisis</TabsTrigger>
          <TabsTrigger value="research">Investigación</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Consulta Legal Instantánea
              </CardTitle>
              <CardDescription>Haz preguntas sobre derecho mexicano, jurisprudencia y procedimientos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Escribe tu consulta legal aquí..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button className="w-full gap-2">
                  <Sparkles className="w-4 h-4" />
                  Consultar IA Jurídica
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Consultas Frecuentes:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start text-left h-auto p-3 bg-transparent">
                    ¿Cuáles son los requisitos para una demanda laboral?
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-left h-auto p-3 bg-transparent">
                    Plazos de prescripción en derecho civil
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-left h-auto p-3 bg-transparent">
                    Procedimiento de divorcio incausado
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-left h-auto p-3 bg-transparent">
                    Constitución de sociedades mercantiles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generador de Documentos
                </CardTitle>
                <CardDescription>Crea documentos legales personalizados con IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    Generar Demanda
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <FileText className="w-4 h-4" />
                    Crear Contrato
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <FileText className="w-4 h-4" />
                    Redactar Promoción
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <FileText className="w-4 h-4" />
                    Escribir Recurso
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Estilos de Redacción:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Formal</Badge>
                    <Badge variant="outline">Directo</Badge>
                    <Badge variant="outline">Técnico</Badge>
                    <Badge variant="outline">Persuasivo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Mejora de Textos
                </CardTitle>
                <CardDescription>Optimiza documentos existentes con IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Pega aquí el texto que quieres mejorar..."
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <Zap className="w-4 h-4" />
                    Mejorar Texto
                  </Button>
                  <Button variant="outline" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Análisis de Documentos
              </CardTitle>
              <CardDescription>
                Sube documentos para análisis automático y extracción de información clave
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Arrastra archivos aquí o haz clic para seleccionar</p>
                <Button variant="outline">Seleccionar Archivos</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">Contratos</p>
                    <p className="text-sm text-muted-foreground">Análisis de cláusulas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-chart-2 mx-auto mb-2" />
                    <p className="font-medium">Sentencias</p>
                    <p className="text-sm text-muted-foreground">Extracción de argumentos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-chart-4 mx-auto mb-2" />
                    <p className="font-medium">Expedientes</p>
                    <p className="text-sm text-muted-foreground">Resumen automático</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Búsqueda Jurisprudencial IA
              </CardTitle>
              <CardDescription>Busca en más de 2.3 millones de sentencias usando lenguaje natural</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Ej: Sentencias sobre despido injustificado en empresas tecnológicas"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Buscar con IA
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Filtros Inteligentes:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Materia</Badge>
                    <Badge variant="outline">Tribunal</Badge>
                    <Badge variant="outline">Año</Badge>
                    <Badge variant="outline">Sentido</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Búsquedas Recientes:</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground cursor-pointer hover:text-foreground">
                      • Responsabilidad civil médica
                    </p>
                    <p className="text-muted-foreground cursor-pointer hover:text-foreground">
                      • Contratos de arrendamiento
                    </p>
                    <p className="text-muted-foreground cursor-pointer hover:text-foreground">
                      • Derecho de autor digital
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
