"use client"

import { useState } from "react"
import { Search, Gavel, Filter, BookOpen, ExternalLink, Star, StarOff, Clock, ChevronRight, Scale, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Tesis {
  id: string
  registro: string
  titulo: string
  tribunal: string
  materia: string
  tipo: "Jurisprudencia" | "Tesis aislada"
  epoca: string
  fecha: string
  saved: boolean
  texto: string
}

const TESIS_DATA: Tesis[] = [
  {
    id: "1",
    registro: "2028453",
    titulo: "DESPIDO INJUSTIFICADO. LA CARGA DE LA PRUEBA RECAE EN EL PATRÓN CUANDO EL TRABAJADOR NIEGA HABERLO PROVOCADO.",
    tribunal: "SCJN — Segunda Sala",
    materia: "Laboral",
    tipo: "Jurisprudencia",
    epoca: "Undécima Época",
    fecha: "Ene 2024",
    saved: false,
    texto: "Cuando el trabajador demanda el pago de indemnización constitucional por despido injustificado y el patrón niega el hecho argumentando que la separación fue por renuncia voluntaria o por causa justificada, la carga de la prueba le corresponde al patrón...",
  },
  {
    id: "2",
    registro: "2027891",
    titulo: "CONTRATOS ELECTRÓNICOS. REQUISITOS DE VALIDEZ CONFORME AL CÓDIGO DE COMERCIO.",
    tribunal: "Tribunales Colegiados de Circuito",
    materia: "Civil / Mercantil",
    tipo: "Tesis aislada",
    epoca: "Undécima Época",
    fecha: "Dic 2023",
    saved: true,
    texto: "Para que un contrato celebrado por medios electrónicos sea válido, deben satisfacerse los requisitos generales de existencia y validez de los actos jurídicos, así como los especiales previstos en los artículos 89 a 94 del Código de Comercio...",
  },
  {
    id: "3",
    registro: "2027340",
    titulo: "AMPARO DIRECTO. PROCEDENCIA CUANDO LA SENTENCIA DE SEGUNDO GRADO ES EMITIDA EN JUICIO ORAL CIVIL.",
    tribunal: "SCJN — Primera Sala",
    materia: "Civil",
    tipo: "Jurisprudencia",
    epoca: "Undécima Época",
    fecha: "Nov 2023",
    saved: false,
    texto: "Es procedente el juicio de amparo directo en contra de las sentencias definitivas dictadas por los Tribunales de Apelación en los juicios orales civiles, toda vez que dichas resoluciones ponen fin al juicio...",
  },
  {
    id: "4",
    registro: "2026990",
    titulo: "DIVORCIO INCAUSADO. LA LIQUIDACIÓN DEL RÉGIMEN PATRIMONIAL ES INDEPENDIENTE AL DECRETO.",
    tribunal: "Tribunales Colegiados de Circuito",
    materia: "Familiar",
    tipo: "Jurisprudencia",
    epoca: "Undécima Época",
    fecha: "Oct 2023",
    saved: false,
    texto: "El divorcio incausado puede decretarse sin necesidad de que el juez resuelva previamente las cuestiones patrimoniales del matrimonio, pues éstas pueden ventilarse en procedimiento aparte...",
  },
  {
    id: "5",
    registro: "2026541",
    titulo: "USUCAPIÓN. ELEMENTOS QUE DEBEN ACREDITARSE PARA SU PROCEDENCIA.",
    tribunal: "SCJN — Primera Sala",
    materia: "Civil",
    tipo: "Jurisprudencia",
    epoca: "Undécima Época",
    fecha: "Sep 2023",
    saved: true,
    texto: "Para que opere la prescripción adquisitiva o usucapión es necesario que quien pretenda ser declarado propietario acredite: 1) posesión en concepto de dueño; 2) posesión pacífica; 3) posesión continua; y 4) posesión pública...",
  },
]

export function InvestigacionJuridica({ initialTab = "busqueda" }: { initialTab?: string }) {
  const [query, setQuery] = useState("")
  const [materia, setMateria] = useState("todas")
  const [tribunal, setTribunal] = useState("todos")
  const [results, setResults] = useState<Tesis[]>([])
  const [searched, setSearched] = useState(false)
  const [tesis, setTesis] = useState(TESIS_DATA)
  const [selected, setSelected] = useState<Tesis | null>(null)

  function handleSearch() {
    const q = query.toLowerCase()
    const filtered = tesis.filter((t) => {
      const matchQ = !q || t.titulo.toLowerCase().includes(q) || t.registro.includes(q) || t.texto.toLowerCase().includes(q)
      const matchM = materia === "todas" || t.materia.toLowerCase().includes(materia.toLowerCase())
      const matchT = tribunal === "todos" || t.tribunal.includes(tribunal)
      return matchQ && matchM && matchT
    })
    setResults(filtered)
    setSearched(true)
  }

  function toggleSave(id: string) {
    setTesis(tesis.map((t) => (t.id === id ? { ...t, saved: !t.saved } : t)))
    if (selected?.id === id) setSelected({ ...selected, saved: !selected.saved })
  }

  const saved = tesis.filter((t) => t.saved)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-border shrink-0">
        <h1 className="text-[20px] font-semibold text-foreground flex items-center gap-2">
          <Gavel className="w-5 h-5 text-primary" />
          Investigación jurídica
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Consulta jurisprudencia y tesis del CJF y SCJN — más de 2.3M registros</p>
      </div>

      <Tabs defaultValue={initialTab} className="flex flex-col flex-1 overflow-hidden">
        <div className="px-6 pt-4 shrink-0">
          <TabsList>
            <TabsTrigger value="busqueda" className="gap-2">
              <Search className="w-3.5 h-3.5" />Búsqueda
            </TabsTrigger>
            <TabsTrigger value="sentencias" className="gap-2">
              <Scale className="w-3.5 h-3.5" />Sentencias SCJN
            </TabsTrigger>
            <TabsTrigger value="colecciones" className="gap-2">
              <Star className="w-3.5 h-3.5" />Guardados ({saved.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* BÚSQUEDA */}
        <TabsContent value="busqueda" className="flex-1 overflow-auto px-6 pb-6 mt-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar tesis o jurisprudencia..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="w-4 h-4" />Buscar
                </Button>
              </div>
              <div className="flex gap-3">
                <Select value={materia} onValueChange={setMateria}>
                  <SelectTrigger className="w-44">
                    <Filter className="w-3.5 h-3.5 mr-1.5" />
                    <SelectValue placeholder="Materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las materias</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Laboral">Laboral</SelectItem>
                    <SelectItem value="Familiar">Familiar</SelectItem>
                    <SelectItem value="Mercantil">Mercantil</SelectItem>
                    <SelectItem value="Penal">Penal</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                    <SelectItem value="Constitucional">Constitucional</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tribunal} onValueChange={setTribunal}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Tribunal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tribunales</SelectItem>
                    <SelectItem value="SCJN">SCJN</SelectItem>
                    <SelectItem value="Tribunales Colegiados">Tribunales Colegiados</SelectItem>
                    <SelectItem value="Plenos de Circuito">Plenos de Circuito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {!searched && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">Ingresa un término para buscar tesis y jurisprudencia</p>
              <p className="text-[12px] mt-1">Puedes buscar por tema, número de registro o palabras clave</p>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">No se encontraron resultados para tu búsqueda</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-[13px] text-muted-foreground">{results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}</p>
              {results.map((t) => (
                <Card key={t.id} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setSelected(t)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={t.tipo === "Jurisprudencia" ? "default" : "secondary"} className="text-[10px]">
                            {t.tipo}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">{t.materia}</Badge>
                          <span className="text-[11px] text-muted-foreground font-mono">Reg. {t.registro}</span>
                        </div>
                        <p className="text-[13px] font-medium text-foreground leading-snug">{t.titulo}</p>
                        <p className="text-[12px] text-muted-foreground line-clamp-2">{t.texto}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span className="flex items-center gap-1"><Gavel className="w-3 h-3" />{t.tribunal}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.epoca} · {t.fecha}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); toggleSave(t.id) }}
                        >
                          {t.saved
                            ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            : <StarOff className="w-4 h-4 text-muted-foreground" />}
                        </Button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Detail panel */}
          {selected && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={selected.tipo === "Jurisprudencia" ? "default" : "secondary"}>{selected.tipo}</Badge>
                        <Badge variant="outline">{selected.materia}</Badge>
                        <span className="text-[11px] text-muted-foreground font-mono self-center">Registro {selected.registro}</span>
                      </div>
                      <CardTitle className="text-[14px] leading-snug">{selected.titulo}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setSelected(null)}>✕</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div><span className="text-muted-foreground">Tribunal: </span><span className="font-medium">{selected.tribunal}</span></div>
                    <div><span className="text-muted-foreground">Época: </span><span className="font-medium">{selected.epoca}</span></div>
                    <div><span className="text-muted-foreground">Publicación: </span><span className="font-medium">{selected.fecha}</span></div>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Texto</p>
                    <p className="text-[13px] text-foreground leading-relaxed">{selected.texto}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="gap-2 flex-1" onClick={() => toggleSave(selected.id)}>
                      {selected.saved ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      {selected.saved ? "Quitar de guardados" : "Guardar tesis"}
                    </Button>
                    <Button variant="outline" className="gap-2" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* SENTENCIAS SCJN */}
        <TabsContent value="sentencias" className="flex-1 overflow-auto px-6 pb-6 mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "SCJN — Primera Sala", desc: "Civil, familiar, penal y constitucional", count: "820K", icon: Scale },
              { label: "SCJN — Segunda Sala", desc: "Laboral, administrativa y fiscal", count: "740K", icon: Scale },
              { label: "Pleno de la SCJN", desc: "Controversias constitucionales y acciones de inconstitucionalidad", count: "180K", icon: Gavel },
            ].map((s) => (
              <Card key={s.label} className="cursor-pointer hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex gap-3">
                  <s.icon className="w-8 h-8 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{s.label}</p>
                    <p className="text-[12px] text-muted-foreground">{s.desc}</p>
                    <p className="text-[12px] text-primary font-medium mt-1">{s.count} sentencias</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Buscar por número de expediente, tema o año..." />
                </div>
                <Button className="gap-2"><Search className="w-4 h-4" />Buscar</Button>
              </div>
            </CardContent>
          </Card>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-[14px]">Busca entre más de 1.7 millones de sentencias de la SCJN</p>
          </div>
        </TabsContent>

        {/* GUARDADOS */}
        <TabsContent value="colecciones" className="flex-1 overflow-auto px-6 pb-6 mt-4 space-y-3">
          {saved.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">No tienes tesis guardadas</p>
              <p className="text-[12px] mt-1">Guarda tesis de tus búsquedas para acceder rápidamente</p>
            </div>
          ) : (
            saved.map((t) => (
              <Card key={t.id} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setSelected(t)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={t.tipo === "Jurisprudencia" ? "default" : "secondary"} className="text-[10px]">{t.tipo}</Badge>
                        <Badge variant="outline" className="text-[10px]">{t.materia}</Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">Reg. {t.registro}</span>
                      </div>
                      <p className="text-[13px] font-medium text-foreground leading-snug">{t.titulo}</p>
                      <p className="text-[12px] text-muted-foreground">{t.tribunal} · {t.fecha}</p>
                    </div>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7 shrink-0"
                      onClick={(e) => { e.stopPropagation(); toggleSave(t.id) }}
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

